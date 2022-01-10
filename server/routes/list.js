const express = require('express');
const privateControll = require('../controller/privateList');
const publicControll = require('../controller/publicList');
<<<<<<< HEAD
const router = express.Router()

router.get('/private', privateControll.getPrivateNotice)
router.get('/private/:sido', privateControll.getPrivateNotice2)

router.get('/public', publicControll.getPublicNotice)
router.get('/public/:sidoName', publicControll.getPublicNotice2)
=======
const sidoMiddleware = require('../middleware/sidomiddleware')
const router = express.Router()

router.get('/private', sidoMiddleware, privateControll.getPrivateNotice)
//router.get('/private/:sido', privateControll.getPrivateNotice2)

router.get('/public', sidoMiddleware, publicControll.getPublicNotice)
//router.get('/public/:sidoName', publicControll.getPublicNotice2)
>>>>>>> main

module.exports = router