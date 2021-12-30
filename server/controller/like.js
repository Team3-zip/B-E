const Likes = require('../models/Like')
const { Op } = require('sequelize')
const { Like } = require('../models')

const createLike = async (req, res, next) => {
    const { fk_userKey } = res.locals.user
    const { aptNo } = req.params

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
            if (fk_pblancNo) {
                await Likes.create({ fk_userKey, fk_pblancNo })
                res.send((result = { data: true }))
            } if (panId) {
                await Likes.create({ fk_userKey, panId })
                res.send((result = { data: false }))
            }
            // await Likes.create({ fk_userKey })
            // res.send((result = { data: true }))
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