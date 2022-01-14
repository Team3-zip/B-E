const express = require('express')
const mypageControll = require('../controller/mypage')
const authmiddleware = require('../middleware/authmiddleware')
const router = express.Router()

router.get('/:userKey', authmiddleware, mypageControll.getMypage)
router.put('/:userName', authmiddleware, mypageControll.putMypage)
router.put('/:userName/email', authmiddleware, mypageControll.putEmail)

module.exports = router