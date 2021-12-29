const express = require('express');

const router = express.Router();

const mainRouter = require('./main');
const detailRouter = require('./detail');
const commentRouter = require('./comment');

router.use('/main', mainRouter);
router.use('/', detailRouter);
router.use('/comments', commentRouter);


module.exports = router;