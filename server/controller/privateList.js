const Private = require('../models/PrivateApt')
const { Op } = require('sequelize');
const { like, or } = Op


const getPrivateNotice = async (req, res) => {
    const sido = req.query.sido;
    const spell1 = sido.substring(0, 1);
    const spell2 = sido.substring(1, 2);
    console.log(spell1);
    let priNotice = '';
    try {
        if (spell2 === '상') {
            priNotice = await Private.query('SELECT sido, COUNT(*) FROM privateapt WHERE sido = sido OR sido = 경북 OR sido = 경남 ORDER BY recruitDate (ASC)')
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
        } else {
            priNotice = await Private.query('SELECT sido, COUNT(*) FROM privateapt WHERE sido = sido OR sido LIKE `${spel1}` OR sido Like `${spel2}` ORDER BY recruitDate (ASC)')
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
        // console.log(priNotice)
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