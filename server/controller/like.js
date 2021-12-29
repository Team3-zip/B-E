const Likes = require('../models/Like')
const { Op } = require('sequelize')

const createLike = async (req, res, next) => {
    const { fk_userKey } = res.locals.user
    const { likeId } = req.params

    try {
        const existLike = await Likes.findOne({
            where: { [Op.and]: { fk_userKey, likeId } }
        })
        if (existLike) {
            await Likes.destroy({
                where: { [Op.and]: { fk_userKey, likeId } }
            })
            res.send((result = { data: false }))
        } else {
            await Likes.create({
                where: { fk_userKey, likeId }
            })
            res.send((result = { data: true }))
        }
        res.status(200).sned({ message: 'success' })
    } catch (error) {
        console.log('-------------------------------')
        res.status(400).send({ errorMessage: '에러 발생' + error })
    }
}

module.exports = {
    createLike
}