const { Sequelize, sequelize, PublicImg } = require('../models')
const Youtube = require('../models/Youtube');
const PubNotice = require('../models/PubNotice')
const PrivateApt = require('../models/PrivateApt')
const User = require('../models/User')
const {Op} = require('sequelize');
const {like, or} = Op

const getYouTube = async (req, res, next) => {
    const youtubeList = await Youtube.findAll({})
    res.send(youtubeList)
}
const getpublicHot = async (req, res, next) => {
    let pubHotarr = []
    const pubHotIds = await sequelize.query('SELECT panId,count(*) from likes group by panId order by count(*) desc')
    for (let item of pubHotIds[0]) {
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
    const privateHotIds = await sequelize.query('SELECT fk_pblancNo,count(*) from likes group by fk_pblancNo order by count(*) desc')
    for (let item of privateHotIds[0]) {
        privateHotarr.push(item['pblancNo'])
    }
    const provateHotList = await PrivateApt.findAll({
        where: { pblancNo : privateHotarr }
    });
    res.send(provateHotList)
}
const getMyPublicSido = async (req,res,next) =>{
    try{
        const { userKey } = res.locals.user
        var mysido = await User.findOne({
            attributes: ['sido'],
            where : {userKey : userKey},
            raw:true
            
        });
        mysido = mysido['sido']
    }catch{
        mysido = "경기도"
    }
    // const test = await sequelize.query(`SELECT * FROM Pubnotices WHERE sidoName="인천광역시"`)
    // console.log(test[0])
    console.log(mysido)
    const pubSido = await PubNotice.findAll({
        where: {
                    sidoName: {
                        [like]: `%${mysido}%`
                    }    
        },
        raw:true
        
    })
    
    res.send(pubSido)
}

const getMyPrivateSido = async (req,res,next) =>{
    try{
        const { userKey } = res.locals.user
        var mysido = await User.findOne({
            attributes: ['sido'],
            where : {userKey : userKey},
            raw:true
        });
        mysido = mysido['sido']
    }catch{
        mysido = "경기"
    }
    const privateSido = await PrivateApt.findAll({
        where: {
                    sido: {
                        [like]: `%${mysido}%`
                    }
        },
        raw:true
    })
    res.send(privateSido)
}


module.exports = {
    getYouTube,getpublicHot,getprivateHot,getMyPublicSido,getMyPrivateSido
}