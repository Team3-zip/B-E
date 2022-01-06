const express = require('express')
const mypageControll = require('../controller/mypage')
const authmiddleware = require('../middleware/authmiddleware')
const router = express.Router()

router.get('/:userKey', authmiddleware, mypageControll.getMypage)
router.put('/:userName/:likeId/:aptNo', authmiddleware, mypageControll.putMypage)

module.exports = router