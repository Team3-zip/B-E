const express = require('express');
const privateControll = require('../controller/privateList');
const publicControll = require('../controller/publicList');
const sidoMiddleware = require('../middleware/sidomiddleware')
const router = express.Router()

router.post('/private', sidoMiddleware, privateControll.getPrivateNotice)
//router.get('/private/:sido', privateControll.getPrivateNotice2)

router.post('/public', sidoMiddleware, publicControll.getPublicNotice)
//router.get('/public/:sidoName', publicControll.getPublicNotice2)

module.exports = router