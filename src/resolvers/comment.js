module.exports = {
  Query: {
    comment: async (_, params, ctx) => {
      console.log('--------', 'query comment by', params.id)
      const data = await ctx.db.comment.findById(params.id) // .populate({path: 'author'})
      return data
    },
    comments: async (_, params, ctx) => {
      console.log('--------', 'query comments')
      const pageNo = params.page || 1
      const pageSize = params.size || 10
      const data = await ctx.db.comment.find({}).skip((pageNo - 1) * pageSize).limit(pageSize)
      return data
    }
  },
  Comment: {
    author: async (obj, params, ctx) => {
      console.log('--------', 'query user by', obj.author || params.id)
      const data = await ctx.db.user.findById(obj.author || params.id)
      return data
    }
  }
}
