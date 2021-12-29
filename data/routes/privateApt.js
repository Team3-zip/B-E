const express= require('express');
const request = require('request');
const convert = require('xml-js');
const PrivateAptDetail1 = require('../models/PrivateAptDetail1');
const PrivateAptDetail2 = require('../models/PrivateAptDetail2');
const PrivateApt = require('../models/PrivateApt');
const router = express.Router();

//목록 받기
router.get('/', async(req, res, next) =>{
try{
    const SERVICE_KEY = 'Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D';

    for (let num = 1; num <= 5; num++) {
        const requestUrl = `https://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getLttotPblancList?serviceKey=${SERVICE_KEY}&startmonth=202112&endmonth=20211228&houseSecd=01&pageNo=${num}`;
        request(requestUrl, async (err, re, body) => {
            if (err) {
                console.log(err);
            } else {
                
                    let result = body;
                    let xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
                    let info = JSON.parse(xmlToJson).response.body.items.item;
                    for (i in info) {
                        console.log(info[i])
                           await PrivateApt.create({
                            pblancNo : Number(info[i]['pblancNo']['_text']),
                            executor : info[i]['bsnsMbyNm']['_text'],
                            operation : info[i]['houseDtlSecdNm']['_text'],
                            houseManageNo :Number(info[i]['houseManageNo']['_text']),
                            houseName: info[i]['houseNm']['_text'],
                            winDate : info[i]['przwnerPresnatnDe']['_text'],
                            receptStartDate : info[i]['rceptBgnde']['_text'],
                            receptEndDate : info[i]['rceptEndde']['_text'],
                            recruitDate : info[i]['rcritPblancDe']['_text'],
                            rentSection : info[i]['rentSecdNm']['_text'],
                            sido : info[i]['sido']['_text']
                        }) 
                    }
                }
        })
    }
    res.send({success :'ok'})
}catch(error){
    console.log(error)
}
});
            

//상세정보1 
router.get('/detail1', async(req, res, next) =>{
    try{
    const SERVICE_KEY_DETAIL1 = 'Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D';
    let arr = [];
    
    const keyword = await PrivateApt.findAll({attributes:['houseManageNo', 'pblancNo'], raw:true});
    for(i in keyword){
        let houseManageNo = keyword[i].houseManageNo;
        let pblancNo = keyword[i].pblancNo;
        arr.push({houseManageNo,pblancNo})
    }
   // console.log(arr)
   let  requestUrl_Details1;
   let urlArr = [];
    for (i in arr){
        let {houseManageNo}= arr[i];
        let {pblancNo} = arr[i];
        requestUrl_Details1= `http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getAPTLttotPblancDetail?houseManageNo=${houseManageNo}&pblancNo=${pblancNo}&serviceKey=${SERVICE_KEY_DETAIL1}`;
        urlArr.push({requestUrl_Details1})
    }
    for(let i=0;i<urlArr.length;i++){
        let {requestUrl_Details1}= urlArr[i] ;
        request(requestUrl_Details1, async(err, re, body)=>{
            if(err){
                console.log(err);
            }else{
                let result = body;
                let xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
                let info=JSON.parse(xmlToJson).response.body.items.item;
                    
                if(info.gnrlrnk1etcggrcptdepd){
                    const contractStartDate=info.cntrctcnclsbgnde._text;
                    const contractEndDate = info.cntrctcnclsendde._text;
                    const relevantArea1Date = info.gnrlrnk1crsparearceptpd._text;
                    const etcArea1Date = info.gnrlrnk1etcarearcptdepd._text;
                    const gyeonggi1Date = info.gnrlrnk1etcggrcptdepd._text;
                    const relevantArea2Date = info.gnrlrnk2crsparearceptpd._text;
                    const etcArea2Date = info.gnrlrnk2etcarearcptdepd._text;
                    const gyeonggi2Date = info.gnrlrnk2etcggrcptdepd._text;
                    const homePage = info.hmpgadres._text;
                    const houseManageNo = Number(info.housemanageno._text);
                    const applyAddress = info.hssplyadres._text;
                    const plusSupplyStartDate = info.spsplyrceptbgnde._text;
                    const plusSupplyEndDate = info.spsplyrceptendde._text;
                    const supplySize = info.totsuplyhshldco._text;
                    const fk_pblancNo = Number(info.pblancno._text);
                    // console.log(gyeonggi1Date,gyeonggi2Date,applyAddress, 'dddd')
                    await PrivateAptDetail1.create({
                        contractStartDate : contractStartDate,
                        contractEndDate: contractEndDate,
                        relevantArea1Date : relevantArea1Date,
                        etcArea1Date: etcArea1Date,
                        gyeonggi1Date : gyeonggi1Date,
                        relevantArea2Date:relevantArea2Date,
                        etcArea2Date:etcArea2Date,
                        gyeonggi2Date:gyeonggi2Date,
                        homePage: homePage,
                        houseManageNo:houseManageNo,
                        applyAddress:applyAddress,
                        plusSupplyStartDate:plusSupplyStartDate,
                        plusSupplyEndDate:plusSupplyEndDate,
                        supplySize:supplySize,
                        fk_pblancNo:fk_pblancNo

                    })
                }else{
                //console.log(info)
                const contractStartDate=info.cntrctcnclsbgnde._text;
                const contractEndDate = info.cntrctcnclsendde._text;
                const relevantArea1Date = info.gnrlrnk1crsparearceptpd._text;
                const etcArea1Date = info.gnrlrnk1etcarearcptdepd._text;
                const relevantArea2Date = info.gnrlrnk2crsparearceptpd._text;
                const etcArea2Date = info.gnrlrnk2etcarearcptdepd._text;
                const homePage = info.hmpgadres._text;
                const houseManageNo = Number(info.housemanageno._text);
                const applyAddress = info.hssplyadres._text;
                const plusSupplyStartDate = info.spsplyrceptbgnde._text;
                const plusSupplyEndDate = info.spsplyrceptendde._text;
                const supplySize = info.totsuplyhshldco._text;
                const fk_pblancNo = Number(info.pblancno._text);
                await PrivateAptDetail1.create({
                    contractStartDate : contractStartDate,
                        contractEndDate: contractEndDate,
                        relevantArea1Date : relevantArea1Date,
                        etcArea1Date: etcArea1Date,
                        relevantArea2Date:relevantArea2Date,
                        etcArea2Date:etcArea2Date,
                        homePage: homePage,
                        houseManageNo:houseManageNo,
                        applyAddress:applyAddress,
                        plusSupplyStartDate:plusSupplyStartDate,
                        plusSupplyEndDate:plusSupplyEndDate,
                        supplySize:supplySize,
                        fk_pblancNo:fk_pblancNo
                })
              
                }
            }
        })
    }
    }catch(err){
        console.log(err);
    }
    
});

