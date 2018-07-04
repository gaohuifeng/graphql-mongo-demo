const db = require('../db')

module.exports = {
  Query: {
    user: async (_, params) => {
      console.log('--------', 'query user by', params.id)
      const data = await db.user.findById(params.id)
      return data
    },
    users: async (_, params) => {
      console.log('--------', 'query users')
      const pageNo = params.page || 1
      const pageSize = params.size || 10
      const data = await db.user.find({}).skip((pageNo - 1) * pageSize).limit(pageSize)
      return data
    }
  },

  Mutation: {
    createUser: async (_, params) => {
      const data = await db.user.create({name: params.name})
      return data
    },

    updateUser: async (_, params) => {
      await db.user.update({_id: params.id}, {name: params.name})
      return true
    },

    deleteUser: async (_, params) => {
      await db.user.remove({_id: params.id})
      return true
    }
  }
}
