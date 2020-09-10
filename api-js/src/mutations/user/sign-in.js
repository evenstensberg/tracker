const { GraphQLNonNull, GraphQLString } = require('graphql')
const { mutationWithClientMutationId } = require('graphql-relay')
const { GraphQLEmailAddress } = require('graphql-scalars')

const { SIGN_IN_KEY } = process.env

const signIn = new mutationWithClientMutationId({
  name: 'SignIn',
  description:
    'This mutation allows users to give their credentials and be taken to the authentication page to verify their account',
  inputFields: () => ({
    userName: {
      type: GraphQLNonNull(GraphQLEmailAddress),
      description: 'The email the user signed up with.',
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The password the user signed up with',
    },
  }),
  outputFields: () => ({
    authenticateToken: {
      type: GraphQLString,
      description: 'Token used to verify during authentication.',
      resolve: async (payload) => {
        return payload.authenticateToken
      },
    },
    status: {
      type: GraphQLString,
      description:
        'Wether the authentication code was sent through text, or email.',
      resolve: async (payload) => {
        return payload.status
      },
    },
  }),
  mutateAndGetPayload: async (
    args,
    {
      query,
      auth: { tokenize, bcrypt },
      loaders: { userLoaderByUserName },
      validators: { cleanseInput },
      notify: { sendAuthEmail, sendAuthTextMsg },
    },
  ) => {
    // Cleanse input
    const userName = cleanseInput(args.userName).toLowerCase()
    const password = cleanseInput(args.password)

    // Gather user who just signed in
    let user = await userLoaderByUserName.load(userName)

    if (typeof user === 'undefined') {
      console.warn(
        `User: ${userName} attempted to sign in, no account is associated with this email.`,
      )
      throw new Error('Unable to sign in, please try again.')
    }

    // Check against failed attempt info
    if (user.failedLoginAttempts >= 10) {
      console.warn(
        `User: ${user._key} tried to sign in, but has too many login attempts.`,
      )
      throw new Error(
        'Too many failed login attempts, please reset your password, and try again.',
      )
    } else {
      // Check to see if passwords match
      if (bcrypt.compareSync(password, user.password)) {
        const token = tokenize({
          parameters: { userId: user._key },
          secret: String(SIGN_IN_KEY),
        })

        // Reset Failed Login attempts
        try {
          await query`
                  FOR u IN users
                    UPDATE ${user._key} WITH { failedLoginAttempts: 0 } IN users
                `
        } catch (err) {
          console.error(
            `Database error ocurred when resetting failed attempts for user: ${user._key} during authentication: ${err}`,
          )
          throw new Error('Unable to sign in, please try again.')
        }

        // Generate TFA code
        const tfaCode = Math.floor(100000 + Math.random() * 900000)

        // Insert TFA code into DB
        try {
          await query`
                UPSERT { _key: ${user._key} }
                  INSERT { tfaCode: ${tfaCode} }
                  UPDATE { tfaCode: ${tfaCode} }
                  IN users
              `
        } catch (err) {
          console.error(
            `Database error occurred when inserting ${user._key} TFA code: ${err}`,
          )
          throw new Error('Unable to sign in, please try again.')
        }

        // Get newly updated user
        await userLoaderByUserName.clear(userName)
        user = await userLoaderByUserName.load(userName)

        // Check to see if user has phone validated
        let status
        if (user.phoneValidated) {
          await sendAuthTextMsg({ user })
          status =
            "We've sent you a text message with an authentication code to sign into Pulse."
        } else {
          status =
            "We've sent you an email with an authentication code to sign into Pulse."
          await sendAuthEmail({ user })
        }

        console.info(
          `User: ${user._key} successfully signed in, and sent auth msg.`,
        )

        return {
          status,
          authenticateToken: token,
        }
      } else {
        try {
          // Increase users failed login attempts
          await query`
            FOR u IN users
              UPDATE ${user._key} WITH { failedLoginAttempts: ${
            user.failedLoginAttempts + 1
          } } IN users
          `
        } catch (err) {
          console.error(
            `Database error ocurred when incrementing user: ${user._key} failed login attempts: ${err}`,
          )
          throw new Error('Unable to sign in, please try again.')
        }
        console.warn(
          `User attempted to authenticate: ${user._key} with invalid credentials.`,
        )
        throw new Error('Unable to sign in, please try again.')
      }
    }
  },
})

module.exports = {
  signIn,
}