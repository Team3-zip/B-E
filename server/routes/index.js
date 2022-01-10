const express = require('express');
const router = express.Router();
const mainRouter = require('./main');
const detailRouter = require('./detail');
const userRouter = require('./user');
const commentRouter = require('./comment');
const listRouter = require('./list');
const likeRouter = require('./like');
<<<<<<< HEAD
=======
const mypageRouter = require('./mypage');
>>>>>>> main

router.use('/main', mainRouter);
router.use('/', detailRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
router.use('/', listRouter);
<<<<<<< HEAD
router.use('/:likeId', likeRouter);
=======
router.use('/likes', likeRouter);
router.use('/users', mypageRouter);
>>>>>>> main

module.exports = router;