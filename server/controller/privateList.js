const Private = require('../models/PrivateApt')
const { Op } = require('sequelize');
const { like, or } = Op
const { Sequelize, sequelize, PublicImg, PrivateImg } = require('../models')

const getPrivateNotice = async (req, res) => {
    let sido = req.query.sido;
    if(sido === undefined){
        sido = ''
    }
    const spell1 = sido.substring(0, 1);
    const spell2 = sido.substring(1, 2);
    console.log(spell1);
    let priNotice = '';
    try {
        var { userKey } = res.locals.user
    } catch (error) {
        userKey = ''
    }
    try {
        if (spell2 === '상') {
            priNotice = await sequelize.query(`SELECT privateapts.*,(SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl , CASE WHEN likes.fk_pblancNo IS NULL THEN 'false' ELSE 'true' END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_pblancNo='${userKey}' WHERE privateapts.sido LIKE '%경북%' OR privateapts.sido Like '%경남%' ORDER BY privateapts.recruitDate DESC`)
            //  priNotice = await Private.findAll({
            //     order: [["recruitDate", "ASC"]],
            //     where :{
            //         [or]:[
            //             {sido : '경남'},
            //             {sido : '경북'}
            //         ]
            //     },
            //     raw:true
            //  })
        }else if(spell2 === '기'){
            priNotice = await sequelize.query(`SELECT privateapts.*,(SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl , CASE WHEN likes.fk_pblancNo IS NULL THEN 'false' ELSE 'true' END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_pblancNo='${userKey}' WHERE privateapts.sido LIKE '%경기%' ORDER BY privateapts.recruitDate DESC`)

        } 
        else {
            priNotice = await sequelize.query(`SELECT privateapts.*,(SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl , CASE WHEN likes.fk_pblancNo IS NULL THEN 'false' ELSE 'true' END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_pblancNo='${userKey}' WHERE privateapts.sido LIKE '%${spell1}%' ORDER BY privateapts.recruitDate DESC`)
            // priNotice = await Private.findAll({
            //     order: [["recruitDate", "ASC"]],
            //     where: {
            //         [or]: [
            //             {
            //                 sido: {
            //                     [like]: `%${spell1}%`
            //                 },
            //                 // sido:{
            //                 //     [like]:`%${spell2}%`
            //                 // }
            //             }
            //         ]
            //     },
            //     raw:true
            // })
        }
        console.log(priNotice)
        res.send({ result: priNotice })
    } catch (error) {
        res.send({ error })
    }
}

// const getPrivateNotice2 = async (req, res) => {
//     const { sido } = req.query
//     const priNotice2 = await Private.findAll({
//         order: [["recruitDate", "ASC"]],
//         where: sido ? { sido } : undefined
//     })


//     res.send({ priNotice2 })
// }

module.exports = {
    getPrivateNotice,
    // getPrivateNotice2
}