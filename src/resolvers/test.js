module.exports = {
  Query: {
    test: (_, { name }) => `hello ${name || 'world'}`
  }
}
