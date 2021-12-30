const { Comment, User } = require('../models');
const { date_formmatter } = require('../utils/dateFormat');
const {Op} = require('sequelize');
const {like, or} = Op

const getComment = async (req, res, next) => {
    let comments = [];
    let commentInfo = {};
    try {
        const { aptNo } = req.params;
        const comment_list = await Comment.findAll({
            order: [['commentId', 'DESC']], //내림차순
            where :{
                [or]:[
                    {fk_pblancNo : aptNo},
                    {panId : aptNo}
                ]
            },
            raw:true
        });
        for (i in comment_list) {
            const { commentId, content, fk_userKey, createdAt } = comment_list[i];
            const user = await User.findOne({
                attributes:['nickname'],
                where :{userKey : fk_userKey},
                raw:true
            })
            let createTime = date_formmatter(new Date(createdAt));
            console.log(user);
            commentInfo['commentId'] = commentId;
            commentInfo['nickname'] = user.nickname;
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

const postComment = async(req, res, next)=>{
    const {userKey} = res.locals.user;
    const {aptNo}= req.params;
    const {content} = req.body;
    try{
        if(!userKey){
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
    //const { userKey } = res.locals.user;
    const { aptNo, commentId } = req.params;
    try {
        await Comment.update(
            { content: content},
            {where: { commentId: commentId }} 
        )
        res.status(204).send({});
    } catch (error) {
        next(error);
        res.status(400);
    }
}

const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findOne({
            attributes :['commentId'],
            where: { commentId :commentId}
        });
        console.log(comment)
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