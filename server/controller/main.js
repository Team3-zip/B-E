const { Sequelize, sequelize, PublicImg, PrivateImg } = require('../models')
const Youtube = require('../models/Youtube');
const PubNotice = require('../models/PubNotice')
const PrivateApt = require('../models/PrivateApt')
const User = require('../models/User')
const Like = require('../models/Like')

const {Op} = require('sequelize');
const {like, or} = Op

const getTotal = async(req,res,next)=>{
    const privateTotal = await sequelize.query('SELECT count(*) AS cnt FROM privateapts')
    const publicTotal = await sequelize.query('SELECT count(*) AS cnt FROM Pubnotices')
    const total = privateTotal[0][0]['cnt'] + publicTotal[0][0]['cnt']
    res.send({total : total})
}
const getYouTube = async (req, res, next) => {
    const youtubeList = await Youtube.findAll({})
    res.send(youtubeList)
}
const getpublicHot = async (req, res, next) => {
    try{
        var { userKey } = res.locals.user;
    }catch{
        userKey = ''
    }
    let pubHotarr = []
    const pubHotIds = await sequelize.query('SELECT panId,count(*) from likes group by panId order by count(*) desc')
    console.log(pubHotIds)
    for (let item of pubHotIds[0]) {
        console.log(item)
        pubHotarr.push(item['panId'])
    }
    const pubHotList = await sequelize.query(
        `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.panId IN (SELECT likes.panId FROM likes group by panId ORDER BY COUNT(*) DESC) ORDER BY Pubnotices.panUploadDate DESC`
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
    try{
        var { userKey } = res.locals.user
    }catch{
        userKey = ''
    }
    let privateHotarr = []
    const privateHotIds = await sequelize.query('SELECT fk_pblancNo,count(*) from likes group by fk_pblancNo order by count(*) desc')
    console.log(privateHotIds)
    for (let item of privateHotIds[0]) {
        console.log(item)
        privateHotarr.push(item['fk_pblancNo'])

    }
    const privateHotList = await sequelize.query(
        `SELECT privateapts.*,
        (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
        (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
        (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.pblancNo IN (SELECT likes.fk_pblancNo FROM likes group by fk_pblancNo ORDER BY COUNT(*) DESC) ORDER BY privateapts.recruitDate DESC`
    )
    // const provateHotList = await PrivateApt.findAll({
    //     where: { pblancNo : privateHotarr }
    // });
    res.send(privateHotList[0])
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
        mysido = "경기"
    }
    // const test = await sequelize.query(`SELECT * FROM Pubnotices WHERE sidoName="인천광역시"`)
    // console.log(test[0])
    console.log(mysido)
    if (mysido == "충청도"){
        var pubSido = await sequelize.query(
            `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%충청%' ORDER BY Pubnotices.panUploadDate DESC`
        )    
    }else if(mysido == "경상도"){
        pubSido = await sequelize.query(
            `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%경상%' ORDER BY Pubnotices.panUploadDate DESC`
        )
    }else if(mysido == "전라도"){
        pubSido = await sequelize.query(
            `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%전라%' ORDER BY Pubnotices.panUploadDate DESC`
        )
    }else if(mysido == "제주도"){
        pubSido = await sequelize.query(
            `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%제주%' ORDER BY Pubnotices.panUploadDate DESC`
        )
    }else{
        pubSido = await sequelize.query(
            `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%${mysido}%' ORDER BY Pubnotices.panUploadDate DESC`
        )
    }
    
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
        
    // }) ds
    
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
    if (mysido == "충청도"){
        var privateSido = await sequelize.query(
            `SELECT privateapts.*,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.sido LIKE '%충%' ORDER BY privateapts.recruitDate DESC`
        )
    }else if(mysido == "경상도"){
        privateSido = await sequelize.query(
            `SELECT privateapts.*,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.sido LIKE '%경남%' or privateapts.sido LIKE '%경북%' ORDER BY privateapts.recruitDate DESC`
        )
    }else if(mysido == "전라도"){
        privateSido = await sequelize.query(
            `SELECT privateapts.*,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.sido LIKE '%전남%' or privateapts.sido LIKE '%전북%' ORDER BY privateapts.recruitDate DESC`
        )
    }else if(mysido == "강원도"){
        privateSido = await sequelize.query(
            `SELECT privateapts.*,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.sido LIKE '%강원%' ORDER BY privateapts.recruitDate DESC`
        )
    }else if(mysido == "제주도"){
        privateSido = await sequelize.query(
            `SELECT privateapts.*,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE  privateapts.sido LIKE '%제주%' ORDER BY privateapts.recruitDate DESC`
        )
    }else{
        privateSido = await sequelize.query(
            `SELECT privateapts.*,(SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.sido LIKE '%${mysido}%' ORDER BY privateapts.recruitDate DESC`
        )
    }
    
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
    getYouTube,getpublicHot,getprivateHot,getMyPublicSido,getMyPrivateSido,getTotal
}