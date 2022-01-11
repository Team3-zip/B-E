const express = require('express');
const router = express.Router();

const detailController = require('../controller/detail');
const sidoMiddleware = require('../middleware/sidomiddleware')


router.post('/private/:aptNo',sidoMiddleware,detailController.getPrivateDetail);
router.post('/public/:aptNo', sidoMiddleware,detailController.getPublicDetail);
router.post('/private/:aptNo/img', sidoMiddleware,detailController.getPrivateImgUrl);
router.post('/public/:aptNo/img', sidoMiddleware,detailController.getPublicImgUrl);
module.exports = router