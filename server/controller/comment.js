const { Comment, User } = require('../models');
const { date_formmatter } = require('../utils/dateFormat');


const getComment = async (req, res, next) => {
    let comments = [];
    let commentInfo = {};
    try {
        const { aptNo } = req.params;
        const comment_list = await Comment.findAll({
            include: [
                {
                    User,
                    attributes: ['nickname']
                }
            ],
            order: [['commentId', 'DESC']], //내림차순
            where: { fk_pblacNo: aptNo }
        });
        for (i in comment_list) {
            const { commentId, content, fk_userKey, createdAt, User } = comment_list[i];
            let createTime = date_formmatter(new Date(createdAt));
            commentInfo['commentId'] = commentId;
            commentInfo['nickname'] = User['nickname'];
            commentInfo['content'] = content;
            commentInfo['fk_userKey'] = fk_userKey;
            commentInfo['createdAt'] = createTime;

            comments.push(commentInfo);
            commentInfo = {};
        }
        res.status(200).send({ comments });
    } catch (error) {
        next(error);
        res.status(400);
    }
}

const postComment = async (req, res, next) => {
    //const {userKey} = req.locals.user;
    const { aptNo } = req.params;
    const { content, userKey } = req.body;
    try {
        if (!userKey) {
            res.status(401);
            return;
        } else {

            await Comment.create({
                fk_userKey: userKey,
                fk_pblancNo: aptNo,
                content: content
            });
        }
        res.status(201).send({});
    } catch (error) {
        next(error);
        res.status(400);
    }
}
const patchComment = async (req, res, next) => {
    const { content } = req.body;
    const { userKey } = res.locals.user;
    const { aptNo, commentId } = req.params;
    try {
        await Comment.update({
            content: content,
            where: { commentId: commentId }
        })
        res.status(204).send({});
    } catch (error) {
        next(error);
        res.status(400);
    }
}

const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { userKey } = req.locals.user;
    try {
        const comment = await Comment.findOne({
            where: { commentId: commentId, fk_userKey: userKey }
        });
        if (comment) {
            await comment.destroy();
        }
        res.status(204)
    } catch (error) {
        next(error);
        res.status(400);
    }
}

module.exports = {
    getComment,
    postComment,
    patchComment,
    deleteComment
}