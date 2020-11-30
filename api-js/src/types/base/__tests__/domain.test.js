const { DB_PASS: rootPass, DB_URL: url } = process.env

const { ArangoTools, dbNameFromFile } = require('arango-tools')
const { GraphQLNonNull, GraphQLID, GraphQLList } = require('graphql')
const { toGlobalId } = require('graphql-relay')
const { GraphQLDateTime } = require('graphql-scalars')

const { makeMigrations } = require('../../../../migrations')
const { cleanseInput } = require('../../../validators')
const { userRequired, tokenize } = require('../../../auth')
const {
  orgLoaderConnectionArgsByDomainId,
  userLoaderByKey,
} = require('../../../loaders')
const { domainStatus } = require('../domain-status')
const { periodType } = require('../dmarc-report')
const {
  domainType,
  organizationConnection,
  emailScanType,
  webScanType,
} = require('../index')
const { Domain, Selectors } = require('../../../scalars')

describe('given the domain object', () => {
  describe('testing its field definitions', () => {
    it('has an id field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('id')
      expect(demoType.id.type).toMatchObject(GraphQLNonNull(GraphQLID))
    })
    it('has a domain field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('domain')
      expect(demoType.domain.type).toMatchObject(Domain)
    })
    it('has a lastRan field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('lastRan')
      expect(demoType.lastRan.type).toMatchObject(GraphQLDateTime)
    })
    it('has a selectors field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('selectors')
      expect(demoType.selectors.type).toMatchObject(GraphQLList(Selectors))
    })
    it('has a status field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('status')
      expect(demoType.status.type).toMatchObject(domainStatus)
    })
    it('has an organizations field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('organizations')
      expect(demoType.organizations.type).toMatchObject(
        organizationConnection.connectionType,
      )
    })
    it('has an email field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('email')
      expect(demoType.email.type).toMatchObject(emailScanType)
    })
    it('has a web field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('web')
      expect(demoType.web.type).toMatchObject(webScanType)
    })
    it('has a dmarcSummaryByPeriod field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('dmarcSummaryByPeriod')
      expect(demoType.dmarcSummaryByPeriod.type).toMatchObject(periodType)
    })
    it('has a yearlyDmarcSummaries field', () => {
      const demoType = domainType.getFields()

      expect(demoType).toHaveProperty('yearlyDmarcSummaries')
      expect(demoType.yearlyDmarcSummaries.type).toMatchObject(
        GraphQLList(periodType),
      )
    })
  })
  describe('testing the field resolvers', () => {
    let query,
      drop,
      truncate,
      migrate,
      collections,
      org,
      user,
      domainOne,
      domainTwo

    const consoleOutput = []
    const mockedWarn = (output) => consoleOutput.push(output)

    beforeAll(async () => {
      // Generate DB Items
      ;({ migrate } = await ArangoTools({ rootPass, url }))
      ;({ query, drop, truncate, collections } = await migrate(
        makeMigrations({ databaseName: dbNameFromFile(__filename), rootPass }),
      ))
    })

    beforeEach(async () => {
      console.warn = mockedWarn

      org = await collections.organizations.save({
        verified: true,
        summaries: {
          web: {
            pass: 50,
            fail: 1000,
            total: 1050,
          },
          mail: {
            pass: 50,
            fail: 1000,
            total: 1050,
          },
        },
        orgDetails: {
          en: {
            slug: 'treasury-board-secretariat',
            acronym: 'TBS',
            name: 'Treasury Board of Canada Secretariat',
            zone: 'FED',
            sector: 'TBS',
            country: 'Canada',
            province: 'Ontario',
            city: 'Ottawa',
          },
          fr: {
            slug: 'secretariat-conseil-tresor',
            acronym: 'SCT',
            name: 'Secrétariat du Conseil Trésor du Canada',
            zone: 'FED',
            sector: 'TBS',
            country: 'Canada',
            province: 'Ontario',
            city: 'Ottawa',
          },
        },
      })
      user = await collections.users.save({})
      await collections.affiliations.save({
        _from: org._id,
        _to: user._id,
        permission: 'user',
      })
      domainOne = await collections.domains.save({
        domain: 'test1.gc.ca',
        lastRan: null,
        selectors: ['selector1._domainkey', 'selector2._domainkey'],
        status: {
          dkim: 'pass',
          dmarc: 'pass',
          https: 'info',
          spf: 'fail',
          ssl: 'fail',
        },
      })
      domainTwo = await collections.domains.save({
        domain: 'test2.gc.ca',
        lastRan: null,
        selectors: ['selector1._domainkey', 'selector2._domainkey'],
        status: {
          dkim: 'pass',
          dmarc: 'pass',
          https: 'info',
          spf: 'fail',
          ssl: 'fail',
        },
      })
      await collections.claims.save({
        _to: domainOne._id,
        _from: org._id,
      })
      await collections.claims.save({
        _to: domainTwo._id,
        _from: org._id,
      })
    })

    afterEach(async () => {
      await truncate()
      consoleOutput.length = 0
    })

    afterAll(async () => {
      await drop()
    })

    describe('testing the id resolver', () => {
      it('returns the resolved value', () => {
        const demoType = domainType.getFields()

        expect(demoType.id.resolve({ id: '1' })).toEqual(
          toGlobalId('domains', 1),
        )
      })
    })
    describe('testing the domain resolver', () => {
      it('returns the resolved value', () => {
        const demoType = domainType.getFields()

        expect(demoType.domain.resolve({ domain: 'test.gc.ca' })).toEqual(
          'test.gc.ca',
        )
      })
    })
    describe('testing the lastRan resolver', () => {
      it('returns the resolved value', () => {
        const demoType = domainType.getFields()

        expect(
          demoType.lastRan.resolve({ lastRan: '2020-10-02T12:43:39Z' }),
        ).toEqual('2020-10-02T12:43:39Z')
      })
    })
    describe('testing the selectors resolver', () => {
      it('returns the resolved value', () => {
        const demoType = domainType.getFields()

        const selectors = ['selector1._domainkey', 'selector2._domainkey']

        expect(demoType.selectors.resolve({ selectors })).toEqual([
          'selector1._domainkey',
          'selector2._domainkey',
        ])
      })
    })
    describe('testing the status resolver', () => {
      it('returns the resolved value', () => {
        const demoType = domainType.getFields()

        const status = {
          dkim: 'pass',
          dmarc: 'pass',
          https: 'info',
          spf: 'fail',
          ssl: 'fail',
        }

        expect(demoType.status.resolve({ status })).toEqual({
          dkim: 'pass',
          dmarc: 'pass',
          https: 'info',
          spf: 'fail',
          ssl: 'fail',
        })
      })
    })
    describe('testing the organizations resolver', () => {
      it('returns the resolved value', async () => {
        const demoType = domainType.getFields()

        const loader = orgLoaderConnectionArgsByDomainId(
          query,
          'en',
          user._key,
          cleanseInput,
          {},
        )

        const expectedResult = {
          edges: [
            {
              cursor: toGlobalId('organizations', org._key),
              node: {
                _id: org._id,
                _key: org._key,
                _rev: org._rev,
                id: org._key,
                verified: true,
                summaries: {
                  web: {
                    pass: 50,
                    fail: 1000,
                    total: 1050,
                  },
                  mail: {
                    pass: 50,
                    fail: 1000,
                    total: 1050,
                  },
                },
                domainCount: 2,
                slug: 'treasury-board-secretariat',
                acronym: 'TBS',
                name: 'Treasury Board of Canada Secretariat',
                zone: 'FED',
                sector: 'TBS',
                country: 'Canada',
                province: 'Ontario',
                city: 'Ottawa',
              },
            },
          ],
          totalCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: toGlobalId('organizations', org._key),
            endCursor: toGlobalId('organizations', org._key),
          },
        }

        expect(
          demoType.organizations.resolve(
            { _id: domainOne._id },
            { first: 1 },
            { loaders: { orgLoaderConnectionArgsByDomainId: loader } },
          ),
        ).resolves.toEqual(expectedResult)
      })
    })
    describe('testing the email resolver', () => {
      it('returns the resolved value', () => {
        const demoType = domainType.getFields()

        expect(demoType.email.resolve({ _id: '1', _key: '1' })).toEqual({
          _id: '1',
          _key: '1',
        })
      })
    })
    describe('testing the web resolver', () => {
      it('returns the resolved value', () => {
        const demoType = domainType.getFields()

        expect(demoType.web.resolve({ _id: '1', _key: '1' })).toEqual({
          _id: '1',
          _key: '1',
        })
      })
    })
    describe('testing the dmarcSummaryByPeriod resolver', () => {
      describe('user has domain ownership permission', () => {
        let mockDmarcReportLoader, mockCheckDomainOwnership, mockUserRequired
        beforeEach(() => {
          mockDmarcReportLoader = jest.fn().mockReturnValue({
            data: {
              dmarcSummaryByPeriod: {
                startDate: '2020-01-01',
                endDate: '2020-01-01',
              },
            },
          })

          mockCheckDomainOwnership = jest.fn().mockReturnValue(true)

          mockUserRequired = userRequired({
            i18n: {},
            userKey: user._key,
            userLoaderByKey: userLoaderByKey(query),
          })
        })

        it('returns the resolved value', async () => {
          const demoType = domainType.getFields()

          const data = {
            _id: domainOne._id,
            _key: domainOne._key,
            domain: 'test1.gc.ca',
          }

          await expect(
            demoType.dmarcSummaryByPeriod.resolve(
              data,
              {},
              {
                userKey: user._key,
                loaders: { dmarcReportLoader: mockDmarcReportLoader },
                auth: {
                  checkDomainOwnership: mockCheckDomainOwnership,
                  userRequired: mockUserRequired,
                  tokenize,
                },
              },
            ),
          ).resolves.toEqual({
            endDate: '2020-01-01',
            startDate: '2020-01-01',
            domainKey: domainOne._key,
          })
        })
      })
      describe('user does not have domain ownership permission', () => {
        let mockDmarcReportLoader, mockCheckDomainOwnership, mockUserRequired
        beforeEach(() => {
          mockDmarcReportLoader = jest.fn().mockReturnValue({
            data: {
              dmarcSummaryByPeriod: {
                startDate: '2020-01-01',
                endDate: '2020-01-01',
              },
            },
          })

          mockCheckDomainOwnership = jest.fn().mockReturnValue(false)

          mockUserRequired = userRequired({
            i18n: {},
            userKey: user._key,
            userLoaderByKey: userLoaderByKey(query),
          })
        })

        it('returns the resolved value', async () => {
          const demoType = domainType.getFields()

          const data = {
            _id: domainOne._id,
            _key: domainOne._key,
            domain: 'test1.gc.ca',
          }

          await expect(
            demoType.dmarcSummaryByPeriod.resolve(
              data,
              {},
              {
                userKey: user._key,
                loaders: { dmarcReportLoader: mockDmarcReportLoader },
                auth: {
                  checkDomainOwnership: mockCheckDomainOwnership,
                  userRequired: mockUserRequired,
                  tokenize,
                },
              },
            ),
          ).rejects.toEqual(
            new Error(
              'Unable to retrieve dmarc report information for: test1.gc.ca',
            ),
          )

          expect(consoleOutput).toEqual([
            `User: ${user._key} attempted to access dmarc report period data for ${domainOne._key}, but does not belong to an org with ownership.`,
          ])
        })
      })
    })
    describe('testing the yearlyDmarcSummaries resolver', () => {
      describe('user has domain ownership permission', () => {
        let mockDmarcReportLoader, mockCheckDomainOwnership, mockUserRequired
        beforeEach(() => {
          mockDmarcReportLoader = jest.fn().mockReturnValue({
            data: {
              yearlyDmarcSummaries: [
                {
                  startDate: '2019-01-01',
                  endDate: '2019-01-31',
                },
                {
                  startDate: '2019-02-01',
                  endDate: '2019-02-28',
                },
                {
                  startDate: '2019-03-01',
                  endDate: '2019-03-31',
                },
                {
                  startDate: '2019-04-01',
                  endDate: '2019-04-30',
                },
                {
                  startDate: '2019-05-01',
                  endDate: '2019-01-31',
                },
                {
                  startDate: '2019-06-01',
                  endDate: '2019-06-30',
                },
                {
                  startDate: '2019-07-01',
                  endDate: '2019-07-31',
                },
                {
                  startDate: '2019-08-01',
                  endDate: '2019-08-31',
                },
                {
                  startDate: '2019-09-01',
                  endDate: '2019-09-30',
                },
                {
                  startDate: '2019-10-01',
                  endDate: '2019-10-31',
                },
                {
                  startDate: '2019-11-01',
                  endDate: '2019-11-30',
                },
                {
                  startDate: '2019-12-01',
                  endDate: '2019-12-31',
                },
                {
                  startDate: '2020-01-01',
                  endDate: '2020-01-31',
                },
              ],
            },
          })

          mockCheckDomainOwnership = jest.fn().mockReturnValue(true)

          mockUserRequired = userRequired({
            i18n: {},
            userKey: user._key,
            userLoaderByKey: userLoaderByKey(query),
          })
        })

        it('returns the resolved value', async () => {
          const demoType = domainType.getFields()

          const data = {
            _id: domainOne._id,
            _key: domainOne._key,
            domain: 'test1.gc.ca',
          }

          const expectedResult = [
            {
              endDate: '2019-01-31',
              startDate: '2019-01-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-02-28',
              startDate: '2019-02-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-03-31',
              startDate: '2019-03-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-04-30',
              startDate: '2019-04-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-01-31',
              startDate: '2019-05-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-06-30',
              startDate: '2019-06-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-07-31',
              startDate: '2019-07-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-08-31',
              startDate: '2019-08-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-09-30',
              startDate: '2019-09-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-10-31',
              startDate: '2019-10-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-11-30',
              startDate: '2019-11-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2019-12-31',
              startDate: '2019-12-01',
              domainKey: domainOne._key,
            },
            {
              endDate: '2020-01-31',
              startDate: '2020-01-01',
              domainKey: domainOne._key,
            },
          ]

          await expect(
            demoType.yearlyDmarcSummaries.resolve(
              data,
              {},
              {
                userKey: user._key,
                loaders: { dmarcReportLoader: mockDmarcReportLoader },
                auth: {
                  checkDomainOwnership: mockCheckDomainOwnership,
                  userRequired: mockUserRequired,
                  tokenize,
                },
              },
            ),
          ).resolves.toEqual(expectedResult)
        })
      })
      describe('user does not have domain ownership permission', () => {
        let mockDmarcReportLoader, mockCheckDomainOwnership, mockUserRequired
        beforeEach(() => {
          mockDmarcReportLoader = jest.fn().mockReturnValue({
            data: {
              yearlyDmarcSummaries: [],
            },
          })

          mockCheckDomainOwnership = jest.fn().mockReturnValue(false)

          mockUserRequired = userRequired({
            i18n: {},
            userKey: user._key,
            userLoaderByKey: userLoaderByKey(query),
          })
        })

        it('returns the resolved value', async () => {
          const demoType = domainType.getFields()

          const data = {
            _id: domainOne._id,
            _key: domainOne._key,
            domain: 'test1.gc.ca',
          }

          await expect(
            demoType.yearlyDmarcSummaries.resolve(
              data,
              {},
              {
                userKey: user._key,
                loaders: { dmarcReportLoader: mockDmarcReportLoader },
                auth: {
                  checkDomainOwnership: mockCheckDomainOwnership,
                  userRequired: mockUserRequired,
                  tokenize,
                },
              },
            ),
          ).rejects.toEqual(
            new Error(
              'Unable to retrieve dmarc report information for: test1.gc.ca',
            ),
          )
          expect(consoleOutput).toEqual([
            `User: ${user._key} attempted to access dmarc report period data for ${domainOne._key}, but does not belong to an org with ownership.`,
          ])
        })
      })
    })
  })
})
