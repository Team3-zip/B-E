const express = require('express')
const privateControll = require('../controller/privateList')
const router = express.Router()

router.get('/private', privateControll.getPrivateNotice)
router.get('/private2', privateControll.getPrivateNotice2)

module.exports = router