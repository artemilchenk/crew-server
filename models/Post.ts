import mongoose from 'mongoose'
const Schema = mongoose.Schema;


const postSchema = new Schema({
    name: String,
    job: String,
    about: String,
    search: String,
    owner: String,
    comments: Array,
    createdAt: String,
    likes: Array
});

module.exports = mongoose.model('Post',postSchema)