const jwt = require("jsonwebtoken")
const  User = require("../models/User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    const [tokenType, tokenValue] = authorization.split(' ')

    if (tokenType !== 'Bearer') {
        next()
        res.status(401).send({ 
        })
        
        return
    }

    try {
        // const { userKey }=  
        User.findByPk(userKey).then((user) => {
            res.locals.user = user
            next()
        })
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        })
        return
    }
}
