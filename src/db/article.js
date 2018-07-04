const mongoose = require('mongoose')
const { Schema } = mongoose

const ArticleSchema = new Schema({
  text: String,
  isPublished: {
    type: Boolean,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    // ref: 'User',
    required: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
})

module.exports = mongoose.model('article', ArticleSchema)
