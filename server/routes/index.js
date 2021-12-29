const express = require('express');
const router = express.Router();
const mainRouter = require('./main');
const detailRouter = require('./detail');
const userRouter = require('./user');
const commentRouter = require('./comment');
const privateListRouter = require('./privateList');
const publicListRouter = require('./publicList');
const likeRouter = require('./like');

router.use('/main', mainRouter);
router.use('/', detailRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
router.use('/list', privateListRouter);
router.use('/list', publicListRouter);
router.use('/:likeId', likeRouter);

module.exports = router;