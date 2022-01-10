const express = require('express')
const likeControll = require('../controller/like')
const authMiddleware = require('../middleware/authmiddleware')
const router = express.Router()

router.post('/:aptNo', authMiddleware, likeControll.createLike)

module.exports = router