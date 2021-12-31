const Likes = require('../models/Like')
const { Op } = require('sequelize')

const createLike = async (req, res) => {
    const { aptNo } = req.params
    const { userKey } = req.body
    // const { userKey } = res.locals.user

    try {
        const existLike = await Likes.findOne({
            where: { fk_userKey: userKey }
        })
        if (!existLike) {
            if (fk_pblancNo) {
                await Likes.create({ fk_userKey: userKey, fk_pblancNo: aptNo })
                res.send((result = { data: true }))
            } if (panId) {
                await Likes.create({ fk_userKey: userKey, panId: aptNo })
                res.send((result = { data: true }))
            }
        } else {
            await Likes.destroy({
                where: { fk_userKey: userKey, [Op.or]: [{ fk_pblancNo: aptNo }, { panId: aptNo }] }
            })
            res.send((result = { data: false }))
        }
        res.status(200).sned({ message: 'success' })
    } catch (error) {
        console.log('-------------------------------')
        console.log('에러발생' + error)
        res.status(400).send({ errorMessage: 'fail' })
    }
}

module.exports = {
    createLike
}