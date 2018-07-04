const mongoose = require('mongoose')
const user = require('./user')
const article = require('./article')
const comment = require('./comment')
const promise = require('bluebird')
mongoose.Promise = promise
mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true })

mongoose.connection.on('connected', function () {
  console.log('Mongoose connection success')
})

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err)
})

module.exports.db = {
  user,
  article,
  comment
}
