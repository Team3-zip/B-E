const { Sequelize,sequelize,PubNotice,PublicImg } = require('../models')
const Youtube = require('../models/Youtube');

const getYouTube = async (req, res, next) => {
    const youtubeList = await Youtube.findAll({})
    res.send(youtubeList)
}


module.exports = {
    getYouTube
}