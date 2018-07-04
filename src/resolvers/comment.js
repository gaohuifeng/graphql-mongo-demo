const db = require('../db')

module.exports = {
  Query: {
    comment: async (_, params) => {
      console.log('--------', 'query comment by', params.id)
      const data = await db.comment.findById(params.id) // .populate({path: 'author'})
      return data
    },
    comments: async (_, params) => {
      console.log('--------', 'query comments')
      const pageNo = params.page || 1
      const pageSize = params.size || 10
      const data = await db.comment.find({}).skip((pageNo - 1) * pageSize).limit(pageSize)
      return data
    }
  },
  Comment: {
    author: async (obj, params) => {
      console.log('--------', 'query user by', obj.author)
      const data = await db.user.findById(obj.author)
      return data
    }
  }
}
