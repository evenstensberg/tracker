import { GraphQLEnumType } from 'graphql'

export const UserActionEnums = new GraphQLEnumType({
  name: 'UserActionEnums',
  values: {
    CREATE: {
      value: 'create',
      description: 'A new resource was created.',
    },
    DELETE: {
      value: 'delete',
      description: 'A resource was deleted.',
    },
    ADD: {
      value: 'add',
      description: 'An affiliation between resources was created.',
    },
    UPDATE: {
      value: 'update',
      description: 'Properties of a resource or affiliation were modified.',
    },
    REMOVE: {
      value: 'remove',
      description: 'An affiliation between resources was deleted.',
    },
  },
  description: 'Describes actions performed by users to modify resources.',
})
