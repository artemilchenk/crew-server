const express = require('express')
const CommentControllers = require("../controllers/comment-controller")
const {checkUser} = require("../controllers/middleware/auth-middleware")
const commentRoutes = express.Router();

commentRoutes.post('/create', checkUser, CommentControllers.createComment)
commentRoutes.get('/all/:targetId', CommentControllers.getComments)
commentRoutes.post('/delete/:id', checkUser, CommentControllers.deleteComment)

export = commentRoutes
