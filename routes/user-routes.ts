const express =  require('express')
const Controllers = require("../controllers/user-controller")
const  UserControllers = require("../controllers/user-controller") ;
const userRoutes = express.Router();
const { body } = require('express-validator')
const { checkUser } = require('../controllers/middleware/auth-middleware')


userRoutes.post('/register',
    body('password').isLength({
        min: 6
    }), body('email').isEmail().normalizeEmail(), Controllers.register)

userRoutes.post('/login', UserControllers.login)

userRoutes.post('/', checkUser, UserControllers.getUser)

userRoutes.get('/all', UserControllers.getUsers)

export = userRoutes
