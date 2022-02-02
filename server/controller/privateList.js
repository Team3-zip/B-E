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
    let priNotice = '';
    try {
        var { userKey } = res.locals.user
    } catch (error) {
        userKey = ''
    }
    let newDate = new Date();
    let year = newDate.getFullYear();
    let month =('0'+(newDate.getMonth()+1)).slice(-2);
    let date = ('0'+newDate.getDate()).slice(-2);
    const sDate = year+''+month+''+date;
    let sta='';
    let statusDate='';
    let statusArr =[];
    console.log(sDate);
    try{
        if(spell2 =='상'){
            statusDate = await Private.findAll({
                order: [['recruitDate', 'DESC']], //
                attributes :['recruitDate', 'receptStartDate','receptEndDate', 'pblancNo'],
                where :{
                    [or]:[
                        {
                            sido:{ [like]:'%경북%'},
    
                        },{
                            sido :{[like] :'%경남%'}
                        }
                    ]
                },
                  
                raw:true
            });
        }else if(spell2 === '기'){
            statusDate = await Private.findAll({
                order: [['recruitDate', 'DESC']], //
                attributes :['recruitDate', 'receptStartDate','receptEndDate', 'pblancNo'],
                where :{
                        sido:{ [like]:'%경기%'},
                    },
                raw:true
            });
        }else if(spell2 ==='구'){
            statusDate = await Private.findAll({
                order: [['recruitDate', 'DESC']], //
                attributes :['recruitDate', 'receptStartDate','receptEndDate', 'pblancNo'],
                where :{
                        sido:{ [like]:'%대구%'},
                    },
                raw:true
            });
        }else if(spell2 ==='전'){
            statusDate = await Private.findAll({
                order: [['recruitDate', 'DESC']], //
                attributes :['recruitDate', 'receptStartDate','receptEndDate', 'pblancNo'],
                where :{
                        sido:{ [like]:'%대전%'},
                    },
                raw:true
            });
        }else{
            statusDate = await Private.findAll({
                order: [['recruitDate', 'DESC']], //
                attributes :['recruitDate', 'receptStartDate','receptEndDate', 'pblancNo'],
                where :{
                        sido:{ [like]:`${spell1}%`},
                    },
                raw:true
            });
        }
    }catch(error){
        console.log('status 값 못 가져옴 ')
    }
    
    
    try {
        if (spell2 === '상') {
            priNotice = await sequelize.query(`SELECT privateapts.*,(SELECT privateAptDetail1.applyAddress FROM privateAptDetail1 WHERE privateapts.pblancNo = privateAptDetail1.fk_pblancNo) as address,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl , CASE WHEN likes.fk_pblancNo IS NULL THEN 'false' ELSE 'true' END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey='${userKey}' WHERE privateapts.sido LIKE '%경북%' OR privateapts.sido Like '%경남%' ORDER BY privateapts.recruitDate DESC`)
        
        }else if(spell2 === '기'){
            priNotice = await sequelize.query(`SELECT privateapts.*,(SELECT privateAptDetail1.applyAddress FROM privateAptDetail1 WHERE privateapts.pblancNo = privateAptDetail1.fk_pblancNo) as address,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl , CASE WHEN likes.fk_pblancNo IS NULL THEN 'false' ELSE 'true' END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey='${userKey}' WHERE privateapts.sido LIKE '%경기%' ORDER BY privateapts.recruitDate DESC`)

        }else if(spell2 ==='구'){
            priNotice = await sequelize.query(`SELECT privateapts.*,(SELECT privateAptDetail1.applyAddress FROM privateAptDetail1 WHERE privateapts.pblancNo = privateAptDetail1.fk_pblancNo) as address,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl , CASE WHEN likes.fk_pblancNo IS NULL THEN 'false' ELSE 'true' END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey='${userKey}' WHERE privateapts.sido LIKE '%대구%' ORDER BY privateapts.recruitDate DESC`)

        }else if(spell2 ==='전'){
            priNotice = await sequelize.query(`SELECT privateapts.*,(SELECT privateAptDetail1.applyAddress FROM privateAptDetail1 WHERE privateapts.pblancNo = privateAptDetail1.fk_pblancNo) as address,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl , CASE WHEN likes.fk_pblancNo IS NULL THEN 'false' ELSE 'true' END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey='${userKey}' WHERE privateapts.sido LIKE '%대전%' ORDER BY privateapts.recruitDate DESC`)
        }
        else {
            priNotice = await sequelize.query(`SELECT privateapts.*,(SELECT privateAptDetail1.applyAddress FROM privateAptDetail1 WHERE privateapts.pblancNo = privateAptDetail1.fk_pblancNo) as address,
            (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
            (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
            (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl , CASE WHEN likes.fk_pblancNo IS NULL THEN 'false' ELSE 'true' END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey='${userKey}' WHERE privateapts.sido LIKE '${spell1}%' ORDER BY privateapts.recruitDate DESC`)
        }
        for(let i in statusDate){
            const stDate=(statusDate[i]['receptStartDate']).replace(/-/g, '');
            const enDate=(statusDate[i]['receptEndDate']).replace(/-/g, '');
            if(Number(statusDate[i]['recruitDate'])===Number(stDate)){
                sta = '공고중'
            }
            else if(Number(statusDate[i]['recruitDate'])< Number(sDate)&& Number(stDate)>  Number(sDate)){
                sta ='공고중'
            }
            else if(Number(stDate) <=Number(sDate) && Number(enDate)>=Number(sDate)){
                sta ='접수중'
            }
            else{
                sta ='접수마감'
            }
            statusArr.push({'status':sta, 'pblancNo': statusDate[i]['pblancNo']});
        }
        
        console.log(statusArr)
        const privateApt= priNotice[0]
        res.status(200).send({ result: privateApt , statusArr : statusArr})
    } catch (error) {
        res.send({ error })
    }
}


module.exports = {
    getPrivateNotice
}