import { GraphQLNonNull, GraphQLID } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import { t } from '@lingui/macro'

import { removeDomainUnion } from '../unions'
import { logActivity } from '../../audit-logs/mutations/log-activity'
import { DomainRemovalReasonEnum } from '../../enums'

export const removeDomain = new mutationWithClientMutationId({
  name: 'RemoveDomain',
  description: 'This mutation allows the removal of unused domains.',
  inputFields: () => ({
    domainId: {
      type: GraphQLNonNull(GraphQLID),
      description: 'The global id of the domain you wish to remove.',
    },
    orgId: {
      type: GraphQLNonNull(GraphQLID),
      description: 'The organization you wish to remove the domain from.',
    },
    reason: {
      type: GraphQLNonNull(DomainRemovalReasonEnum),
      description:
        'The reason given for why this domain is being removed from the organization.',
    },
  }),
  outputFields: () => ({
    result: {
      type: GraphQLNonNull(removeDomainUnion),
      description:
        '`RemoveDomainUnion` returning either a `DomainResultType`, or `DomainErrorType` object.',
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

    // Cleanse Input
    const { type: _domainType, id: domainId } = fromGlobalId(
      cleanseInput(args.domainId),
    )
    const { type: _orgType, id: orgId } = fromGlobalId(cleanseInput(args.orgId))

    // Get domain from db
    const domain = await loadDomainByKey.load(domainId)

    // Check to see if domain exists
    if (typeof domain === 'undefined') {
      console.warn(
        `User: ${userKey} attempted to remove ${domainId} however no domain is associated with that id.`,
      )
      return {
        _type: 'error',
        code: 400,
        description: i18n._(t`Unable to remove unknown domain.`),
      }
    }

    // Get Org from db
    const org = await loadOrgByKey.load(orgId)

    // Check to see if org exists
    if (typeof org === 'undefined') {
      console.warn(
        `User: ${userKey} attempted to remove ${domain.domain} in org: ${orgId} however there is no organization associated with that id.`,
      )
      return {
        _type: 'error',
        code: 400,
        description: i18n._(
          t`Unable to remove domain from unknown organization.`,
        ),
      }
    }

    // Get permission
    const permission = await checkPermission({ orgId: org._id })

    // Check to see if domain belongs to verified check org
    if (org.verified && permission !== 'super_admin') {
      console.warn(
        `User: ${userKey} attempted to remove ${domain.domain} in ${org.slug} but does not have permission to remove a domain from a verified check org.`,
      )
      return {
        _type: 'error',
        code: 403,
        description: i18n._(
          t`Permission Denied: Please contact super admin for help with removing domain.`,
        ),
      }
    }

    if (permission !== 'super_admin' && permission !== 'admin') {
      console.warn(
        `User: ${userKey} attempted to remove ${domain.domain} in ${org.slug} however they do not have permission in that org.`,
      )
      return {
        _type: 'error',
        code: 403,
        description: i18n._(
          t`Permission Denied: Please contact organization admin for help with removing domain.`,
        ),
      }
    }

    // Check to see if more than one organization has a claim to this domain
    let countCursor
    try {
      countCursor = await query`
        WITH claims, domains, organizations
        FOR v, e IN 1..1 ANY ${domain._id} claims RETURN true
      `
    } catch (err) {
      console.error(
        `Database error occurred for user: ${userKey}, when counting domain claims for domain: ${domain.domain}, error: ${err}`,
      )
      throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
    }

    // check to see if org removing domain has ownership
    let dmarcCountCursor
    try {
      dmarcCountCursor = await query`
        WITH domains, organizations, ownership
        FOR v IN 1..1 OUTBOUND ${org._id} ownership RETURN true
      `
    } catch (err) {
      console.error(
        `Database error occurred for user: ${userKey}, when counting ownership claims for domain: ${domain.domain}, error: ${err}`,
      )
      throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
    }

    // Setup Trans action
    const trx = await transaction(collections)

    if (dmarcCountCursor.count === 1) {
      try {
        await trx.step(
          () => query`
            WITH ownership, organizations, domains, dmarcSummaries, domainsToDmarcSummaries
            LET dmarcSummaryEdges = (
              FOR v, e IN 1..1 OUTBOUND ${domain._id} domainsToDmarcSummaries
                RETURN { edgeKey: e._key, dmarcSummaryId: e._to }
            )
            LET removeDmarcSummaryEdges = (
              FOR dmarcSummaryEdge IN dmarcSummaryEdges
                REMOVE dmarcSummaryEdge.edgeKey IN domainsToDmarcSummaries
                OPTIONS { waitForSync: true }
            )
            LET removeDmarcSummary = (
              FOR dmarcSummaryEdge IN dmarcSummaryEdges
                LET key = PARSE_IDENTIFIER(dmarcSummaryEdge.dmarcSummaryId).key
                REMOVE key IN dmarcSummaries
                OPTIONS { waitForSync: true }
            )
            RETURN true
          `,
        )
      } catch (err) {
        console.error(
          `Trx step error occurred when removing dmarc summary data for user: ${userKey} while attempting to remove domain: ${domain.domain}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }

      try {
        await trx.step(
          () => query`
            WITH ownership, organizations, domains
            LET domainEdges = (
              FOR v, e IN 1..1 INBOUND ${domain._id} ownership
                REMOVE e._key IN ownership
                OPTIONS { waitForSync: true }
            )
            RETURN true
          `,
        )
      } catch (err) {
        console.error(
          `Trx step error occurred when removing ownership data for user: ${userKey} while attempting to remove domain: ${domain.domain}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }
    }

    if (countCursor.count <= 1) {
      // Remove scan data

      try {
        // Remove DKIM data
        await trx.step(async () => {
          await query`
            WITH dkim, dkimResults
            FOR dkimV, domainsDkimEdge IN 1..1 OUTBOUND ${domain._id} domainsDKIM
              FOR dkimResult, dkimToDkimResultsEdge In 1..1 OUTBOUND dkimV._id dkimToDkimResults
                REMOVE dkimResult IN dkimResults
                REMOVE dkimToDkimResultsEdge IN dkimToDkimResults
                OPTIONS { waitForSync: true }
              REMOVE dkimV IN dkim
              REMOVE domainsDkimEdge IN domainsDKIM
              OPTIONS { waitForSync: true }
          `
        })
      } catch (err) {
        console.error(
          `Trx step error occurred while user: ${userKey} attempted to remove DKIM data for ${domain.domain} in org: ${org.slug}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }

      try {
        // Remove DMARC data
        await trx.step(async () => {
          await query`
            WITH dmarc
            FOR dmarcV, domainsDmarcEdge IN 1..1 OUTBOUND ${domain._id} domainsDMARC
              REMOVE dmarcV IN dmarc
              REMOVE domainsDmarcEdge IN domainsDMARC
              OPTIONS { waitForSync: true }
          `
        })
      } catch (err) {
        console.error(
          `Trx step error occurred while user: ${userKey} attempted to remove DMARC data for ${domain.domain} in org: ${org.slug}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }

      try {
        // Remove HTTPS data
        await trx.step(async () => {
          await query`
            WITH https
            FOR httpsV, domainsHttpsEdge IN 1..1 OUTBOUND ${domain._id} domainsHTTPS
              REMOVE httpsV IN https
              REMOVE domainsHttpsEdge IN domainsHTTPS
              OPTIONS { waitForSync: true }
          `
        })
      } catch (err) {
        console.error(
          `Trx step error occurred while user: ${userKey} attempted to remove HTTPS data for ${domain.domain} in org: ${org.slug}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }

      try {
        // Remove SPF data
        await trx.step(async () => {
          await query`
            WITH spf
            FOR spfV, domainsSpfEdge IN 1..1 OUTBOUND ${domain._id} domainsSPF
              REMOVE spfV IN spf
              REMOVE domainsSpfEdge IN domainsSPF
              OPTIONS { waitForSync: true }
          `
        })
      } catch (err) {
        console.error(
          `Trx step error occurred while user: ${userKey} attempted to remove SPF data for ${domain.domain} in org: ${org.slug}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }

      try {
        // Remove SSL data
        await trx.step(async () => {
          await query`
            WITH ssl
            FOR sslV, domainsSslEdge IN 1..1 OUTBOUND ${domain._id} domainsSSL
              REMOVE sslV IN ssl
              REMOVE domainsSslEdge IN domainsSSL
              OPTIONS { waitForSync: true }
          `
        })
      } catch (err) {
        console.error(
          `Trx step error occurred while user: ${userKey} attempted to remove SSL data for ${domain.domain} in org: ${org.slug}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }

      try {
        // Remove domain
        await trx.step(async () => {
          await query`
            FOR claim IN claims
              FILTER claim._to == ${domain._id}
              REMOVE claim IN claims
            REMOVE ${domain} IN domains
          `
        })
      } catch (err) {
        console.error(
          `Trx step error occurred while user: ${userKey} attempted to remove domain ${domain.domain} in org: ${org.slug}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }
    } else {
      try {
        await trx.step(async () => {
          await query`
            WITH claims, domains, organizations
            LET domainEdges = (FOR v, e IN 1..1 INBOUND ${domain._id} claims RETURN { _key: e._key, _from: e._from, _to: e._to })
            LET edgeKeys = (
              FOR domainEdge IN domainEdges
                FILTER domainEdge._to ==  ${domain._id}
                FILTER domainEdge._from == ${org._id}
                RETURN domainEdge._key
            )
            FOR edgeKey IN edgeKeys
              REMOVE edgeKey IN claims
              OPTIONS { waitForSync: true }
          `
        })
      } catch (err) {
        console.error(
          `Trx step error occurred while user: ${userKey} attempted to remove claim for ${domain.domain} in org: ${org.slug}, error: ${err}`,
        )
        throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
      }
    }

    // Commit transaction
    try {
      await trx.commit()
    } catch (err) {
      console.error(
        `Trx commit error occurred while user: ${userKey} attempted to remove ${domain.domain} in org: ${org.slug}, error: ${err}`,
      )
      throw new Error(i18n._(t`Unable to remove domain. Please try again.`))
    }

    console.info(
      `User: ${userKey} successfully removed domain: ${domain.domain} from org: ${org.slug}.`,
    )
    await logActivity({
      transaction,
      collections,
      query,
      initiatedBy: {
        id: user._key,
        userName: user.userName,
        role: permission,
      },
      action: 'remove',
      target: {
        resource: domain.domain,
        organization: {
          id: org._key,
          name: org.name,
        }, // name of resource being acted upon
        resourceType: 'domain', // user, org, domain
      },
      reason: args.reason,
    })

    return {
      _type: 'result',
      status: i18n._(
        t`Successfully removed domain: ${domain.domain} from ${org.slug}.`,
      ),
      domain,
    }
  },
})
