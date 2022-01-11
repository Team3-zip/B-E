const Public = require('../models/PubNotice');
const { Op } = require('sequelize');
const { like, or } = Op
const { Sequelize, sequelize, PublicImg, PrivateImg } = require('../models')

//쿼리파라미터 없으면 전체리스트 
const getPublicNotice = async (req, res) => {
    let sidoName = req.query.sidoName;
    console.log(sidoName)
    if (sidoName === undefined) {
        sidoName = ''
    }
    const spell1 = sidoName.substring(0, 1);
    const spell2 = sidoName.substring(1, 2);
    console.log(spell1, spell2);
    try {
        var { userKey } = res.locals.user
    } catch {
        userKey = ''
    }
    try {
        // if (sidoName === undefined){
        //     pubNotice = await sequelize.query(`SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" ORDER BY Pubnotices.panUploadDate DESC`)

        // }
        if (spell2 === '상') {
            pubNotice = await sequelize.query(`SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%경상북도%' or Pubnotices.sidoName LIKE '%경상남도%' ORDER BY Pubnotices.panUploadDate DESC`)
        } else if (spell2 === '기') {
            pubNotice = await sequelize.query(`SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%경기%' ORDER BY Pubnotices.panUploadDate DESC`)
        } else {
            pubNotice = await sequelize.query(`SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.sidoName LIKE '%${spell1}${spell2}%' ORDER BY Pubnotices.panUploadDate DESC`)
        }
        // const pubNotice = await Public.findAll({
        //     order: [["panUploadDate", "ASC"]],
        //     where: {
        //         [or]: [
        //             {
        //                 sidoName: {
        //                     [like]: `%${spell1}%`
        //                 },
        //                 sidoName:{
        //                     [like]:`%${spell2}%`
        //                 }
        //             }
        //         ]
        //     },
        //     raw:true
        // });!!
        console.log(pubNotice);
        res.send({ result: pubNotice })
    } catch (error) {
        res.send({ result: error })
    }
}

// const getPublicNotice2 = async (req, res) => {
//     const { sidoName } = req.body;
//     console.log('here');
//     const pubNotice2 = await Public.findAll({
//         order: [["panUploadDate", "ASC"]],
//         where :{sidoName :{[like] :`%${sidoName}%`}}
//     })

//     res.send({ pubNotice2 })
// }

module.exports = {
    getPublicNotice,
    // getPublicNotice2
}