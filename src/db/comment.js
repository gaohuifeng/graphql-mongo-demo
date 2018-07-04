const mongoose = require('mongoose')
const { Schema } = mongoose

const CommentSchema = new Schema({
  desc: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
})

module.exports = mongoose.model('comment', CommentSchema)
