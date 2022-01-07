const jwt = require("jsonwebtoken")
const  User = require("../models/User")

module.exports = (req, res, next) => {
    const { authorization ,userKey} = req.headers;
    //const { userKey } = req.body;
    JSON.stringify(authorization);
    JSON.stringify(userKey);
    const [tokenType, tokenValue] = authorization.split(' ');
    const [token, user]= userKey.split(' ');
    console.log(user)
    console.log(tokenType);
    console.log(authorization)
    console.log("userKey :"+user);
    if (tokenType !== 'Bearer') {  
        next()
        return
    }

    try {
        User.findByPk({userKey:user}).then((user) => {
            res.locals.user = user
            console.log(res.locals.user)
            next()
        })
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        })
        return
    }
}
