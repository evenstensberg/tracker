import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
} from 'graphql'
import { GraphQLJSON } from 'graphql-scalars'

import { domainType } from '../../domain/objects'
import { guidanceTagType } from '../../guidance-tag/objects'
import { StatusEnum } from '../../enums'

export const sslSubType = new GraphQLObjectType({
  name: 'SslSub',
  description:
    'SSL gql object containing the fields for the `dkimScanData` subscription.',
  fields: () => ({
    sharedId: {
      type: GraphQLID,
      description: `The shared id to match scans together.`,
      resolve: ({ sharedId }) => sharedId,
    },
    domain: {
      type: domainType,
      description: `The domain the scan was ran on.`,
      resolve: async ({ domainKey }, _, { loaders: { loadDomainByKey } }) => {
        const domain = await loadDomainByKey.load(domainKey)
        return domain
      },
    },
    status: {
      type: StatusEnum,
      description: 'The success status of the scan.',
      resolve: ({ status }) => status,
    },
    acceptableCiphers: {
      type: GraphQLList(GraphQLString),
      description:
        'List of ciphers in use by the server deemed to be "acceptable".',
      resolve: ({ acceptable_ciphers: acceptableCiphers }) => acceptableCiphers,
    },
    acceptableCurves: {
      type: GraphQLList(GraphQLString),
      description:
        'List of curves in use by the server deemed to be "acceptable".',
      resolve: ({ acceptable_curves: acceptableCurves }) => acceptableCurves,
    },
    ccsInjectionVulnerable: {
      type: GraphQLBoolean,
      description: 'Denotes vulnerability to OpenSSL CCS Injection.',
      resolve: ({ ccs_injection_vulnerable: ccsInjectionVulnerable }) =>
        ccsInjectionVulnerable,
    },
    heartbleedVulnerable: {
      type: GraphQLBoolean,
      description: 'Denotes vulnerability to "Heartbleed" exploit.',
      resolve: ({ heartbleed_vulnerable: heartbleedVulnerable }) =>
        heartbleedVulnerable,
    },
    strongCiphers: {
      type: GraphQLList(GraphQLString),
      description:
        'List of ciphers in use by the server deemed to be "strong".',
      resolve: ({ strong_ciphers: strongCiphers }) => strongCiphers,
    },
    strongCurves: {
      type: GraphQLList(GraphQLString),
      description: 'List of curves in use by the server deemed to be "strong".',
      resolve: ({ strong_curves: strongCurves }) => strongCurves,
    },
    supportsEcdhKeyExchange: {
      type: GraphQLBoolean,
      description: 'Denotes support for elliptic curve key pairs.',
      resolve: ({ supports_ecdh_key_exchange: supportsEcdhKeyExchange }) =>
        supportsEcdhKeyExchange,
    },
    weakCiphers: {
      type: GraphQLList(GraphQLString),
      description:
        'List of ciphers in use by the server deemed to be "weak" or in other words, are not compliant with security standards.',
      resolve: ({ weak_ciphers: weakCiphers }) => weakCiphers,
    },
    weakCurves: {
      type: GraphQLList(GraphQLString),
      description:
        'List of curves in use by the server deemed to be "weak" or in other words, are not compliant with security standards.',
      resolve: ({ weak_curves: weakCurves }) => weakCurves,
    },
    rawJson: {
      type: GraphQLJSON,
      description: 'Raw scan result.',
      resolve: ({ rawJson }) => JSON.stringify(rawJson),
    },
    negativeGuidanceTags: {
      type: GraphQLList(guidanceTagType),
      description: `Negative guidance tags found during scan.`,
      resolve: async (
        { negativeTags },
        _args,
        { loaders: { loadSslGuidanceTagByTagId } },
      ) => {
        const sslTags = await loadSslGuidanceTagByTagId.loadMany(negativeTags)
        return sslTags
      },
    },
    neutralGuidanceTags: {
      type: GraphQLList(guidanceTagType),
      description: `Neutral guidance tags found during scan.`,
      resolve: async (
        { neutralTags },
        _args,
        { loaders: { loadSslGuidanceTagByTagId } },
      ) => {
        const sslTags = await loadSslGuidanceTagByTagId.loadMany(neutralTags)
        return sslTags
      },
    },
    positiveGuidanceTags: {
      type: GraphQLList(guidanceTagType),
      description: `Positive guidance tags found during scan.`,
      resolve: async (
        { positiveTags },
        _args,
        { loaders: { loadSslGuidanceTagByTagId } },
      ) => {
        const sslTags = await loadSslGuidanceTagByTagId.loadMany(positiveTags)
        return sslTags
      },
    },
  }),
})
