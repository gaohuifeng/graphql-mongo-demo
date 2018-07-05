const { GraphQLServer } = require('graphql-yoga')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start({port: 4000})
