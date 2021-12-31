const express = require('express')
const likeControll = require('../controller/like')
const router = express.Router()

router.post('/:aptNo', likeControll.createLike)

module.exports = router