const { User } = require("../models")

module.exports = (req, res, next) => {
    const { authorization } = req.headers; // http 인증 시 header에 담아서 보냄
    const { userKey } = req.body;
    JSON.stringify(authorization);
    const [tokenType, tokenValue] = authorization.split(' ');
    
    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.',
        });
        return;
    }

    try {
        
        User.findByPk(userKey).then((user) => {
            res.locals.user = user;
            next(); 
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.',
        });
        return;
    }
};