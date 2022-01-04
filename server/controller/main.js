const { Sequelize, sequelize, PublicImg, PrivateImg } = require('../models')
const Youtube = require('../models/Youtube');
const PubNotice = require('../models/PubNotice')
const PrivateApt = require('../models/PrivateApt')
const User = require('../models/User')
const Like = require('../models/Like')

const {Op} = require('sequelize');
const {like, or} = Op

const getYouTube = async (req, res, next) => {
    const youtubeList = await Youtube.findAll({})
    res.send(youtubeList)
}
const getpublicHot = async (req, res, next) => {
    let pubHotarr = []
    const pubHotIds = await sequelize.query('SELECT panId,count(*) from likes group by panId order by count(*) desc')
    console.log(pubHotIds)
    for (let item of pubHotIds[0]) {
        console.log(item)
        pubHotarr.push(item['panId'])
    }
    const pubHotList = await sequelize.query(
        'SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="12345" WHERE Pubnotices.panId IN (SELECT Pubnotices.panId FROM likes group by panId ORDER BY COUNT(*) DESC)'
        )
    // const pubHotList = await PubNotice.findAll({
    //     where: { panId : pubHotarr },
    //     // include: {
    //     //     model: Like,
    //     //     where: {panId, userKey:res.locals.userKey},
    //     //     attributes: ['url1']}
    // });
    res.send(pubHotList[0])

    // for (let id of pubHotarr) {
    //     PubNotice.findAll({
    //         where: { "panId": pubHotarr }
    //     });
    // }

}
const getprivateHot = async (req, res, next) => {
    let privateHotarr = []
    const privateHotIds = await sequelize.query('SELECT fk_pblancNo,count(*) from likes group by fk_pblancNo order by count(*) desc')
    console.log(privateHotIds)
    for (let item of privateHotIds[0]) {
        console.log(item)
        privateHotarr.push(item['fk_pblancNo'])

    }
    const provateHotList = await sequelize.query(
        'SELECT privateapts.*,(SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="12345" WHERE privateapts.pblancNo IN (SELECT privateapts.pblancNo FROM likes group by fk_pblancNo ORDER BY COUNT(*) DESC)'
    )
    // const provateHotList = await PrivateApt.findAll({
    //     where: { pblancNo : privateHotarr }
    // });
    res.send(provateHotList[0])
}
const getMyPublicSido = async (req,res,next) =>{
    try{
        var { userKey } = res.locals.user
        var mysido = await User.findOne({
            attributes: ['sido'],
            where : {userKey : userKey},
            raw:true
            
        });
        mysido = mysido['sido']
    }catch{
        userKey = ''
        mysido = "경기도"
    }
    // const test = await sequelize.query(`SELECT * FROM Pubnotices WHERE sidoName="인천광역시"`)
    // console.log(test[0])
    console.log(mysido)
    const pubSido = await sequelize.query(
        `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%${mysido}%'`
    )
    // const pubSido = await PubNotice.findAll({
    //     where: {
    //                 sidoName: {
    //                     [like]: `%${mysido}%`
    //                 }    
    //     },
    //     include:[ {
    //         model: PublicImg,
    //         attributes: ['url1']
    //     }],
    //     raw:true
        
    // })
    
    res.send(pubSido[0])
}

const getMyPrivateSido = async (req,res,next) =>{
    try{
        var { userKey } = res.locals.user
        var mysido = await User.findOne({
            attributes: ['sido'],
            where : {userKey : userKey},
            raw:true
        });
        mysido = mysido['sido']
    }catch{
        userKey = ''
        mysido = "경기"
    }
    const privateSido = await sequelize.query(
        `SELECT privateapts.*,(SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.sido LIKE '%${mysido}%'`
    )
    // const privateSido = await PrivateApt.findAll({
    //     where: {
    //                 sido: {
    //                     [like]: `%${mysido}%`
    //                 }
    //     },
    //     include:[ {
    //         model: PrivateImg,
    //         attributes: ['url1']
    //     }],
    //     raw:true
    // })
    res.send(privateSido[0])
}


module.exports = {
    getYouTube,getpublicHot,getprivateHot,getMyPublicSido,getMyPrivateSido
}