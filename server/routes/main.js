const express = require('express');


const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware")
const mainCntrol = require('../controller/main');
const sidomiddleware = require('../middleware/sidomiddleware');

getYouTube = mainCntrol.getYouTube;
getpublicHot = mainCntrol.getpublicHot
getprivateHot = mainCntrol.getprivateHot
getMyPublicSido = mainCntrol.getMyPublicSido
getMyPrivateSido = mainCntrol.getMyPrivateSido
getTotal = mainCntrol.getTotal
router.get('/youtube', getYouTube)
router.get('/publicHot',  getpublicHot)
router.get('/privateHot', sidomiddleware, getprivateHot)
router.get('/publicSido', sidomiddleware, getMyPublicSido)
router.get('/privateSido', sidomiddleware, getMyPrivateSido)
router.get('/total',getTotal)
module.exports = router