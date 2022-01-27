const express = require('express');
const request = require('request');
const convert = require('xml-js');
const { PrivateAptDetail2 } = require('../../server/models');
const PrivateApt = require('../models/PrivateApt');
const PrivateAptDetail1 = require('../models/PrivateAptDetail1');
const { sequelize, findAll } = require('../models/PubNotice');
const router = express.Router();

//목록 받기
router.get('/', async (req, res, next) => {
    let newDate = new Date();
    let year = newDate.getFullYear();
    let month =('0'+(newDate.getMonth()+1)).slice(-2);
    let date = newDate.getDate();
    try {
        const SERVICE_KEY = 'Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D';
        for (let num = 1; num <= 10; num++) {
            const requestUrl = `https://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getLttotPblancList?serviceKey=${SERVICE_KEY}&startmonth=${year}${month}&endmonth=${year}${month}${date}&houseSecd=01&pageNo=${num}`;
            request(requestUrl, async (err, re, body) => {
                if (err) {
                    console.log('error:'+err);
                } else {
                    let result = body;
                    let xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
                    let info = JSON.parse(xmlToJson).response.body.items.item;
                    for (i in info) {
                        console.log('here')
                        await PrivateApt.create({
                            pblancNo: Number(info[i]['pblancNo']['_text']),
                            executor: info[i]['bsnsMbyNm']['_text'],
                            operation: info[i]['houseDtlSecdNm']['_text'],
                            houseManageNo: Number(info[i]['houseManageNo']['_text']),
                            houseName: info[i]['houseNm']['_text'],
                            winDate: info[i]['przwnerPresnatnDe']['_text'],
                            receptStartDate: info[i]['rceptBgnde']['_text'],
                            receptEndDate: info[i]['rceptEndde']['_text'],
                            recruitDate: info[i]['rcritPblancDe']['_text'],
                            rentSection: info[i]['rentSecdNm']['_text'],
                            sido: info[i]['sido']['_text']
                        })
                    }
                }
            })
        res.send({ success: 'ok' })
      }
   }catch (error) {
        console.log(error)
    }
});

//접수마감 +10일에 삭제되는 로직
router.get('/status', async(req, res,next)=>{
  try{
    let newDate = new Date();
    let year = newDate.getFullYear();
    let month =('0'+(newDate.getMonth()+1)).slice(-2);
    let date = newDate.getDate();
    const sDate = year+''+month+''+date;
    console.log(typeof sDate);
    const endDate =[];
    let deleteDate='';
    const contractEnd = await PrivateAptDetail1.findAll({
        attributes:['contractEndDate'],
        raw:true
    })
    for(let i in contractEnd){
        endDate.push(Number(contractEnd[i]['contractEndDate'].replace(/-/g, '')));
    }
    for(let i =0; i<endDate.length;i++){
        if(endDate[i]+7<=Number(sDate)){
            let a = String(endDate[i]).slice(0,4);
            let b = String(endDate[i]).slice(4,6);
            let c = String(endDate[i]).slice(6,8);
            let date = a+'-'+b+'-'+c;
            deleteDate = await PrivateAptDetail1.findAll({
                attributes:['fk_pblancNo'],
                where :{contractEndDate : date},
                raw :true
            })
        }
    }
    if(deleteDate.length){
    //     for(i in deleteDate){
    //     await PrivateApt.destroy({
    //         where : {'pblancNo': deleteDate['fk_pblancNo']}
    //     })
    // }
        res.send({success:'삭제완료!!!'})
    }else{
        res.send({success:'오늘은 지울게 없음!'})
    }
   
  }catch(err){
      console.log(err);
  }
   
});
module.exports = router;