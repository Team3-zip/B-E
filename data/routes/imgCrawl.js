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



router.get('/', async (req, res) => {
    try {
      const browser = await puppeteer.launch({ headless: false });
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
      // const keyword = await PrivateApt.findAll({
      //     attributes:['houseName', 'pblancNo', 'houseManageNo'], 
      //     raw:true,
      //     //order: [['houseManageNo', 'DESC']], // 내림차순으로 정렬
      //   })
      const houseName= keyword;
      console.log(keyword.length);
      for(i in keyword){
          //console.log(houseName[i].houseName);
            const name = houseName[i].houseName;
            const no = houseName[i].pblancNo;
            const houseManageNo = houseName[i].houseManageNo;
            const page = await browser.newPage();
            await page.goto(`https://search.zum.com/search.zum?method=image&option=accu&query=${name}&rd=1&cm=tab&co=9`);
           // await page.click('')
            const issueSrcs = await page.evaluate(()=>{
            const srcs = Array.from(
              document.querySelectorAll('div.gs-result.gs-imageResult.gs-imageResult-popup > div.gs-image-thumbnail-box > div > a > img')
          ).map((image)=> image.getAttribute('src'));
          //console.log(srcs);
          return srcs;
      });
      
      if(!issueSrcs){
        res.status(500).send();
      }else{
        await PrivateImg.create({houseManageNo : houseManageNo,fk_pblancNo : no, url1: issueSrcs[0], url2:issueSrcs[1], url3:issueSrcs[2], url4:issueSrcs[3], url5:issueSrcs[4]})
        await page.waitFor(3000);
      }
      }
      
     await browser.close();
     res.send({success : 'ookkk'});
     return;
    } catch (e) {
      console.error(e);
    }
  });

  router.get('/capture', async (req, res, next) => {
      try{
        let urlArr = [];
        const url = await PrivateImg.findAll({
            attributes : ['id','url1', 'url2','url3', 'url4','url5','fk_pblancNo']
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
