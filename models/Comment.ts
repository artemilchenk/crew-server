import mongoose from 'mongoose'
const Schema = mongoose.Schema;


const commentSchema = new Schema({
  owner: String,
  text: String,
  comments: Array,
  createdAt: String,
  likes: Array,
  targetId: String
});

module.exports = mongoose.model('Comment',commentSchema)