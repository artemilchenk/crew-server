const jwt = require("jsonwebtoken")
function checkUser(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.status(400).send({message: "U are not authorized!"})

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) return res.status(400).send({message: "Token is not valid"})
            req.user = user
            next()
        })
    } catch (err) {
        res.status(400).send({message: "U are not authorized!"})
    }


}

module.exports = {checkUser}