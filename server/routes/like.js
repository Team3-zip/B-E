const express = require('express')
const likeControll = require('../controller/like')
const router = express.Router()

router.post('/likes', likeControll.createLike)

module.exports = router