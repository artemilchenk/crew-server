const express = require('express')
const PostControllers = require("../controllers/post-controller")
const {checkUser} = require('../controllers/middleware/auth-middleware')
const postRoutes = express.Router();

postRoutes.get('/query', PostControllers.getPosts)

postRoutes.get('/:id', PostControllers.getPost)

postRoutes.post('/create', checkUser, PostControllers.createPost)

postRoutes.post('/delete', checkUser, PostControllers.deletePost)

export = postRoutes
