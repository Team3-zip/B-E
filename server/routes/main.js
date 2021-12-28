const express = require('express');


const router = express.Router();

const mainCntrol = require('../controller/main');

getYouTube = mainCntrol.getYouTube;

router.get('/youtube', getYouTube)

module.exports = router