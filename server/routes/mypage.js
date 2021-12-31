const express = require('express')
const mypageControll = require('../controller/mypage')
const authmiddleware = require('../middleware/authmiddleware')
const router = express.Router()

router.get('/', authmiddleware, mypageControll.getMypage)
router.put('/:nickname', authmiddleware, mypageControll.putMypage)

module.exports = router