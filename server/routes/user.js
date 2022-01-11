const express = require('express')
const userControll = require('../controller/user')
const authMiddleware = require('../middleware/authmiddleware')
const router = express.Router()

router.post('/login', userControll.getUsers)

module.exports = router