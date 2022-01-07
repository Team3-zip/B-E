const jwt = require("jsonwebtoken")
const  User = require("../models/User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    const { userKey } = req.body;
    JSON.stringify(authorization);
    const [tokenType, tokenValue] = (authorization||'').split(' ')

    if (tokenType !== 'Bearer') {
        
        next()
        
        return
    }

    try {
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
