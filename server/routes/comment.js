const express = require('express');
const router = express.Router();

const commentController = require('../controller/comment');



router.get('/:aptNo',commentController.getComment);
router.post('/:aptNo', commentController.postComment);
router.patch('/:aptNo/:commentId', commentController.patchComment);
router.delete('/:aptNo/:commentId', commentController.deleteComment);

module.exports = router