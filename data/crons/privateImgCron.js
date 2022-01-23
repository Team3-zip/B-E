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
const dailyPrivateDataImg = () => {
    cron.scheduleJob('0 15 * * * *', async function () {
        let imglinkArr =[];
    let nameArr=[];
    let pblancNoArr =[];
    let houseMgNoArr=[];
    try {
      const keyword = await PrivateApt.findAll({
        attributes: ['houseManageNo', 'pblancNo','houseName'],
        include: [{
            model: PrivateImg,
            required: false,
            attributes: [],
            
        }],
        where: sequelize.where(
            sequelize.col('PrivateImg.fk_pblancNo'),
            'IS',
            null
        )
    });
      const houseName= keyword;
      console.log(keyword.length);
      for(i in keyword){
          //console.log(houseName[i].houseName);
          const name = houseName[i].houseName.replace(/(\s*)/g, "");
          const no = houseName[i].pblancNo;
          const houseManageNo = houseName[i].houseManageNo;
          nameArr.push(name);
          pblancNoArr.push(no);
          houseMgNoArr.push(houseManageNo);
      }
     // console.log(nameArr)
    
      for(let i =0 ;i<nameArr.length;i++){
        let googleKey ='AIzaSyA1HlXx0GEPMbgDIwZUAWBADYYuiLAib6Y';
        let reqUrl1 = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD55QHJp9dOWHJ1j83H3mtn90KNtc41IXQ&cx=14a1ce6efcaf391ea&q=${encodeURI(nameArr[i])}&imgSize=XLARGE&searchType=image&num=10`
        console.log(reqUrl1)
        request(reqUrl1, async (err, response, body)=>{
          if(err){
            console.log(nameArr[i])
            console.log('에러 request :'+err)
          }else{
          let info = JSON.parse(body)['items'];
          imglinkArr=[];
          for(let i =0; i<info.length;i++){
            imglinkArr.push(info[i].link);
          }
          await PrivateImg.create({houseManageNo : houseMgNoArr[i],fk_pblancNo : pblancNoArr[i], url1: imglinkArr[0], url2:imglinkArr[1], url3:imglinkArr[2], url4:imglinkArr[3], url5:imglinkArr[4]})
          console.log(imglinkArr)
        }
      })
    }
    console.log('okkk');
    } catch (e) {
      console.error(e);
    }

    })
}
module.exports = {
    dailyPrivateDataImg
};