//상세정보 2
router.get('/detail2', async(req, res)=>{
    try{
        //const SERVICE_KEY_DETAIL2='Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D';
        let arr = [];
        
        const keyword = await PrivateApt.findAll({attributes:['houseManageNo', 'pblancNo'], raw:true});
        for(i in keyword){
            let houseManageNo = keyword[i].houseManageNo;
            let pblancNo = keyword[i].pblancNo;
            arr.push({houseManageNo,pblancNo})
        }
        let  requestUrl_Details2;
        let url = [];
         for (i in arr){
             let {houseManageNo}= arr[i];
             let {pblancNo} = arr[i];
             houseManageNo = String(houseManageNo);
             pblancNo = String(pblancNo);
             //console.log(typeof houseManageNo, pblancNo)
             //requestUrl_Details2=`http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getRemndrLttotPblancMdl?houseManageNo=2021930001&pblancNo=2021930001&serviceKey=Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D`
             requestUrl_Details2=`http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getAPTLttotPblancMdl?houseManageNo=${houseManageNo}&pblancNo=${pblancNo}&serviceKey=V8XKM0aXiYL%2BsbW7DE%2F0uN2LNZAifUC01NBtlZfCbhAMa5I6pj6Mqp6G1kbbBX5lsu8WxLIqd5ssSTCPKiJTnQ%3D%3D`
             url.push({requestUrl_Details2})
         }
         for(let i=0;i<url.length;i++){
            let {requestUrl_Details2}= url[i] ;
            //console.log(requestUrl_Details2)
            request(requestUrl_Details2, async(err, re, body)=>{
                if(err){
                    console.log(err);
                }else{
                    let result = body;
                    let xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
                    let info2=JSON.parse(xmlToJson).response.body.items.item;
                    
                    for(i in info2){
                        //console.log(info2[i])
                        await PrivateAptDetail2.create({
                            fk_pblancNo : Number(info2[i]['pblancno']['_text']),
                            houseManageNo: Number(info2[i]['housemanageno']['_text']),
                            modelNo : info2[i]['modelno']['_text'],
                            type : info2[i]['housety']['_text'],
                            supplyAreaSize : info2[i]['suplyar']['_text'],
                            supplyAmount : info2[i]['lttottopamount']['_text']
                        })
                    }
                }
            })
        }        
        console.log('ok')
    }catch(error){
        res.send({error})
    }
});

module.exports = router;