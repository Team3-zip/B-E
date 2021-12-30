const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const commentController = require('../controller/comment');



router.get('/:aptNo',authMiddleware,commentController.getComment);
router.post('/:aptNo',authMiddleware, commentController.postComment);
router.patch('/:aptNo/:commentId',authMiddleware, commentController.patchComment);
router.delete('/:aptNo/:commentId', authMiddleware,commentController.deleteComment);

module.exports = router