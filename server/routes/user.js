const express = require('express')
const userControll = require('../controller/user')
const router = express.Router()

router.get('/login', userControll.getUsers)

module.exports = router