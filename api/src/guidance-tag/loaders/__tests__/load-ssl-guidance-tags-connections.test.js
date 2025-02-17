import { stringify } from 'jest-matcher-utils'
import { ensure, dbNameFromFile } from 'arango-tools'
import { toGlobalId } from 'graphql-relay'
import { setupI18n } from '@lingui/core'

import englishMessages from '../../../locale/en/messages'
import frenchMessages from '../../../locale/fr/messages'
import { cleanseInput } from '../../../validators'
import {
  loadSslGuidanceTagConnectionsByTagId,
  loadSslGuidanceTagByTagId,
} from '../index'
import dbschema from '../../../../database.json'

const { DB_PASS: rootPass, DB_URL: url } = process.env

describe('when given the load ssl guidance tag connection function', () => {
  let query, drop, truncate, collections, user, i18n

  const consoleWarnOutput = []
  const mockedWarn = (output) => consoleWarnOutput.push(output)

  const consoleErrorOutput = []
  const mockedError = (output) => consoleErrorOutput.push(output)

  beforeAll(() => {
    console.warn = mockedWarn
    console.error = mockedError
    i18n = setupI18n({
      locale: 'en',
      localeData: {
        en: { plurals: {} },
        fr: { plurals: {} },
      },
      locales: ['en', 'fr'],
      messages: {
        en: englishMessages.messages,
        fr: frenchMessages.messages,
      },
    })
  })
  afterEach(() => {
    consoleWarnOutput.length = 0
    consoleErrorOutput.length = 0
  })

  describe('given a successful load', () => {
    beforeAll(async () => {
      ;({ query, drop, truncate, collections } = await ensure({
      variables: {
        dbname: dbNameFromFile(__filename),
        username: 'root',
        rootPassword: rootPass,
        password: rootPass,
        url,
      },

      schema: dbschema,
    }))
    })
    beforeEach(async () => {
      user = await collections.users.save({
        userName: 'test.account@istio.actually.exists',
        displayName: 'Test Account',
        preferredLang: 'french',
        tfaValidated: false,
        emailValidated: false,
      })

      await collections.sslGuidanceTags.save({
        _key: 'ssl1',
        en: {
          tagName: 'Some Cool Tag Name A',
          guidance: 'Some Cool Guidance A',
          refLinksGuide: [
            {
              description: 'IT PIN A',
            },
          ],
          refLinksTechnical: [''],
        },
        fr: {
          tagName: 'todo a',
          guidance: 'todo a',
          refLinksGuide: [
            {
              description: 'todo a',
            },
          ],
          refLinksTechnical: [''],
        },
      })
      await collections.sslGuidanceTags.save({
        _key: 'ssl2',
        en: {
          tagName: 'Some Cool Tag Name B',
          guidance: 'Some Cool Guidance B',
          refLinksGuide: [
            {
              description: 'IT PIN B',
            },
          ],
          refLinksTechnical: [''],
        },
        fr: {
          tagName: 'todo b',
          guidance: 'todo b',
          refLinksGuide: [
            {
              description: 'todo b',
            },
          ],
          refLinksTechnical: [''],
        },
      })
      await collections.sslGuidanceTags.save({
        _key: 'ssl3',
        en: {
          tagName: 'Some Cool Tag Name C',
          guidance: 'Some Cool Guidance C',
          refLinksGuide: [
            {
              description: 'IT PIN C',
            },
          ],
          refLinksTechnical: [''],
        },
        fr: {
          tagName: 'todo c',
          guidance: 'todo c',
          refLinksGuide: [
            {
              description: 'todo c',
            },
          ],
          refLinksTechnical: [''],
        },
      })
    })
    afterEach(async () => {
      await truncate()
    })
    afterAll(async () => {
      await drop()
    })
    describe('users language is set to english', () => {
      beforeAll(() => {
        i18n = setupI18n({
          locale: 'en',
          localeData: {
            en: { plurals: {} },
            fr: { plurals: {} },
          },
          locales: ['en', 'fr'],
          messages: {
            en: englishMessages.messages,
            fr: frenchMessages.messages,
          },
        })
      })
      describe('using after cursor', () => {
        it('returns ssl result(s) after a given node id', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'en',
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']

          const sslTagLoader = loadSslGuidanceTagByTagId({
            query,
            language: 'en',
          })
          const expectedSslTags = await sslTagLoader.loadMany(sslGuidanceTags)

          const connectionArgs = {
            first: 5,
            after: toGlobalId('guidanceTag', expectedSslTags[0]._key),
          }

          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [
              {
                cursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
                node: {
                  ...expectedSslTags[1],
                },
              },
            ],
            totalCount: 2,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              startCursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
              endCursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
      describe('using before cursor', () => {
        it('returns ssl result(s) before a given node id', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'en',
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']

          const sslTagLoader = loadSslGuidanceTagByTagId({
            query,
            language: 'en',
          })
          const expectedSslTags = await sslTagLoader.loadMany(sslGuidanceTags)

          const connectionArgs = {
            first: 5,
            before: toGlobalId('guidanceTag', expectedSslTags[1]._key),
          }

          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [
              {
                cursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
                node: {
                  ...expectedSslTags[0],
                },
              },
            ],
            totalCount: 2,
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
              endCursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
      describe('using first limit', () => {
        it('returns the first n amount of item(s)', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'en',
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']

          const sslTagLoader = loadSslGuidanceTagByTagId({
            query,
            language: 'en',
          })
          const expectedSslTags = await sslTagLoader.loadMany(sslGuidanceTags)

          const connectionArgs = {
            first: 1,
          }

          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [
              {
                cursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
                node: {
                  ...expectedSslTags[0],
                },
              },
            ],
            totalCount: 2,
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
              endCursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
      describe('using last limit', () => {
        it('returns the last n amount of item(s)', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'en',
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']

          const sslTagLoader = loadSslGuidanceTagByTagId({
            query,
            language: 'en',
          })
          const expectedSslTags = await sslTagLoader.loadMany(sslGuidanceTags)

          const connectionArgs = {
            last: 1,
          }

          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [
              {
                cursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
                node: {
                  ...expectedSslTags[1],
                },
              },
            ],
            totalCount: 2,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              startCursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
              endCursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
      describe('using orderBy field', () => {
        describe('ordering on TAG_ID', () => {
          describe('order is set to ASC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'en',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'en',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl1'),
                before: toGlobalId('guidanceTag', 'ssl3'),
                orderBy: {
                  field: 'tag-id',
                  direction: 'ASC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
          describe('ordering is set to DESC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'en',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'en',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl3'),
                before: toGlobalId('guidanceTag', 'ssl1'),
                orderBy: {
                  field: 'tag-id',
                  direction: 'DESC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
        })
        describe('ordering on TAG_NAME', () => {
          describe('order is set to ASC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'en',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'en',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl1'),
                before: toGlobalId('guidanceTag', 'ssl3'),
                orderBy: {
                  field: 'tag-name',
                  direction: 'ASC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
          describe('ordering is set to DESC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'en',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'en',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl3'),
                before: toGlobalId('guidanceTag', 'ssl1'),
                orderBy: {
                  field: 'tag-name',
                  direction: 'DESC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
        })
        describe('ordering on GUIDANCE', () => {
          describe('order is set to ASC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'en',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'en',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl1'),
                before: toGlobalId('guidanceTag', 'ssl3'),
                orderBy: {
                  field: 'guidance',
                  direction: 'ASC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
          describe('ordering is set to DESC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'en',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'en',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl3'),
                before: toGlobalId('guidanceTag', 'ssl1'),
                orderBy: {
                  field: 'guidance',
                  direction: 'DESC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
        })
      })
      describe('no ssl results are found', () => {
        beforeEach(async () => {
          await truncate()
        })
        it('returns an empty structure', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'en',
          })

          const connectionArgs = {
            first: 5,
          }

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [],
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: '',
              endCursor: '',
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
    })
    describe('users language is set to french', () => {
      beforeAll(() => {
        i18n = setupI18n({
          locale: 'fr',
          localeData: {
            en: { plurals: {} },
            fr: { plurals: {} },
          },
          locales: ['en', 'fr'],
          messages: {
            en: englishMessages.messages,
            fr: frenchMessages.messages,
          },
        })
      })
      describe('using after cursor', () => {
        it('returns ssl result(s) after a given node id', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'fr',
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']

          const sslTagLoader = loadSslGuidanceTagByTagId({
            query,
            language: 'fr',
          })
          const expectedSslTags = await sslTagLoader.loadMany(sslGuidanceTags)

          const connectionArgs = {
            first: 5,
            after: toGlobalId('guidanceTag', expectedSslTags[0]._key),
          }

          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [
              {
                cursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
                node: {
                  ...expectedSslTags[1],
                },
              },
            ],
            totalCount: 2,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              startCursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
              endCursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
      describe('using before cursor', () => {
        it('returns ssl result(s) before a given node id', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'fr',
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']

          const sslTagLoader = loadSslGuidanceTagByTagId({
            query,
            language: 'fr',
          })
          const expectedSslTags = await sslTagLoader.loadMany(sslGuidanceTags)

          const connectionArgs = {
            first: 5,
            before: toGlobalId('guidanceTag', expectedSslTags[1]._key),
          }

          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [
              {
                cursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
                node: {
                  ...expectedSslTags[0],
                },
              },
            ],
            totalCount: 2,
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
              endCursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
      describe('using first limit', () => {
        it('returns the first n amount of item(s)', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'fr',
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']

          const sslTagLoader = loadSslGuidanceTagByTagId({
            query,
            language: 'fr',
          })
          const expectedSslTags = await sslTagLoader.loadMany(sslGuidanceTags)

          const connectionArgs = {
            first: 1,
          }

          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [
              {
                cursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
                node: {
                  ...expectedSslTags[0],
                },
              },
            ],
            totalCount: 2,
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
              endCursor: toGlobalId('guidanceTag', expectedSslTags[0]._key),
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
      describe('using last limit', () => {
        it('returns the last n amount of item(s)', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'fr',
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']

          const sslTagLoader = loadSslGuidanceTagByTagId({
            query,
            language: 'fr',
          })
          const expectedSslTags = await sslTagLoader.loadMany(sslGuidanceTags)

          const connectionArgs = {
            last: 1,
          }

          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [
              {
                cursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
                node: {
                  ...expectedSslTags[1],
                },
              },
            ],
            totalCount: 2,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              startCursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
              endCursor: toGlobalId('guidanceTag', expectedSslTags[1]._key),
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
      describe('using orderBy field', () => {
        describe('ordering on TAG_ID', () => {
          describe('order is set to ASC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'fr',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'fr',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl1'),
                before: toGlobalId('guidanceTag', 'ssl3'),
                orderBy: {
                  field: 'tag-id',
                  direction: 'ASC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
          describe('ordering is set to DESC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'fr',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'fr',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl3'),
                before: toGlobalId('guidanceTag', 'ssl1'),
                orderBy: {
                  field: 'tag-id',
                  direction: 'DESC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
        })
        describe('ordering on TAG_NAME', () => {
          describe('order is set to ASC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'fr',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'fr',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl1'),
                before: toGlobalId('guidanceTag', 'ssl3'),
                orderBy: {
                  field: 'tag-name',
                  direction: 'ASC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
          describe('ordering is set to DESC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'fr',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'fr',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl3'),
                before: toGlobalId('guidanceTag', 'ssl1'),
                orderBy: {
                  field: 'tag-name',
                  direction: 'DESC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
        })
        describe('ordering on GUIDANCE', () => {
          describe('order is set to ASC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'fr',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'fr',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl1'),
                before: toGlobalId('guidanceTag', 'ssl3'),
                orderBy: {
                  field: 'guidance',
                  direction: 'ASC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
          describe('ordering is set to DESC', () => {
            it('returns guidance tag', async () => {
              const loader = loadSslGuidanceTagByTagId({
                query,
                language: 'fr',
              })
              const expectedSslTag = await loader.load('ssl2')

              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
                language: 'fr',
              })

              const connectionArgs = {
                sslGuidanceTags: ['ssl1', 'ssl2', 'ssl3'],
                first: 5,
                after: toGlobalId('guidanceTag', 'ssl3'),
                before: toGlobalId('guidanceTag', 'ssl1'),
                orderBy: {
                  field: 'guidance',
                  direction: 'DESC',
                },
              }
              const sslTags = await connectionLoader(connectionArgs)

              const expectedStructure = {
                edges: [
                  {
                    cursor: toGlobalId('guidanceTag', expectedSslTag._key),
                    node: {
                      ...expectedSslTag,
                    },
                  },
                ],
                totalCount: 3,
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  startCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                  endCursor: toGlobalId('guidanceTag', expectedSslTag._key),
                },
              }

              expect(sslTags).toEqual(expectedStructure)
            })
          })
        })
      })
      describe('no ssl results are found', () => {
        beforeEach(async () => {
          await truncate()
        })
        it('returns an empty structure', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
            language: 'fr',
          })

          const connectionArgs = {
            first: 5,
          }

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const sslTags = await connectionLoader({
            sslGuidanceTags,
            ...connectionArgs,
          })

          const expectedStructure = {
            edges: [],
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: '',
              endCursor: '',
            },
          }

          expect(sslTags).toEqual(expectedStructure)
        })
      })
    })
  })

  describe('given an unsuccessful load', () => {
    describe('language is set to english', () => {
      beforeAll(() => {
        i18n = setupI18n({
          locale: 'en',
          localeData: {
            en: { plurals: {} },
            fr: { plurals: {} },
          },
          locales: ['en', 'fr'],
          messages: {
            en: englishMessages.messages,
            fr: frenchMessages.messages,
          },
        })
      })
      describe('both limits are not set', () => {
        it('returns an error message', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const connectionArgs = {}

          try {
            await connectionLoader({
              sslGuidanceTags,
              ...connectionArgs,
            })
          } catch (err) {
            expect(err).toEqual(
              new Error(
                'You must provide a `first` or `last` value to properly paginate the `GuidanceTag` connection.',
              ),
            )
          }
          expect(consoleWarnOutput).toEqual([
            `User: ${user._key} did not have either \`first\` or \`last\` arguments set for: loadSslGuidanceTagConnectionsByTagId.`,
          ])
        })
      })
      describe('both limits are set', () => {
        it('returns an error message', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const connectionArgs = {
            first: 1,
            last: 5,
          }

          try {
            await connectionLoader({
              sslGuidanceTags,
              ...connectionArgs,
            })
          } catch (err) {
            expect(err).toEqual(
              new Error(
                'Passing both `first` and `last` to paginate the `GuidanceTag` connection is not supported.',
              ),
            )
          }
          expect(consoleWarnOutput).toEqual([
            `User: ${user._key} attempted to have \`first\` and \`last\` arguments set for: loadSslGuidanceTagConnectionsByTagId.`,
          ])
        })
      })
      describe('limits are below minimum', () => {
        describe('first is set', () => {
          it('returns an error message', async () => {
            const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
              query,
              userKey: user._key,
              cleanseInput,
              i18n,
            })

            const sslGuidanceTags = ['ssl1', 'ssl2']
            const connectionArgs = {
              first: -1,
            }

            try {
              await connectionLoader({
                sslGuidanceTags,
                ...connectionArgs,
              })
            } catch (err) {
              expect(err).toEqual(
                new Error(
                  '`first` on the `GuidanceTag` connection cannot be less than zero.',
                ),
              )
            }
            expect(consoleWarnOutput).toEqual([
              `User: ${user._key} attempted to have \`first\` set below zero for: loadSslGuidanceTagConnectionsByTagId.`,
            ])
          })
        })
        describe('last is set', () => {
          it('returns an error message', async () => {
            const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
              query,
              userKey: user._key,
              cleanseInput,
              i18n,
            })

            const sslGuidanceTags = ['ssl1', 'ssl2']
            const connectionArgs = {
              last: -5,
            }

            try {
              await connectionLoader({
                sslGuidanceTags,
                ...connectionArgs,
              })
            } catch (err) {
              expect(err).toEqual(
                new Error(
                  '`last` on the `GuidanceTag` connection cannot be less than zero.',
                ),
              )
            }
            expect(consoleWarnOutput).toEqual([
              `User: ${user._key} attempted to have \`last\` set below zero for: loadSslGuidanceTagConnectionsByTagId.`,
            ])
          })
        })
      })
      describe('limits are above maximum', () => {
        describe('first is set', () => {
          it('returns an error message', async () => {
            const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
              query,
              userKey: user._key,
              cleanseInput,
              i18n,
            })

            const sslGuidanceTags = ['ssl1', 'ssl2']
            const connectionArgs = {
              first: 1000,
            }

            try {
              await connectionLoader({
                sslGuidanceTags,
                ...connectionArgs,
              })
            } catch (err) {
              expect(err).toEqual(
                new Error(
                  'Requesting `1000` records on the `GuidanceTag` connection exceeds the `first` limit of 100 records.',
                ),
              )
            }
            expect(consoleWarnOutput).toEqual([
              `User: ${user._key} attempted to have \`first\` set to 1000 for: loadSslGuidanceTagConnectionsByTagId.`,
            ])
          })
        })
        describe('last is set', () => {
          it('returns an error message', async () => {
            const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
              query,
              userKey: user._key,
              cleanseInput,
              i18n,
            })

            const sslGuidanceTags = ['ssl1', 'ssl2']
            const connectionArgs = {
              last: 500,
            }

            try {
              await connectionLoader({
                sslGuidanceTags,
                ...connectionArgs,
              })
            } catch (err) {
              expect(err).toEqual(
                new Error(
                  'Requesting `500` records on the `GuidanceTag` connection exceeds the `last` limit of 100 records.',
                ),
              )
            }
            expect(consoleWarnOutput).toEqual([
              `User: ${user._key} attempted to have \`last\` set to 500 for: loadSslGuidanceTagConnectionsByTagId.`,
            ])
          })
        })
      })
      describe('limits are not set to numbers', () => {
        describe('first limit is set', () => {
          ;['123', {}, [], null, true].forEach((invalidInput) => {
            it(`returns an error when first set to ${stringify(
              invalidInput,
            )}`, async () => {
              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
              })

              const sslGuidanceTags = ['ssl1', 'ssl2']
              const connectionArgs = {
                first: invalidInput,
              }

              try {
                await connectionLoader({
                  sslGuidanceTags,
                  ...connectionArgs,
                })
              } catch (err) {
                expect(err).toEqual(
                  new Error(
                    `\`first\` must be of type \`number\` not \`${typeof invalidInput}\`.`,
                  ),
                )
              }
              expect(consoleWarnOutput).toEqual([
                `User: ${
                  user._key
                } attempted to have \`first\` set as a ${typeof invalidInput} for: loadSslGuidanceTagConnectionsByTagId.`,
              ])
            })
          })
        })
        describe('last limit is set', () => {
          ;['123', {}, [], null, true].forEach((invalidInput) => {
            it(`returns an error when last set to ${stringify(
              invalidInput,
            )}`, async () => {
              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
              })

              const sslGuidanceTags = ['ssl1', 'ssl2']
              const connectionArgs = {
                last: invalidInput,
              }

              try {
                await connectionLoader({
                  sslGuidanceTags,
                  ...connectionArgs,
                })
              } catch (err) {
                expect(err).toEqual(
                  new Error(
                    `\`last\` must be of type \`number\` not \`${typeof invalidInput}\`.`,
                  ),
                )
              }
              expect(consoleWarnOutput).toEqual([
                `User: ${
                  user._key
                } attempted to have \`last\` set as a ${typeof invalidInput} for: loadSslGuidanceTagConnectionsByTagId.`,
              ])
            })
          })
        })
      })
      describe('database error occurs', () => {
        it('throws an error', async () => {
          const query = jest
            .fn()
            .mockRejectedValue(new Error('Database Error Occurred.'))

          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const connectionArgs = {
            first: 5,
          }
          try {
            await connectionLoader({
              sslGuidanceTags,
              ...connectionArgs,
            })
          } catch (err) {
            expect(err).toEqual(
              new Error(
                'Unable to load SSL guidance tag(s). Please try again.',
              ),
            )
          }

          expect(consoleErrorOutput).toEqual([
            `Database error occurred while user: ${user._key} was trying to gather orgs in loadSslGuidanceTagConnectionsByTagId, error: Error: Database Error Occurred.`,
          ])
        })
      })
      describe('cursor error occurs', () => {
        it('throws an error', async () => {
          const cursor = {
            next() {
              throw new Error('Cursor Error Occurred.')
            },
          }
          const query = jest.fn().mockReturnValueOnce(cursor)

          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const connectionArgs = {
            first: 5,
          }
          try {
            await connectionLoader({
              sslGuidanceTags,
              ...connectionArgs,
            })
          } catch (err) {
            expect(err).toEqual(
              new Error(
                'Unable to load SSL guidance tag(s). Please try again.',
              ),
            )
          }

          expect(consoleErrorOutput).toEqual([
            `Cursor error occurred while user: ${user._key} was trying to gather orgs in loadSslGuidanceTagConnectionsByTagId, error: Error: Cursor Error Occurred.`,
          ])
        })
      })
    })
    describe('language is set to french', () => {
      beforeAll(() => {
        i18n = setupI18n({
          locale: 'fr',
          localeData: {
            en: { plurals: {} },
            fr: { plurals: {} },
          },
          locales: ['en', 'fr'],
          messages: {
            en: englishMessages.messages,
            fr: frenchMessages.messages,
          },
        })
      })
      describe('both limits are not set', () => {
        it('returns an error message', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const connectionArgs = {}

          try {
            await connectionLoader({
              sslGuidanceTags,
              ...connectionArgs,
            })
          } catch (err) {
            expect(err).toEqual(
              new Error(
                'Vous devez fournir une valeur `first` ou `last` pour paginer correctement la connexion `GuidanceTag`.',
              ),
            )
          }
          expect(consoleWarnOutput).toEqual([
            `User: ${user._key} did not have either \`first\` or \`last\` arguments set for: loadSslGuidanceTagConnectionsByTagId.`,
          ])
        })
      })
      describe('both limits are set', () => {
        it('returns an error message', async () => {
          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const connectionArgs = {
            first: 1,
            last: 5,
          }

          try {
            await connectionLoader({
              sslGuidanceTags,
              ...connectionArgs,
            })
          } catch (err) {
            expect(err).toEqual(
              new Error(
                "Passer à la fois `first` et `last` pour paginer la connexion `GuidanceTag` n'est pas supporté.",
              ),
            )
          }
          expect(consoleWarnOutput).toEqual([
            `User: ${user._key} attempted to have \`first\` and \`last\` arguments set for: loadSslGuidanceTagConnectionsByTagId.`,
          ])
        })
      })
      describe('limits are below minimum', () => {
        describe('first is set', () => {
          it('returns an error message', async () => {
            const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
              query,
              userKey: user._key,
              cleanseInput,
              i18n,
            })

            const sslGuidanceTags = ['ssl1', 'ssl2']
            const connectionArgs = {
              first: -1,
            }

            try {
              await connectionLoader({
                sslGuidanceTags,
                ...connectionArgs,
              })
            } catch (err) {
              expect(err).toEqual(
                new Error(
                  '`first` sur la connexion `GuidanceTag` ne peut être inférieure à zéro.',
                ),
              )
            }
            expect(consoleWarnOutput).toEqual([
              `User: ${user._key} attempted to have \`first\` set below zero for: loadSslGuidanceTagConnectionsByTagId.`,
            ])
          })
        })
        describe('last is set', () => {
          it('returns an error message', async () => {
            const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
              query,
              userKey: user._key,
              cleanseInput,
              i18n,
            })

            const sslGuidanceTags = ['ssl1', 'ssl2']
            const connectionArgs = {
              last: -5,
            }

            try {
              await connectionLoader({
                sslGuidanceTags,
                ...connectionArgs,
              })
            } catch (err) {
              expect(err).toEqual(
                new Error(
                  '`last` sur la connexion `GuidanceTag` ne peut être inférieure à zéro.',
                ),
              )
            }
            expect(consoleWarnOutput).toEqual([
              `User: ${user._key} attempted to have \`last\` set below zero for: loadSslGuidanceTagConnectionsByTagId.`,
            ])
          })
        })
      })
      describe('limits are above maximum', () => {
        describe('first is set', () => {
          it('returns an error message', async () => {
            const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
              query,
              userKey: user._key,
              cleanseInput,
              i18n,
            })

            const sslGuidanceTags = ['ssl1', 'ssl2']
            const connectionArgs = {
              first: 1000,
            }

            try {
              await connectionLoader({
                sslGuidanceTags,
                ...connectionArgs,
              })
            } catch (err) {
              expect(err).toEqual(
                new Error(
                  "La demande d'enregistrements `1000` sur la connexion `GuidanceTag` dépasse la limite `first` de 100 enregistrements.",
                ),
              )
            }
            expect(consoleWarnOutput).toEqual([
              `User: ${user._key} attempted to have \`first\` set to 1000 for: loadSslGuidanceTagConnectionsByTagId.`,
            ])
          })
        })
        describe('last is set', () => {
          it('returns an error message', async () => {
            const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
              query,
              userKey: user._key,
              cleanseInput,
              i18n,
            })

            const sslGuidanceTags = ['ssl1', 'ssl2']
            const connectionArgs = {
              last: 500,
            }

            try {
              await connectionLoader({
                sslGuidanceTags,
                ...connectionArgs,
              })
            } catch (err) {
              expect(err).toEqual(
                new Error(
                  "La demande d'enregistrements `500` sur la connexion `GuidanceTag` dépasse la limite `last` de 100 enregistrements.",
                ),
              )
            }
            expect(consoleWarnOutput).toEqual([
              `User: ${user._key} attempted to have \`last\` set to 500 for: loadSslGuidanceTagConnectionsByTagId.`,
            ])
          })
        })
      })
      describe('limits are not set to numbers', () => {
        describe('first limit is set', () => {
          ;['123', {}, [], null, true].forEach((invalidInput) => {
            it(`returns an error when first set to ${stringify(
              invalidInput,
            )}`, async () => {
              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
              })

              const sslGuidanceTags = ['ssl1', 'ssl2']
              const connectionArgs = {
                first: invalidInput,
              }

              try {
                await connectionLoader({
                  sslGuidanceTags,
                  ...connectionArgs,
                })
              } catch (err) {
                expect(err).toEqual(
                  new Error(
                    `\`first\` doit être de type \`number\` et non \`${typeof invalidInput}\`.`,
                  ),
                )
              }
              expect(consoleWarnOutput).toEqual([
                `User: ${
                  user._key
                } attempted to have \`first\` set as a ${typeof invalidInput} for: loadSslGuidanceTagConnectionsByTagId.`,
              ])
            })
          })
        })
        describe('last limit is set', () => {
          ;['123', {}, [], null, true].forEach((invalidInput) => {
            it(`returns an error when last set to ${stringify(
              invalidInput,
            )}`, async () => {
              const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
                query,
                userKey: user._key,
                cleanseInput,
                i18n,
              })

              const sslGuidanceTags = ['ssl1', 'ssl2']
              const connectionArgs = {
                last: invalidInput,
              }

              try {
                await connectionLoader({
                  sslGuidanceTags,
                  ...connectionArgs,
                })
              } catch (err) {
                expect(err).toEqual(
                  new Error(
                    `\`last\` doit être de type \`number\` et non \`${typeof invalidInput}\`.`,
                  ),
                )
              }
              expect(consoleWarnOutput).toEqual([
                `User: ${
                  user._key
                } attempted to have \`last\` set as a ${typeof invalidInput} for: loadSslGuidanceTagConnectionsByTagId.`,
              ])
            })
          })
        })
      })
      describe('database error occurs', () => {
        it('throws an error', async () => {
          const query = jest
            .fn()
            .mockRejectedValue(new Error('Database Error Occurred.'))

          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const connectionArgs = {
            first: 5,
          }
          try {
            await connectionLoader({
              sslGuidanceTags,
              ...connectionArgs,
            })
          } catch (err) {
            expect(err).toEqual(
              new Error(
                "Impossible de charger le(s) tag(s) d'orientation SSL. Veuillez réessayer.",
              ),
            )
          }

          expect(consoleErrorOutput).toEqual([
            `Database error occurred while user: ${user._key} was trying to gather orgs in loadSslGuidanceTagConnectionsByTagId, error: Error: Database Error Occurred.`,
          ])
        })
      })
      describe('cursor error occurs', () => {
        it('throws an error', async () => {
          const cursor = {
            next() {
              throw new Error('Cursor Error Occurred.')
            },
          }
          const query = jest.fn().mockReturnValueOnce(cursor)

          const connectionLoader = loadSslGuidanceTagConnectionsByTagId({
            query,
            userKey: user._key,
            cleanseInput,
            i18n,
          })

          const sslGuidanceTags = ['ssl1', 'ssl2']
          const connectionArgs = {
            first: 5,
          }
          try {
            await connectionLoader({
              sslGuidanceTags,
              ...connectionArgs,
            })
          } catch (err) {
            expect(err).toEqual(
              new Error(
                "Impossible de charger le(s) tag(s) d'orientation SSL. Veuillez réessayer.",
              ),
            )
          }

          expect(consoleErrorOutput).toEqual([
            `Cursor error occurred while user: ${user._key} was trying to gather orgs in loadSslGuidanceTagConnectionsByTagId, error: Error: Cursor Error Occurred.`,
          ])
        })
      })
    })
  })
})
