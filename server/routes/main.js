const express = require('express');


const router = express.Router();

const mainCntrol = require('../controllers/main');

getYouTube = mainCntrol.getYouTube;

router.get('/youtube', getYouTube)

module.exports = router