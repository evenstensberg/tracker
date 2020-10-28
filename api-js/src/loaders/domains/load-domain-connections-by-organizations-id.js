const { aql } = require('arangojs')
const { fromGlobalId, toGlobalId } = require('graphql-relay')
const { t } = require('@lingui/macro')

const domainLoaderConnectionsByOrgId = (
  query,
  userId,
  cleanseInput,
  i18n,
) => async ({ orgId, after, before, first, last }) => {
  let afterTemplate = aql``
  let beforeTemplate = aql``

  const userDBId = `users/${userId}`

  let afterId
  if (typeof after !== 'undefined') {
    afterId = fromGlobalId(cleanseInput(after)).id
    afterTemplate = aql`FILTER TO_NUMBER(domain._key) > TO_NUMBER(${afterId})`
  }

  let beforeId
  if (typeof before !== 'undefined') {
    beforeId = fromGlobalId(cleanseInput(before)).id
    beforeTemplate = aql`FILTER TO_NUMBER(domain._key) < TO_NUMBER(${beforeId})`
  }

  let limitTemplate = aql``
  if (typeof first === 'undefined' && typeof last === 'undefined') {
    console.warn(
      `User: ${userId} did not have either \`first\` or \`last\` arguments set for: domainLoaderConnectionsByOrgId.`,
    )
    throw new Error(
      i18n._(
        t`You must provide a \`first\` or \`last\` value to properly paginate the \`domains\` connection.`,
      ),
    )
  } else if (first < 0 || last < 0) {
    const argSet = typeof first !== 'undefined' ? 'first' : 'last'
    console.warn(
      `User: ${userId} attempted to have \`${argSet}\` set below zero for: domainLoaderConnectionsByOrgId.`,
    )
    throw new Error(
      i18n._(
        t`\`${argSet}\` on the \`domains\` connection cannot be less than zero.`,
      ),
    )
  } else if (first > 100 || last > 100) {
    const argSet = typeof first !== 'undefined' ? 'first' : 'last'
    const amount = typeof first !== 'undefined' ? first : last
    console.warn(
      `User: ${userId} attempted to have \`${argSet}\` to ${amount} for: domainLoaderConnectionsByOrgId.`,
    )
    throw new Error(
      i18n._(
        t`Requesting \`${amount}\` records on the \`domains\` connection exceeds the \`${argSet}\` limit of 100 records.`,
      ),
    )
  } else if (typeof first !== 'undefined' && typeof last === 'undefined') {
    limitTemplate = aql`SORT domain._key ASC LIMIT TO_NUMBER(${first})`
  } else if (typeof first === 'undefined' && typeof last !== 'undefined') {
    limitTemplate = aql`SORT domain._key DESC LIMIT TO_NUMBER(${last})`
  } else {
    console.warn(
      `User: ${userId} attempted to have \`first\` and \`last\` arguments set for: domainLoaderConnectionsByOrgId.`,
    )
    throw new Error(
      i18n._(
        t`Passing both \`first\` and \`last\` to paginate the \`domains\` connection is not supported.`,
      ),
    )
  }

  let sortString
  if (typeof last !== 'undefined') {
    sortString = aql`DESC`
  } else {
    sortString = aql`ASC`
  }

  let requestedDomainInfo
  try {
    requestedDomainInfo = await query`
    LET domainIds = UNIQUE(FLATTEN(
      LET superAdmin = (FOR v, e IN 1 INBOUND ${userDBId} affiliations FILTER e.permission == "super_admin" RETURN e.permission)
      LET affiliationKeys = (FOR v, e IN 1..1 INBOUND ${userDBId} affiliations RETURN v._key)
      LET superAdminOrgs = (FOR org IN organizations RETURN org._key)
      LET keys = ('super_admin' IN superAdmin ? superAdminOrgs : affiliationKeys)
      LET claimKeys = (FOR v, e IN 1..1 OUTBOUND ${orgId} claims RETURN v._key)
      LET orgKeys = INTERSECTION(keys, claimKeys)
        RETURN claimKeys
    ))
    
    LET retrievedDomains = (
      FOR domain IN domains
        FILTER domain._key IN domainIds
        ${afterTemplate}
        ${beforeTemplate}
        ${limitTemplate}
        RETURN domain
    )

    LET testDomains = (
      for domain in domains
        return domain
    )
    
    LET hasNextPage = (LENGTH(
      FOR domain IN domains
        FILTER domain._key IN domainIds
        FILTER TO_NUMBER(domain._key) > TO_NUMBER(LAST(retrievedDomains)._key)
        SORT domain._key ${sortString} LIMIT 1
        RETURN domain
    ) > 0 ? true : false)
    
    LET hasPreviousPage = (LENGTH(
      FOR domain IN domains
        FILTER domain._key IN domainIds
        FILTER TO_NUMBER(domain._key) < TO_NUMBER(FIRST(retrievedDomains)._key)
        SORT domain._key ${sortString} LIMIT 1
        RETURN domain
    ) > 0 ? true : false)
    
    RETURN { 
      "domains": retrievedDomains,
      "hasNextPage": hasNextPage, 
      "hasPreviousPage": hasPreviousPage, 
      "startKey": FIRST(retrievedDomains)._key, 
      "endKey": LAST(retrievedDomains)._key 
    }
    `
  } catch (err) {
    console.error(
      `Database error occurred while user: ${userId} was trying to gather domains in loadDomainConnectionsByOrgId: ${err}`,
    )
    throw new Error(i18n._(t`Unable to load domains. Please try again.`))
  }

  let domainsInfo
  try {
    domainsInfo = await requestedDomainInfo.next()
  } catch (err) {
    console.error(
      `Cursor error occurred while user: ${userId} was trying to gather domains in loadDomainConnectionsByOrgId: ${err}`,
    )
    throw new Error(i18n._(t`Unable to load domains. Please try again.`))
  }

  if (domainsInfo.domains.length === 0) {
    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
    }
  }

  const edges = domainsInfo.domains.map((domain) => {
    domain.id = domain._key
    return {
      cursor: toGlobalId('domains', domain._key),
      node: domain,
    }
  })

  return {
    edges,
    pageInfo: {
      hasNextPage: domainsInfo.hasNextPage,
      hasPreviousPage: domainsInfo.hasPreviousPage,
      startCursor: toGlobalId('domains', domainsInfo.startKey),
      endCursor: toGlobalId('domains', domainsInfo.endKey),
    },
  }
}

module.exports = {
  domainLoaderConnectionsByOrgId,
}
