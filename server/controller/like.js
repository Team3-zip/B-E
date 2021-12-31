const Likes = require('../models/Like')
const Private = require('../models/PrivateApt')
const Public = require('../models/PubNotice')
const { Op } = require('sequelize')

const createLike = async (req, res) => {
    const { aptNo } = req.params
    const { userKey } = req.body
    // const { userKey } = res.locals.user
    try {
        const existLike = await Likes.findOne({
            where: { fk_userKey: userKey, [Op.or]: { fk_pblancNo: aptNo, panId: aptNo } }
        })
        const existPrivatAptNo = await Private.findOne({
            attributes: ['pblancNo'],   // 어떤 값을 찾을지
            where: { pblancNo: aptNo }, // 조건
            raw: true   // 부가적인 거 없고 데이터 값만 나오게
        })

        if (!existLike) {
            if (existPrivatAptNo) {
                await Likes.create({ fk_userKey: userKey, fk_pblancNo: aptNo })
                res.send((result = { data: true }))
            } else {
                await Likes.create({ fk_userKey: userKey, panId: aptNo })
                res.send((result = { data: true }))
            }
        } else {
            if (existPrivatAptNo) {
                await Likes.destroy({ where: { fk_userKey: userKey, fk_pblancNo: aptNo } })
                res.send((result = { data: false }))
            } else {
                await Likes.destroy({ where: { fk_userKey: userKey, panId: aptNo } })
                res.send((result = { data: false }))
            }
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