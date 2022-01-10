const express = require('express');
const privateControll = require('../controller/privateList');
const publicControll = require('../controller/publicList');
const router = express.Router()

router.get('/private', privateControll.getPrivateNotice)
router.get('/private/:sido', privateControll.getPrivateNotice2)

router.get('/public', publicControll.getPublicNotice)
router.get('/public/:sidoName', publicControll.getPublicNotice2)

module.exports = router