module.exports = {
  Query: {
    article: async (_, params, ctx) => {
      console.log('--------', 'query article by', params.id)
      const data = await ctx.db.article.findById(params.id) // .populate({path: 'author'})
      return data
    },
    articles: async (_, params, ctx) => {
      console.log('--------', 'query articles')
      const pageNo = params.page || 1
      const pageSize = params.size || 10
      const data = await ctx.db.article.find({}).skip((pageNo - 1) * pageSize).limit(pageSize)
      return data
    }
  },
  Article: {
    author: async (obj, params, ctx) => {
      console.log('--------', 'query user by', obj.author)
      const data = await ctx.db.user.findById(obj.author)
      return data
    },
    comments: async (obj, params, ctx) => {
      console.log('--------', 'query comment by', obj.comments)
      const data = await ctx.db.comment.find({_id: obj.comments})
      return data
    }
  }
}
