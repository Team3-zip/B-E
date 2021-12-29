const express = require('express');
const router = express.Router();
const mainRouter = require('./main');
const detailRouter = require('./detail');
const userRouter = require('./user');
const commentRouter = require('./comment');

router.use('/main', mainRouter);
router.use('/', detailRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);



module.exports = router;