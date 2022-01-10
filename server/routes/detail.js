const express = require('express');
const router = express.Router();

const detailController = require('../controller/detail');
const sidoMiddleware = require('../middleware/sidomiddleware')


router.get('/private/:aptNo',sidoMiddleware,detailController.getPrivateDetail);
router.get('/public/:aptNo', sidoMiddleware,detailController.getPublicDetail);
router.get('/private/:aptNo/img', sidoMiddleware,detailController.getPrivateImgUrl);
router.get('/public/:aptNo/img', sidoMiddleware,detailController.getPublicImgUrl);
module.exports = router