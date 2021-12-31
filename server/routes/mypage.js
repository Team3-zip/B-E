const express = require('express')
const mypageControll = require('../controller/mypage')
const authmiddleware = require('../middleware/authmiddleware')
const router = express.Router()

router.get('/', authmiddleware, mypageControll.getMypage)
router.put('/:sido', authmiddleware, mypageControll.putMypage)

module.exports = router