import { ensure, dbNameFromFile } from 'arango-tools'
import bcrypt from 'bcryptjs'
import { graphql, GraphQLSchema, GraphQLError } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import { setupI18n } from '@lingui/core'
import { v4 as uuidv4 } from 'uuid'

import englishMessages from '../../../locale/en/messages'
import frenchMessages from '../../../locale/fr/messages'
import { createQuerySchema } from '../../../query'
import { createMutationSchema } from '../../../mutation'
import { cleanseInput } from '../../../validators'
import { tokenize, verifyToken } from '../../../auth'
import { loadUserByKey } from '../../loaders'
import dbschema from '../../../../database.json'
import { collectionNames } from '../../../collection-names'

const {
  DB_PASS: rootPass,
  DB_URL: url,
  SIGN_IN_KEY,
  REFRESH_TOKEN_EXPIRY,
} = process.env

describe('authenticate user account', () => {
  let query, drop, truncate, schema, collections, transaction, mockTokenize

  const consoleOutput = []
  const mockedInfo = (output) => consoleOutput.push(output)
  const mockedWarn = (output) => consoleOutput.push(output)
  const mockedError = (output) => consoleOutput.push(output)
  beforeAll(() => {
    console.info = mockedInfo
    console.warn = mockedWarn
    console.error = mockedError
    // Create GQL Schema
    schema = new GraphQLSchema({
      query: createQuerySchema(),
      mutation: createMutationSchema(),
    })
    mockTokenize = jest.fn().mockReturnValue('token')
  })
  afterEach(() => {
    consoleOutput.length = 0
  })
  describe('given successful authentication', () => {
    beforeAll(async () => {
      // Generate DB Items
      ;({ query, drop, truncate, collections, transaction } = await ensure({
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
    afterEach(async () => {
      await truncate()
    })
    afterAll(async () => {
      await drop()
    })
    describe('user does not enable rememberMe', () => {
      beforeEach(async () => {
        await collections.users.save({
          userName: 'test.account@istio.actually.exists',
          displayName: 'Test Account',
          preferredLang: 'french',
          phoneValidated: false,
          emailValidated: false,
          tfaCode: 123456,
          refreshInfo: {
            refreshId: '123',
            rememberMe: false,
            expiresAt: '',
          },
        })
      })
      it('returns users information and JWT', async () => {
        let cursor = await query`
          FOR user IN users
            FILTER user.userName == "test.account@istio.actually.exists"
            RETURN user
        `
        let user = await cursor.next()

        const token = tokenize({
          parameters: { userKey: user._key },
          secret: String(SIGN_IN_KEY),
        })

        const mockedCookie = jest.fn()
        const mockedResponse = { cookie: mockedCookie }

        const response = await graphql(
          schema,
          `
            mutation {
              authenticate(
                input: {
                  authenticationCode: 123456
                  authenticateToken: "${token}"
                }
              ) {
                result {
                  ... on AuthResult {
                    authToken
                    user {
                      id
                      userName
                      displayName
                      preferredLang
                      phoneValidated
                      emailValidated
                    }
                  }
                  ... on AuthenticateError {
                    code
                    description
                  }
                }
              }
            }
          `,
          null,
          {
            query,
            collections: collectionNames,
            transaction,
            uuidv4,
            response: mockedResponse,
            auth: {
              bcrypt,
              tokenize: mockTokenize,
              verifyToken: verifyToken({}),
            },
            validators: {
              cleanseInput,
            },
            loaders: {
              loadUserByKey: loadUserByKey({ query }),
            },
          },
        )

        const expectedResult = {
          data: {
            authenticate: {
              result: {
                authToken: 'token',
                user: {
                  id: `${toGlobalId('user', user._key)}`,
                  userName: 'test.account@istio.actually.exists',
                  displayName: 'Test Account',
                  preferredLang: 'FRENCH',
                  phoneValidated: false,
                  emailValidated: false,
                },
              },
            },
          },
        }

        cursor = await query`
          FOR user IN users
            FILTER user.userName == "test.account@istio.actually.exists"
            RETURN user
        `
        user = await cursor.next()

        expect(response).toEqual(expectedResult)

        expect(user.tfaCode).toEqual(null)

        expect(mockedCookie).toHaveBeenCalledWith('refresh_token', 'token', {
          httpOnly: true,
          expires: 0,
          sameSite: true,
          secure: true,
        })

        expect(consoleOutput).toEqual([
          `User: ${user._key} successfully authenticated their account.`,
        ])
      })
    })
    describe('user has rememberMe enabled', () => {
      beforeEach(async () => {
        await collections.users.save({
          userName: 'test.account@istio.actually.exists',
          displayName: 'Test Account',
          preferredLang: 'french',
          phoneValidated: false,
          emailValidated: false,
          tfaCode: 123456,
          refreshInfo: {
            refreshId: '123',
            rememberMe: true,
            expiresAt: '',
          },
        })
      })
      it('returns users information and JWT', async () => {
        let cursor = await query`
          FOR user IN users
            FILTER user.userName == "test.account@istio.actually.exists"
            RETURN user
        `
        let user = await cursor.next()

        const token = tokenize({
          parameters: { userKey: user._key },
          secret: String(SIGN_IN_KEY),
        })

        const mockedCookie = jest.fn()
        const mockedResponse = { cookie: mockedCookie }

        const response = await graphql(
          schema,
          `
            mutation {
              authenticate(
                input: {
                  authenticationCode: 123456
                  authenticateToken: "${token}"
                }
              ) {
                result {
                  ... on AuthResult {
                    authToken
                    user {
                      id
                      userName
                      displayName
                      preferredLang
                      phoneValidated
                      emailValidated
                    }
                  }
                  ... on AuthenticateError {
                    code
                    description
                  }
                }
              }
            }
          `,
          null,
          {
            query,
            collections: collectionNames,
            transaction,
            uuidv4,
            response: mockedResponse,
            auth: {
              bcrypt,
              tokenize: mockTokenize,
              verifyToken: verifyToken({}),
            },
            validators: {
              cleanseInput,
            },
            loaders: {
              loadUserByKey: loadUserByKey({ query }),
            },
          },
        )

        const expectedResult = {
          data: {
            authenticate: {
              result: {
                authToken: 'token',
                user: {
                  id: `${toGlobalId('user', user._key)}`,
                  userName: 'test.account@istio.actually.exists',
                  displayName: 'Test Account',
                  preferredLang: 'FRENCH',
                  phoneValidated: false,
                  emailValidated: false,
                },
              },
            },
          },
        }

        cursor = await query`
          FOR user IN users
            FILTER user.userName == "test.account@istio.actually.exists"
            RETURN user
        `
        user = await cursor.next()

        expect(response).toEqual(expectedResult)

        expect(user.tfaCode).toEqual(null)

        expect(mockedCookie).toHaveBeenCalledWith('refresh_token', 'token', {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY * 60 * 24 * 60 * 1000,
          sameSite: true,
          secure: true,
        })

        expect(consoleOutput).toEqual([
          `User: ${user._key} successfully authenticated their account.`,
        ])
      })
    })
  })
  describe('given unsuccessful authentication', () => {
    let i18n
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
      describe('when userKey in token is undefined', () => {
        it('returns an error message', async () => {
          const token = tokenize({
            parameters: { userKey: undefined },
            secret: String(SIGN_IN_KEY),
          })
          const response = await graphql(
            schema,
            `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 654321
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
            null,
            {
              i18n,
              query,
              collections: collectionNames,
              transaction,
              uuidv4,
              auth: {
                bcrypt,
                tokenize,
                verifyToken: verifyToken({}),
              },
              validators: {
                cleanseInput,
              },
              loaders: {
                loadUserByKey: loadUserByKey({ query }),
              },
            },
          )

          const error = {
            data: {
              authenticate: {
                result: {
                  code: 400,
                  description: 'Token value incorrect, please sign in again.',
                },
              },
            },
          }

          expect(response).toEqual(error)
          expect(consoleOutput).toEqual([
            `Authentication token does not contain the userKey`,
          ])
        })
      })
      describe('when userKey is not a field in the token parameters', () => {
        it('returns an error message', async () => {
          const token = tokenize({
            parameters: {},
            secret: String(SIGN_IN_KEY),
          })
          const response = await graphql(
            schema,
            `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 654321
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
            null,
            {
              i18n,
              query,
              collections: collectionNames,
              transaction,
              uuidv4,
              auth: {
                bcrypt,
                tokenize,
                verifyToken: verifyToken({}),
              },
              validators: {
                cleanseInput,
              },
              loaders: {
                loadUserByKey: loadUserByKey({ query }),
              },
            },
          )

          const error = {
            data: {
              authenticate: {
                result: {
                  code: 400,
                  description: 'Token value incorrect, please sign in again.',
                },
              },
            },
          }

          expect(response).toEqual(error)
          expect(consoleOutput).toEqual([
            `Authentication token does not contain the userKey`,
          ])
        })
      })
      describe('when user cannot be found in database', () => {
        it('returns an error message', async () => {
          const token = tokenize({
            parameters: { userKey: 1 },
            secret: String(SIGN_IN_KEY),
          })
          const response = await graphql(
            schema,
            `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 654321
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
            null,
            {
              i18n,
              query,
              collections: collectionNames,
              transaction,
              uuidv4,
              auth: {
                bcrypt,
                tokenize,
                verifyToken: verifyToken({}),
              },
              validators: {
                cleanseInput,
              },
              loaders: {
                loadUserByKey: {
                  load: jest.fn().mockReturnValue(undefined),
                },
              },
            },
          )

          const error = {
            data: {
              authenticate: {
                result: {
                  code: 400,
                  description: 'Unable to authenticate. Please try again.',
                },
              },
            },
          }

          expect(response).toEqual(error)
          expect(consoleOutput).toEqual([
            `User: 1 attempted to authenticate, no account is associated with this id.`,
          ])
        })
      })
      describe('when tfa codes do not match', () => {
        it('returns an error message', async () => {
          const token = tokenize({
            parameters: { userKey: 123 },
            secret: String(SIGN_IN_KEY),
          })
          const response = await graphql(
            schema,
            `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 654321
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
            null,
            {
              i18n,
              query,
              collections: collectionNames,
              transaction,
              uuidv4,
              auth: {
                bcrypt,
                tokenize,
                verifyToken: verifyToken({}),
              },
              validators: {
                cleanseInput,
              },
              loaders: {
                loadUserByKey: {
                  load: jest.fn().mockReturnValue({
                    _key: 456,
                  }),
                },
              },
            },
          )

          const error = [
            new GraphQLError('Incorrect TFA code. Please sign in again.'),
          ]

          expect(response.errors).toEqual(error)
          expect(consoleOutput).toEqual([
            `User: 456 attempted to authenticate their account, however the tfaCodes did not match.`,
          ])
        })
      })
      describe('transaction step error occurs', () => {
        describe('when clearing tfa code and setting refresh id', () => {
          it('throws an error', async () => {
            const token = tokenize({
              parameters: { userKey: 123 },
              secret: String(SIGN_IN_KEY),
            })

            const response = await graphql(
              schema,
              `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 123456
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
              null,
              {
                i18n,
                query,
                collections: collectionNames,
                transaction: jest.fn().mockReturnValue({
                  step: jest
                    .fn()
                    .mockRejectedValue(new Error('Transaction step error')),
                }),
                uuidv4,
                auth: {
                  bcrypt,
                  tokenize,
                  verifyToken: verifyToken({}),
                },
                validators: {
                  cleanseInput,
                },
                loaders: {
                  loadUserByKey: {
                    load: jest.fn().mockReturnValue({
                      _key: 123,
                      tfaCode: 123456,
                      refreshInfo: {
                        remember: false,
                      },
                    }),
                  },
                },
              },
            )

            const error = [
              new GraphQLError('Unable to authenticate. Please try again.'),
            ]

            expect(response.errors).toEqual(error)
            expect(consoleOutput).toEqual([
              `Trx step error occurred when clearing tfa code and setting refresh id for user: 123 during authentication: Error: Transaction step error`,
            ])
          })
        })
      })
      describe('transaction commit error occurs', () => {
        describe('when user attempts to authenticate', () => {
          it('throws an error', async () => {
            const token = tokenize({
              parameters: { userKey: 123 },
              secret: String(SIGN_IN_KEY),
            })

            const response = await graphql(
              schema,
              `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 123456
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
              null,
              {
                i18n,
                query,
                collections: collectionNames,
                transaction: jest.fn().mockReturnValue({
                  step: jest.fn().mockReturnValue(),
                  commit: jest
                    .fn()
                    .mockRejectedValue(new Error('Transaction commit error')),
                }),
                uuidv4,
                auth: {
                  bcrypt,
                  tokenize,
                  verifyToken: verifyToken({}),
                },
                validators: {
                  cleanseInput,
                },
                loaders: {
                  loadUserByKey: {
                    load: jest.fn().mockReturnValue({
                      _key: 123,
                      tfaCode: 123456,
                      refreshInfo: {
                        remember: false,
                      },
                    }),
                  },
                },
              },
            )

            const error = [
              new GraphQLError('Unable to authenticate. Please try again.'),
            ]

            expect(response.errors).toEqual(error)
            expect(consoleOutput).toEqual([
              `Trx commit error occurred while user: 123 attempted to authenticate: Error: Transaction commit error`,
            ])
          })
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
      describe('when userKey in token is undefined', () => {
        it('returns an error message', async () => {
          const token = tokenize({
            parameters: { userKey: undefined },
            secret: String(SIGN_IN_KEY),
          })
          const response = await graphql(
            schema,
            `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 654321
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
            null,
            {
              i18n,
              query,
              collections: collectionNames,
              transaction,
              uuidv4,
              auth: {
                bcrypt,
                tokenize,
                verifyToken: verifyToken({}),
              },
              validators: {
                cleanseInput,
              },
              loaders: {
                loadUserByKey: loadUserByKey({ query }),
              },
            },
          )

          const error = {
            data: {
              authenticate: {
                result: {
                  code: 400,
                  description:
                    'La valeur du jeton est incorrecte, veuillez vous connecter à nouveau.',
                },
              },
            },
          }

          expect(response).toEqual(error)
          expect(consoleOutput).toEqual([
            `Authentication token does not contain the userKey`,
          ])
        })
      })
      describe('when userKey is not a field in the token parameters', () => {
        it('returns an error message', async () => {
          const token = tokenize({
            parameters: {},
            secret: String(SIGN_IN_KEY),
          })
          const response = await graphql(
            schema,
            `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 654321
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
            null,
            {
              i18n,
              query,
              collections: collectionNames,
              transaction,
              uuidv4,
              auth: {
                bcrypt,
                tokenize,
                verifyToken: verifyToken({}),
              },
              validators: {
                cleanseInput,
              },
              loaders: {
                loadUserByKey: loadUserByKey({ query }),
              },
            },
          )

          const error = {
            data: {
              authenticate: {
                result: {
                  code: 400,
                  description:
                    'La valeur du jeton est incorrecte, veuillez vous connecter à nouveau.',
                },
              },
            },
          }

          expect(response).toEqual(error)
          expect(consoleOutput).toEqual([
            `Authentication token does not contain the userKey`,
          ])
        })
      })
      describe('when user cannot be found in database', () => {
        it('returns an error message', async () => {
          const token = tokenize({
            parameters: { userKey: 1 },
            secret: String(SIGN_IN_KEY),
          })
          const response = await graphql(
            schema,
            `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 654321
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
            null,
            {
              i18n,
              query,
              collections: collectionNames,
              transaction,
              uuidv4,
              auth: {
                bcrypt,
                tokenize,
                verifyToken: verifyToken({}),
              },
              validators: {
                cleanseInput,
              },
              loaders: {
                loadUserByKey: {
                  load: jest.fn().mockReturnValue(undefined),
                },
              },
            },
          )

          const error = {
            data: {
              authenticate: {
                result: {
                  code: 400,
                  description:
                    "Impossible de s'authentifier. Veuillez réessayer.",
                },
              },
            },
          }

          expect(response).toEqual(error)
          expect(consoleOutput).toEqual([
            `User: 1 attempted to authenticate, no account is associated with this id.`,
          ])
        })
      })
      describe('when tfa codes do not match', () => {
        it('returns an error message', async () => {
          const token = tokenize({
            parameters: { userKey: 123 },
            secret: String(SIGN_IN_KEY),
          })
          const response = await graphql(
            schema,
            `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 654321
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
            null,
            {
              i18n,
              query,
              collections: collectionNames,
              transaction,
              uuidv4,
              auth: {
                bcrypt,
                tokenize,
                verifyToken: verifyToken({}),
              },
              validators: {
                cleanseInput,
              },
              loaders: {
                loadUserByKey: {
                  load: jest.fn().mockReturnValue({
                    _key: 456,
                  }),
                },
              },
            },
          )

          const error = [
            new GraphQLError('Code TFA incorrect. Veuillez vous reconnecter.'),
          ]

          expect(response.errors).toEqual(error)
          expect(consoleOutput).toEqual([
            `User: 456 attempted to authenticate their account, however the tfaCodes did not match.`,
          ])
        })
      })
      describe('transaction step error occurs', () => {
        describe('when clearing tfa code and setting refresh id', () => {
          it('throws an error', async () => {
            const token = tokenize({
              parameters: { userKey: 123 },
              secret: String(SIGN_IN_KEY),
            })

            const response = await graphql(
              schema,
              `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 123456
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
              null,
              {
                i18n,
                query,
                collections: collectionNames,
                transaction: jest.fn().mockReturnValue({
                  step: jest
                    .fn()
                    .mockRejectedValue(new Error('Transaction step error')),
                }),
                uuidv4,
                auth: {
                  bcrypt,
                  tokenize,
                  verifyToken: verifyToken({}),
                },
                validators: {
                  cleanseInput,
                },
                loaders: {
                  loadUserByKey: {
                    load: jest.fn().mockReturnValue({
                      _key: 123,
                      tfaCode: 123456,
                      refreshInfo: {
                        remember: false,
                      },
                    }),
                  },
                },
              },
            )

            const error = [
              new GraphQLError(
                "Impossible de s'authentifier. Veuillez réessayer.",
              ),
            ]

            expect(response.errors).toEqual(error)
            expect(consoleOutput).toEqual([
              `Trx step error occurred when clearing tfa code and setting refresh id for user: 123 during authentication: Error: Transaction step error`,
            ])
          })
        })
      })
      describe('transaction commit error occurs', () => {
        describe('when user attempts to authenticate', () => {
          it('throws an error', async () => {
            const token = tokenize({
              parameters: { userKey: 123 },
              secret: String(SIGN_IN_KEY),
            })

            const response = await graphql(
              schema,
              `
              mutation {
                authenticate(
                  input: {
                    authenticationCode: 123456
                    authenticateToken: "${token}"
                  }
                ) {
                  result {
                    ... on AuthResult {
                      authToken
                      user {
                        id
                        userName
                        displayName
                        preferredLang
                        phoneValidated
                        emailValidated
                      }
                    }
                    ... on AuthenticateError {
                      code
                      description
                    }
                  }
                }
              }
            `,
              null,
              {
                i18n,
                query,
                collections: collectionNames,
                transaction: jest.fn().mockReturnValue({
                  step: jest.fn().mockReturnValue(),
                  commit: jest
                    .fn()
                    .mockRejectedValue(new Error('Transaction commit error')),
                }),
                uuidv4,
                auth: {
                  bcrypt,
                  tokenize,
                  verifyToken: verifyToken({}),
                },
                validators: {
                  cleanseInput,
                },
                loaders: {
                  loadUserByKey: {
                    load: jest.fn().mockReturnValue({
                      _key: 123,
                      tfaCode: 123456,
                      refreshInfo: {
                        remember: false,
                      },
                    }),
                  },
                },
              },
            )

            const error = [
              new GraphQLError(
                "Impossible de s'authentifier. Veuillez réessayer.",
              ),
            ]

            expect(response.errors).toEqual(error)
            expect(consoleOutput).toEqual([
              `Trx commit error occurred while user: 123 attempted to authenticate: Error: Transaction commit error`,
            ])
          })
        })
      })
    })
  })
})
