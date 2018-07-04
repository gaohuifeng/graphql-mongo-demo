const {GraphQLScalarType} = require('graphql')

module.exports = {
  ObjectId: new GraphQLScalarType({
    name: 'ObjectId',
    description: 'mongo ObjectId scalar type',
    parseValue (value) {
      return String(value) // value from the client
    },
    serialize (value) {
      return String(value) // value sent to the client
    },
    parseLiteral ({value}) {
      if (new RegExp('^[0-9a-fA-F]{24}$').test(value)) {
        return value
      } else {
        throw new Error('ObjectId type err')
      }
    }
  })
}
