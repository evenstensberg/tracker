import { GraphQLID, GraphQLNonNull, GraphQLList } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import { t } from '@lingui/macro'

import { updateDomainUnion } from '../unions'
import { Domain, Selectors } from '../../scalars'
import { logActivity } from '../../audit-logs/mutations/log-activity'
import { inputTag } from '../inputs/domain-tag'

export const updateDomain = new mutationWithClientMutationId({
  name: 'UpdateDomain',
  description:
    'Mutation allows the modification of domains if domain is updated through out its life-cycle',
  inputFields: () => ({
    domainId: {
      type: GraphQLNonNull(GraphQLID),
      description: 'The global id of the domain that is being updated.',
    },
    orgId: {
      type: GraphQLNonNull(GraphQLID),
      description:
        'The global ID of the organization used for permission checks.',
    },
    domain: {
      type: Domain,
      description: 'The new url of the of the old domain.',
    },
    selectors: {
      type: new GraphQLList(Selectors),
      description:
        'The updated DKIM selector strings corresponding to this domain.',
    },
    tags: {
      description: 'List of labelled tags users have applied to the domain.',
      type: new GraphQLList(inputTag),
    },
  }),
  outputFields: () => ({
    result: {
      type: updateDomainUnion,
      description:
        '`UpdateDomainUnion` returning either a `Domain`, or `DomainError` object.',
      resolve: (payload) => payload,
    },
  }),
  mutateAndGetPayload: async (
    args,
    {
      i18n,
      query,
      collections,
      transaction,
      userKey,
      auth: { checkPermission, userRequired, verifiedRequired, tfaRequired },
      validators: { cleanseInput },
      loaders: { loadDomainByKey, loadOrgByKey },
    },
  ) => {
    // Get User
    const user = await userRequired()

    verifiedRequired({ user })
    tfaRequired({ user })

    const { id: domainId } = fromGlobalId(cleanseInput(args.domainId))
    const { id: orgId } = fromGlobalId(cleanseInput(args.orgId))
    const updatedDomain = cleanseInput(args.domain)

    let selectors
    if (typeof args.selectors !== 'undefined') {
      selectors = args.selectors.map((selector) => cleanseInput(selector))
    } else {
      selectors = null
    }

    let tags
    if (typeof args.tags !== 'undefined') {
      tags = args.tags
    } else {
      tags = null
    }

    // Check to see if domain exists
    const domain = await loadDomainByKey.load(domainId)

    if (typeof domain === 'undefined') {
      console.warn(
        `User: ${userKey} attempted to update domain: ${domainId}, however there is no domain associated with that id.`,
      )
      return {
        _type: 'error',
        code: 400,
        description: i18n._(t`Unable to update unknown domain.`),
      }
    }

    // Check to see if org exists
    const org = await loadOrgByKey.load(orgId)

    if (typeof org === 'undefined') {
      console.warn(
        `User: ${userKey} attempted to update domain: ${domainId} for org: ${orgId}, however there is no org associated with that id.`,
      )
      return {
        _type: 'error',
        code: 400,
        description: i18n._(t`Unable to update domain in an unknown org.`),
      }
    }

    // Check permission
    const permission = await checkPermission({ orgId: org._id })

    if (
      permission !== 'user' &&
      permission !== 'admin' &&
      permission !== 'super_admin'
    ) {
      console.warn(
        `User: ${userKey} attempted to update domain: ${domainId} for org: ${orgId}, however they do not have permission in that org.`,
      )
      return {
        _type: 'error',
        code: 403,
        description: i18n._(
          t`Permission Denied: Please contact organization user for help with updating this domain.`,
        ),
      }
    }

    // Check to see if org has a claim to this domain
    let countCursor
    try {
      countCursor = await query`
        WITH claims, domains, organizations
        FOR v, e IN 1..1 ANY ${domain._id} claims
          FILTER e._from == ${org._id}
          RETURN e
      `
    } catch (err) {
      console.error(
        `Database error occurred while user: ${userKey} attempted to update domain: ${domainId}, error: ${err}`,
      )
      throw new Error(i18n._(t`Unable to update domain. Please try again.`))
    }

    if (countCursor.count < 1) {
      console.warn(
        `User: ${userKey} attempted to update domain: ${domainId} for org: ${orgId}, however that org has no claims to that domain.`,
      )
      return {
        _type: 'error',
        code: 400,
        description: i18n._(
          t`Unable to update domain that does not belong to the given organization.`,
        ),
      }
    }

    // Setup Transaction
    const trx = await transaction(collections)

    // Update domain
    const domainToInsert = {
      domain: updatedDomain.toLowerCase() || domain.domain.toLowerCase(),
      lastRan: domain.lastRan,
      selectors: selectors || domain.selectors,
    }

    try {
      await trx.step(
        async () =>
          await query`
          WITH domains
          UPSERT { _key: ${domain._key} }
            INSERT ${domainToInsert}
            UPDATE ${domainToInsert}
            IN domains
      `,
      )
    } catch (err) {
      console.error(
        `Transaction step error occurred when user: ${userKey} attempted to update domain: ${domainId}, error: ${err}`,
      )
      throw new Error(i18n._(t`Unable to update domain. Please try again.`))
    }

    let claimCursor
    let currentTags = ''
    if (tags) {
      try {
        claimCursor = await query`
        WITH claims
        FOR claim IN claims
          FILTER claim._from == ${org._id} && claim._to == ${domain._id}
          RETURN MERGE({ id: claim._key, _type: "claim" }, claim)
      `
      } catch (err) {
        console.error(
          `Database error occurred when user: ${userKey} running loadDomainByKey: ${err}`,
        )
      }
      try {
        currentTags = await claimCursor.next()
      } catch (err) {
        console.error(
          `Cursor error occurred when user: ${userKey} running loadDomainByKey: ${err}`,
        )
      }

      try {
        await trx.step(
          async () =>
            await query`
          WITH claims
          UPSERT { _from: ${org._id}, _to: ${domain._id} }
            INSERT { tags: ${tags} }
            UPDATE { tags: ${tags} }
            IN claims
      `,
        )
      } catch (err) {
        console.error(
          `Transaction step error occurred when user: ${userKey} attempted to update domain edge, error: ${err}`,
        )
        throw new Error(
          i18n._(t`Unable to update domain edge. Please try again.`),
        )
      }
    }

    // Commit transaction
    try {
      await trx.commit()
    } catch (err) {
      console.error(
        `Transaction commit error occurred when user: ${userKey} attempted to update domain: ${domainId}, error: ${err}`,
      )
      throw new Error(i18n._(t`Unable to update domain. Please try again.`))
    }

    // Clear dataloader and load updated domain
    await loadDomainByKey.clear(domain._key)
    const returnDomain = await loadDomainByKey.load(domain._key)

    console.info(`User: ${userKey} successfully updated domain: ${domainId}.`)

    const updatedProperties = []
    if (domainToInsert.domain.toLowerCase() !== domain.domain.toLowerCase()) {
      updatedProperties.push({
        name: 'domain',
        oldValue: domain.domain,
        newValue: domainToInsert.domain,
      })
    }
    if (
      typeof selectors !== 'undefined' &&
      JSON.stringify(domainToInsert.selectors) !==
        JSON.stringify(domain.selectors)
    ) {
      updatedProperties.push({
        name: 'selectors',
        oldValue: domain.selectors,
        newValue: domainToInsert.selectors,
      })
    }

    if (
      typeof tags !== 'undefined' &&
      JSON.stringify(currentTags.tags) !== JSON.stringify(tags)
    ) {
      updatedProperties.push({
        name: 'tags',
        oldValue: currentTags.tags,
        newValue: tags,
      })
    }

    if (updatedProperties.length > 0) {
      await logActivity({
        transaction,
        collections,
        query,
        initiatedBy: {
          id: user._key,
          userName: user.userName,
          role: permission,
        },
        action: 'update',
        target: {
          resource: domain.domain,
          organization: {
            id: org._key,
            name: org.name,
          }, // name of resource being acted upon
          resourceType: 'domain', // user, org, domain
          updatedProperties,
        },
      })
    }

    returnDomain.id = returnDomain._key

    return returnDomain
  },
})
