const express = require('express')
const likeControll = require('../controller/like')
<<<<<<< HEAD
const router = express.Router()

router.post('/likes', likeControll.createLike)
=======
const authMiddleware = require('../middleware/authmiddleware')
const router = express.Router()

router.post('/:aptNo', authMiddleware, likeControll.createLike)
>>>>>>> main

module.exports = router