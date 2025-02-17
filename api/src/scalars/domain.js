import { Kind, GraphQLError, GraphQLScalarType } from 'graphql'

const validate = (value) => {
  if (typeof value !== typeof 'string') {
    throw new TypeError(`Value is not a string: ${typeof value}`)
  }

  value = value.toLowerCase()

  const DOMAIN_REGEX =
    /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/

  if (!DOMAIN_REGEX.test(value)) {
    throw new TypeError(`Value is not a valid domain: ${value}`)
  }

  return value
}

export const Domain = new GraphQLScalarType({
  name: 'DomainScalar',
  description: 'String that conforms to a domain structure.',
  serialize: validate,
  parseValue: validate,

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as domains but got a: ${ast.kind}`,
      )
    }
    return validate(ast.value)
  },
})

module.exports = {
  Domain,
}
