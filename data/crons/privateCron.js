const cron = require('node-schedule')
const request = require('request');
const convert = require('xml-js');
const PrivateApt = require('../models/PrivateApt');
const PrivateAptDetail1 = require('../models/PrivateAptDetail1');
const PrivateAptDetail2 = require('../models/PrivateAptDetail2');
const { sequelize } = require('../models/PubNotice');
const PrivateImg = require('../models/PrivateImg')
const urlType = require('url');
const fs = require('fs');
const client = require('cheerio-httpcli');
const puppeteer = require('puppeteer');

// 살행하지 마세요!!!!!!!!!!
//목록 받기
const dailyPrivateData = () => {
    cron.scheduleJob('0 5 * * * *', async function () {
         //계약만료일 기준 +10일에 데이터 삭제
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
                if(endDate[i]+10<=Number(sDate)){
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
                for(i in deleteDate){
                await PrivateApt.destroy({
                    where : {'pblancNo': deleteDate['fk_pblancNo']}
                })
            }
                console.log('삭제완료!!')    
           
            }else{
                console.log('오늘은 지울게 없음!!')
            }
        
          }catch(err){
              console.log(err);
          }
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let date = newDate.getDate();
        Date.prototype.yyyymmdd = function () {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth() + 1).toString();
            var dd = this.getDate().toString();

            return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
        }
        Date.prototype.yyyymm = function () {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth() + 1).toString();

            return yyyy + (mm[1] ? mm : '0' + mm[0]);
        }
        try {
            const SERVICE_KEY = 'V8XKM0aXiYL%2BsbW7DE%2F0uN2LNZAifUC01NBtlZfCbhAMa5I6pj6Mqp6G1kbbBX5lsu8WxLIqd5ssSTCPKiJTnQ%3D%3D';
            for (let num = 1; num <= 10; num++) {
                const requestUrl = `https://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getLttotPblancList?startmonth=${new Date().yyyymm()}&endmonth=${new Date().yyyymmdd()}&houseSecd=01&rentSecd=0&serviceKey=${KEY}&pageNo=${num}`;
                request(requestUrl, async (err, re, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let result = body;
                        let xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
                        try{
                            let info = JSON.parse(xmlToJson).response.body.items.item;
                        for (i in info) {
                            console.log(info[i])
                            const existPblancNo = await PrivateApt.findOne({where :{pblancNo : Number(info[i]['pblancNo']['_text'])},raw:true})
                            if (existPblancNo === null){
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
                                console.log("await 탈출")
                            }else{
                                console.log("existPblancNo is not null")
                            }
                            
                        }
                    }catch(error){
                        console.log("민영 api 에러")
                        console.log(error)
                    }
                        console.log("for 탈출")
                    }
                    console.log("else 탈출")
                })
                console.log("request 탈출")
                // console.log(requestUrl);

                // return({ success: 'ok' })
                
            }
        } catch (error) {
            console.log(error)
        }
       
        });
    }

module.exports = {
    dailyPrivateData
};