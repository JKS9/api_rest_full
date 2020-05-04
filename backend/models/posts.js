const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    title: {
      type: String,
    },
    creator: {
      id: String,
      name: String,
    },
    createdAt: {
      type: String,
    },
    image: {
      type: String
    },
    content: {
      type: String
    }
}, {
  collection: 'Posts',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})

module.exports = Schema