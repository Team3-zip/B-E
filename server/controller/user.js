const Users = require('../models/User')
const jwt = require('jsonwebtoken')

const getUsers = async (req, res) => {
    const { userKey, nickname } = req.body

    const existUsers = await Users.findAll({ where: { userKey, nickname } })

    if (existUsers.length) {
        res.status(400).send({
            errorMessage: '잘못된 경로입니다.'
        })
        return
    }
    const token = jwt.sign({ userkey: existUsers.userKey }, 'my-secret-key')

    await Users.create({ userKey, nickname })
    res.status(200).send({ token })
}

module.exports = {
    getUsers
}