const Private = require('../models/PrivateApt')
const {Sequelize} = require('sequelize');
const {like} = Sequelize.Op;

const getPrivateNotice = async (req, res) => {
    try {
        const priNotice = await Private.findAll({ order: [["recruitDate", "ASC"]] })
        res.send({ result: priNotice })
    } catch (error) {
        res.send({ error })
    }
}

const getPrivateNotice2 = async (req, res) => {
    const { sido } = req.query
    const priNotice2 = await Private.findAll({
        order: [["recruitDate", "ASC"]],
        where: sido ? { sido } : undefined
    })


    res.send({ priNotice2 })
}

module.exports = {
    getPrivateNotice,
    getPrivateNotice2
}