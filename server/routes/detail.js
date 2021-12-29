const express = require('express');
const router = express.Router();

const detailController = require('../controller/detail');



router.get('/private/:aptNo',detailController.getPrivateDetail);
router.get('/public/:aptNo', detailController.getPublicDetail);
router.get('/private/:aptNo/img', detailController.getPrivateImgUrl);
router.get('/public/:aptNo/img', detailController.getPublicImgUrl);
module.exports = router