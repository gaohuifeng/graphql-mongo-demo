const DataLoader = require('dataloader')
const db = require('../db').db
const _ = require('lodash')

const getUsers = async (ids) => {
  console.log('--------', 'query user by', ids)
  const data = await db.user.find({_id: ids})
  return data
}

global.userLoader = new DataLoader((keys) => {
  return getUsers(_.uniq(keys))
})

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
      // const data = await ctx.db.user.findById(obj.author)
      const data = await global.userLoader.load(obj.author.toString())
      return data
    }
  }
}
