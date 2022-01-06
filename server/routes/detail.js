const express = require('express');
const router = express.Router();

const detailController = require('../controller/detail');



router.get('/private/:aptNo',sidomiddleware,detailController.getPrivateDetail);
router.get('/public/:aptNo', sidomiddleware,detailController.getPublicDetail);
router.get('/private/:aptNo/img', sidomiddleware,detailController.getPrivateImgUrl);
router.get('/public/:aptNo/img', sidomiddleware,detailController.getPublicImgUrl);
module.exports = router