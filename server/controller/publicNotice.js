const Public = require('../models/PubNotice')

const getPublicNotice = async (req, res) => {
    try {
        const pubNotice = await Public.findAll({ order: [["panUploadDate", "ASC"]] })
        res.send({ result: pubNotice })
    } catch (error) {
        res.send({ result: error })
    }
}

const getPublicNotice2 = async (req, res) => {
    const { sidoName } = req.query
    const pubNotice2 = await Public.findAll({
        order: [["panUploadDate", "ASC"]],
        where: sidoName ? { sidoName } : undefined
    })

    res.send({ pubNotice2 })
}

module.exports = {
    getPublicNotice,
    getPublicNotice2
}