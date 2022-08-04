import mongoose from 'mongoose'

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: String,
    email: String,
    age: String,
    password: String,
    phone: String,
    instagram: String,
    facebook: String,
    about:String,
    location: String,
    role:Array,
    posts:Array,
    createdAt: String,
});

export = mongoose.model('User',userSchema)