const { Sequelize, sequelize, PublicImg } = require('../models')
const Youtube = require('../models/Youtube');
const PubNotice = require('../models/PubNotice')
const PrivateApt = require('../models/PrivateApt')

const getYouTube = async (req, res, next) => {
    const youtubeList = await Youtube.findAll({})
    res.send(youtubeList)
}
const getpublicHot = async (req, res, next) => {
    let pubHotarr = []
    const pubHotIds = await sequelize.query('SELECT panId,count(*) from Pubnotices group by panId order by count(*) desc')
    for (let item of pubHotIds) {
        pubHotarr.push(item['pubId'])
    }
    const pubHotList = await PubNotice.findAll({
        where: { panId : pubHotarr }
    });
    res.send(pubHotList)

    // for (let id of pubHotarr) {
    //     PubNotice.findAll({
    //         where: { "panId": pubHotarr }
    //     });
    // }

}
const getprivateHot = async (req, res, next) => {
    let privateHotarr = []
    const privateHotIds = await sequelize.query('SELECT pblancNo,count(*) from privateapts group by pblancNo order by count(*) desc')
    for (let item of privateHotIds) {
        privateHotarr.push(item['pblancNo'])
    }
    const provateHotList = await PrivateApt.findAll({
        where: { pblancNo : privateHotarr }
    });
    res.send(provateHotList)
}
const getMyPublicSido = async (req,res,next) =>{
    try{
        var mysido = res.locals.user.sido
    }catch{
        mysido = "서울"
    }
    const pubSido = await PubNotice.findAll({
        where: { sidoName : mysido }
    })
    
    res.send(pubSido)
}

const getMyPrivateSido = async (req,res,next) =>{
    try{
        var mysido = res.locals.user.sido
    }catch{
        mysido = "서울"
    }
    const privateSido = await PrivateApt.findAll({
        where: { sido : mysido }
    })
    res.send(privateSido)
}


module.exports = {
    getYouTube,getpublicHot,getprivateHot,getMyPublicSido,getMyPrivateSido
}