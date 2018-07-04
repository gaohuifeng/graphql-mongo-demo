const { GraphQLServer } = require('graphql-yoga')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')
const context = require('./db')

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context
})

server.start({port: 4000})
