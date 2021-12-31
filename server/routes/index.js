const express = require('express');
const router = express.Router();
const mainRouter = require('./main');
const detailRouter = require('./detail');
const userRouter = require('./user');
const commentRouter = require('./comment');
const listRouter = require('./list');
const likeRouter = require('./like');
const mypageRouter = require('./mypage');

router.use('/main', mainRouter);
router.use('/', detailRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
router.use('/', listRouter);
router.use('/likes', likeRouter);
router.use('/users', mypageRouter);

module.exports = router;