const express = require('express')
const publicControll = require('../controller/publicList')
const router = express.Router()

router.get('/public', publicControll.getPublicNotice)
router.get('/public2', publicControll.getPublicNotice2)

module.exports = router