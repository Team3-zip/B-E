const Users = require('../models/User')

const getMypage = async (req, res, next) => {
    const { userKey } = res.locals.user
}

module.exports = {
    getMypage
}