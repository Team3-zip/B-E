const Likes = require('../models/Like')
const Private = require('../models/PrivateApt')
const Public = require('../models/PubNotice')
const { Op } = require('sequelize')

const createLike = async (req, res) => {
    const { aptNo } = req.params
    const { userKey } = req.body
    // const { userKey } = res.locals.user
    try {
        const existLike = await Likes.findOne({ where: { fk_userKey: userKey } })
        const existPrivatAptNo = await Private.findOne({ where: { pblancNo: aptNo } })
        const existPublicAptNo = await Public.findOne({ where: { panId: aptNo } })

        if (!existLike) {
            if (existPrivatAptNo) {
                await Likes.create({ fk_userKey: userKey, fk_pblancNo: aptNo })
                res.send((result = { data: true }))
            } else if (existPublicAptNo) { // 공영일거다
                await Likes.create({ fk_userKey: userKey, panId: aptNo })
                res.send((result = { data: true }))
            }
        } else {
            if (existPrivatAptNo) {
                await Likes.destroy({ where: { fk_userKey: userKey } }, { fk_pblancNo: aptNo })
                res.send((result = { data: false }))
            } else if (existPublicAptNo) {
                await Likes.destroy({ where: { fk_userKey: userKey } }, { panId: aptNo })
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