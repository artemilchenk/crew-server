const  express = require('express')
const ProfileControllers = require("../controllers/profile-controller")
const profileRoutes = express.Router();


profileRoutes.get('/:id', ProfileControllers.getProfile)

profileRoutes.post('/update/:id', ProfileControllers.updateProfile)

export = profileRoutes
