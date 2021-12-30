const express = require('express')
const likeControll = require('../controller/like')
const router = express.Router()

router.post('/like', likeControll.createLike)

module.exports = router