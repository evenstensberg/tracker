import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import { t } from '@lingui/macro'

import { createDomainUnion } from '../unions'
import { Domain, Selectors } from '../../scalars'
import { logActivity } from '../../audit-logs/mutations/log-activity'
import { inputTag } from '../inputs/domain-tag'

export const createDomain = new mutationWithClientMutationId({
  name: 'CreateDomain',
  description: 'Mutation used to create a new domain for an organization.',
  inputFields: () => ({
    orgId: {
      type: GraphQLNonNull(GraphQLID),
      description:
        'The global id of the organization you wish to assign this domain to.',
    },
    domain: {
      type: GraphQLNonNull(Domain),
      description: 'Url that you would like to be added to the database.',
    },
    selectors: {
      type: new GraphQLList(Selectors),
      description: 'DKIM selector strings corresponding to this domain.',
    },
    tags: {
      description: 'List of labelled tags users have applied to the domain.',
      type: new GraphQLList(inputTag),
    },
  }),
  outputFields: () => ({
    result: {
      type: createDomainUnion,
      description:
        '`CreateDomainUnion` returning either a `Domain`, or `CreateDomainError` object.',
      resolve: (payload) => payload,
    },
  }),
  mutateAndGetPayload: async (
    args,
    {
      i18n,
      request,
      query,
      collections,
      transaction,
      userKey,
      publish,
      auth: {
        checkPermission,
        saltedHash,
        userRequired,
        verifiedRequired,
        tfaRequired,
      },
      loaders: { loadDomainByDomain, loadOrgByKey },
      validators: { cleanseInput },
    },
  ) => {
    // Get User
    const user = await userRequired()

    verifiedRequired({ user })
    tfaRequired({ user })

    // Cleanse input
    const { type: _orgType, id: orgId } = fromGlobalId(cleanseInput(args.orgId))
    const domain = cleanseInput(args.domain)

    let selectors
    if (typeof args.selectors !== 'undefined') {
      selectors = args.selectors.map((selector) => cleanseInput(selector))
    } else {
      selectors = []
    }

    let tags
    if (typeof args.tags !== 'undefined') {
      tags = args.tags
    } else {
      tags = []
    }

    // Check to see if org exists
    const org = await loadOrgByKey.load(orgId)

    if (typeof org === 'undefined') {
      console.warn(
        `User: ${userKey} attempted to create a domain to an organization: ${orgId} that does not exist.`,
      )
      return {
        _type: 'error',
        code: 400,
        description: i18n._(
          t`Unable to create domain in unknown organization.`,
        ),
      }
    }

    // Check to see if user belongs to org
    const permission = await checkPermission({ orgId: org._id })

    if (
      permission !== 'user' &&
      permission !== 'admin' &&
      permission !== 'super_admin'
    ) {
      console.warn(
        `User: ${userKey} attempted to create a domain in: ${org.slug}, however they do not have permission to do so.`,
      )
      return {
        _type: 'error',
        code: 400,
        description: i18n._(
          t`Permission Denied: Please contact organization user for help with creating domain.`,
        ),
      }
    }

    const insertDomain = {
      domain: domain.toLowerCase(),
      lastRan: null,
      selectors: selectors,
      hash: saltedHash(domain.toLowerCase()),
      status: {
        dkim: null,
        dmarc: null,
        https: null,
        spf: null,
        ssl: null,
      },
    }

    // Check to see if domain already belongs to same org
    let checkDomainCursor
    try {
      checkDomainCursor = await query`
        WITH claims, domains, organizations
        LET domainIds = (FOR domain IN domains FILTER domain.domain == ${insertDomain.domain} RETURN { id: domain._id })
        FOR domainId IN domainIds
          LET domainEdges = (FOR v, e IN 1..1 ANY domainId.id claims RETURN { _from: e._from })
            FOR domainEdge IN domainEdges
              LET org = DOCUMENT(domainEdge._from)
              FILTER org._key == ${org._key}
              RETURN MERGE({ _id: org._id, _key: org._key, _rev: org._rev }, TRANSLATE(${request.language}, org.orgDetails))
      `
    } catch (err) {
      console.error(
        `Database error occurred while running check to see if domain already exists in an org: ${err}`,
      )
      throw new Error(i18n._(t`Unable to create domain. Please try again.`))
    }

    let checkOrgDomain
    try {
      checkOrgDomain = await checkDomainCursor.next()
    } catch (err) {
      console.error(
        `Cursor error occurred while running check to see if domain already exists in an org: ${err}`,
      )
      throw new Error(i18n._(t`Unable to create domain. Please try again.`))
    }

    if (typeof checkOrgDomain !== 'undefined') {
      console.warn(
        `User: ${userKey} attempted to create a domain for: ${org.slug}, however that org already has that domain claimed.`,
      )
      return {
        _type: 'error',
        code: 400,
        description: i18n._(
          t`Unable to create domain, organization has already claimed it.`,
        ),
      }
    }

    // Check to see if domain already exists in db
    const checkDomain = await loadDomainByDomain.load(insertDomain.domain)

    // Setup Transaction
    const trx = await transaction(collections)

    let insertedDomainCursor
    if (typeof checkDomain === 'undefined') {
      try {
        insertedDomainCursor = await trx.step(
          () =>
            query`
            WITH domains
            INSERT ${insertDomain} INTO domains
            RETURN MERGE(
              {
                id: NEW._key,
                _type: "domain"
              },
              NEW
            )
          `,
        )
      } catch (err) {
        console.error(
          `Transaction step error occurred for user: ${userKey} when inserting new domain: ${err}`,
        )
        throw new Error(i18n._(t`Unable to create domain. Please try again.`))
      }

      let insertedDomain
      try {
        insertedDomain = await insertedDomainCursor.next()
      } catch (err) {
        console.error(
          `Cursor error occurred for user: ${userKey} after inserting new domain and gathering its domain info: ${err}`,
        )
        throw new Error(i18n._(t`Unable to create domain. Please try again.`))
      }

      try {
        await trx.step(
          () =>
            query`
            WITH claims
            INSERT {
              _from: ${org._id},
              _to: ${insertedDomain._id},
              tags: ${tags}
            } INTO claims
          `,
        )
      } catch (err) {
        console.error(
          `Transaction step error occurred for user: ${userKey} when inserting new domain edge: ${err}`,
        )
        throw new Error(i18n._(t`Unable to create domain. Please try again.`))
      }
    } else {
      const { selectors: selectorList, status, lastRan } = checkDomain

      selectors.forEach((selector) => {
        if (!checkDomain.selectors.includes(selector)) {
          selectorList.push(selector)
        }
      })

      insertDomain.selectors = selectorList
      insertDomain.status = status
      insertDomain.lastRan = lastRan

      try {
        await trx.step(
          () =>
            query`
              WITH claims, domains, organizations
              UPSERT { _key: ${checkDomain._key} }
                INSERT ${insertDomain}
                UPDATE ${insertDomain}
                IN domains
            `,
        )
      } catch (err) {
        console.error(
          `Transaction step error occurred for user: ${userKey} when inserting domain selectors: ${err}`,
        )
        throw new Error(i18n._(t`Unable to create domain. Please try again.`))
      }

      try {
        await trx.step(
          () =>
            query`
            WITH claims
            INSERT {
              _from: ${org._id},
              _to: ${checkDomain._id},
              tags: ${tags}
            } INTO claims
          `,
        )
      } catch (err) {
        console.error(
          `Transaction step error occurred for user: ${userKey} when inserting domain edge: ${err}`,
        )
        throw new Error(i18n._(t`Unable to create domain. Please try again.`))
      }
    }

    try {
      await trx.commit()
    } catch (err) {
      console.error(
        `Transaction commit error occurred while user: ${userKey} was creating domain: ${err}`,
      )
      throw new Error(i18n._(t`Unable to create domain. Please try again.`))
    }

    // Clear dataloader incase anything was updated or inserted into domain
    await loadDomainByDomain.clear(insertDomain.domain)
    const returnDomain = await loadDomainByDomain.load(insertDomain.domain)

    console.info(
      `User: ${userKey} successfully created ${returnDomain.domain} in org: ${org.slug}.`,
    )

    const updatedProperties = []
    if (
      typeof insertDomain.selectors !== 'undefined' &&
      insertDomain.selectors.length > 0
    ) {
      updatedProperties.push({
        name: 'selectors',
        oldValue: [],
        newValue: insertDomain.selectors,
      })
    }

    if (typeof tags !== 'undefined' && tags.length > 0) {
      updatedProperties.push({
        name: 'tags',
        oldValue: [],
        newValue: tags,
      })
    }

    await logActivity({
      transaction,
      collections,
      query,
      initiatedBy: {
        id: user._key,
        userName: user.userName,
        role: permission,
      },
      action: 'add',
      target: {
        resource: insertDomain.domain,
        updatedProperties,
        organization: {
          id: org._key,
          name: org.name,
        }, // name of resource being acted upon
        resourceType: 'domain', // user, org, domain
      },
    })

    await publish({
      channel: `domains.${returnDomain._key}`,
      msg: {
        domain: returnDomain.domain,
        domain_key: returnDomain._key,
        selectors: returnDomain.selectors ? returnDomain.selectors : [],
        hash: returnDomain.hash,
        user_key: null, // only used for One Time Scans
        shared_id: null, // only used for One Time Scans
      },
    })

    return {
      ...returnDomain,
    }
  },
})
