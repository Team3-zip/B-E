const express = require('express');


const router = express.Router();

const mainCntrol = require('../controller/main');

getYouTube = mainCntrol.getYouTube;
getpublicHot = mainCntrol.getpublicHot
getprivateHot = mainCntrol.getprivateHot
getMyPublicSido = mainCntrol.getMyPublicSido
getMyPrivateSido = mainCntrol.getMyPrivateSido

router.get('/youtube', getYouTube)
router.get('/publicHot', getpublicHot)
router.get('/privateHot', getprivateHot)
router.get('/publicSido', getMyPublicSido)
router.get('/privateSido', getMyPrivateSido)

module.exports = router