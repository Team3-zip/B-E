const Public = require('../models/PubNotice');
const { Op } = require('sequelize');
const { like, or } = Op

//쿼리파라미터 없으면 전체리스트 
const getPublicNotice = async (req, res) => {
    const sidoName = req.query.sidoName;
    console.log(sidoName)
    const spell1 = sidoName.substring(0, 1);
    const spell2 = sidoName.substring(1, 2);
    console.log(spell1, spell2);
    try {
        const pubNotice = await Public.query('SELECT sidoName COUNT(*) FROM pubnotice WHERE sidoName = sidoName OR sidoName LIKE `${spel1}` OR sidoName LIKE `${spel2}` ORDER BY recruitDate (ASC)')
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
        // });
        //console.log(pubNotice);
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