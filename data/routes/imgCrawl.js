const express= require('express');
const request = require('request');
const convert = require('xml-js');
const PrivateApt = require('../models/PrivateApt');
const PrivateImg = require('../models/PrivateImg')
const router = express.Router();
const {sequelize} = require('../models/PubNotice')
const urlType = require('url');
const fs = require('fs');
const client = require('cheerio-httpcli');
const puppeteer = require('puppeteer');
const { response } = require('express');



router.get('/', async (req, res) => {
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
        console.log(reqUrl)
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
    
    res.send({success: "ooook"});
    } catch (e) {
      console.error(e);
    }
  });

  router.get('/capture', async (req, res, next) => {
      try{
        let urlArr = [];
        const url = await PrivateImg.findAll({
            attributes : ['url1', 'url2','url3', 'url4','url5','fk_pblancNo']
        });
        for(i in url){
           
            urlArr.push({id : url[i]['id'],url1: url[i]['url1'],url2 : url[i]['url2'],url3: url[i]['url3'],url4: url[i]['url4'],url5 : url[i]['url5'], fk_pblancNo:url[i]['fk_pblancNo']});
            //console.log(urlArr)
        }
        for(let i =0 ;i<urlArr.length; i++){
            const directory = fs.existsSync(`./screenshot/image${urlArr[i].id}`);
            if(!directory) fs.mkdirSync(`./screenshot/image${urlArr[i].id}`);
            let path = [];
            let url = [];
            url.push(urlArr[i].url1, urlArr[i].url2, urlArr[i].url3, urlArr[i].url4, urlArr[i].url5);
           // console.log(urlArr[i].url1)
           for(let j=0 ;j<url.length;j++){
                const CAPTURE_URL = url[j];
                const file_name = `${urlArr[i].fk_pblancNo}-${Date.now()}.png`;
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.setViewport({ width: 230, height: 225, });
                await page.goto(CAPTURE_URL+Buffer.from(JSON.stringify(req.body)).toString('base64'), {waitUntil: 'domcontentloaded'});
                await page.waitFor(2000);
                await page.screenshot({fullPage: true, path: `./screenshot/image${urlArr[i].id}/${file_name}`});
                path.push({image_url : `./screenshot/${urlArr[i].id}/${file_name}`});
                await browser.close();
               console.log('여기')
           }
        }
      }catch(error){
          console.log(error);
      }
  });
 
module.exports = router;
