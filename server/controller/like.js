const Likes = require('../models/Like')
const Private = require('../models/PrivateApt')
const { Op } = require('sequelize')

const createLike = async (req, res) => {
    const { aptNo } = req.params
    const { userKey } = req.body
    // const { userKey } = res.locals.user
    try {
        const existLike = await Likes.findOne({ where: { fk_userKey: userKey } })
        const existAptNo = await Private.findOne({ where: { pblancNo: aptNo } })

        if (!existLike) {
            if (existAptNo) {
                await Likes.create({ fk_userKey: userKey, fk_pblancNo: aptNo })
                res.send((result = { data: true }))
            } else { // 공영일거다
                await Likes.create({ fk_userKey: userKey, panId: aptNo })
                res.send((result = { data: true }))
            }
        } else {
            await Likes.destroy({
                where: { fk_userKey: userKey, [Op.or]: [{ fk_pblancNo: aptNo }, { panId: aptNo }] }
            })
            res.send((result = { data: false }))
        }
    } catch (error) {
        console.log('-------------------------------')
        console.log('에러발생' + error)
        res.status(400).send({ errorMessage: 'fail' })
    }
}

module.exports = {
    createLike
}