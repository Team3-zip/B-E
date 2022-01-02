const express = require('express');
const cron = require('node-schedule')
const request = require('request');
const convert = require('xml-js');
const PrivateApt = require('../models/PrivateApt');
const PrivateAptDetail1 = require('../models/PrivateAptDetail1');
const PrivateAptDetail2 = require('../models/PrivateAptDetail2');
const { sequelize } = require('../models/PubNotice');
const router = express.Router();
const PrivateImg = require('../models/PrivateImg')
const urlType = require('url');
const fs = require('fs');
const client = require('cheerio-httpcli');
const puppeteer = require('puppeteer');

// 살행하지 마세요!!!!!!!!!!
//목록 받기
const dailyPrivateData = () => {
    cron.scheduleJob('*/10 * * * * *', async function(){

        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let date = newDate.getDate();
        // 민영 리스트
        try {
            const SERVICE_KEY = 'Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D';
            for (let num = 1; num <= 10; num++) {
                const requestUrl = `https://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getLttotPblancList?serviceKey=${SERVICE_KEY}&startmonth=${year}${month}&endmonth=${year}${month}${date}&houseSecd=01&pageNo=${num}`;
                request(requestUrl, async (err, res, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let result = body;
                        let xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
                        let info = JSON.parse(xmlToJson).response.body.items.item;
                        for (i in info) {
                            console.log(info[i])
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
                console.log(requestUrl);

                console.log({ success: 'ok' })
            }
        } catch (error) {
            console.log(error)
        }
        // 민영 디테일 1
        try {
            const SERVICE_KEY_DETAIL1 = 'Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D';
            let arr = [];
            const keyword = await PrivateApt.findAll({
                attributes: ['houseManageNo', 'pblancNo'],
                include: [{
                    model: PrivateAptDetail1,
                    required: false,
                    attributes: [],

                }],
                where: sequelize.where(
                    sequelize.col('PrivateAptDetail1.fk_pblancNo'),
                    'IS',
                    null
                )
            });
            for (i in keyword) {
                let houseManageNo = keyword[i].houseManageNo;
                let pblancNo = keyword[i].pblancNo;
                arr.push({ houseManageNo, pblancNo })
            }
            // console.log(arr)
            let requestUrl_Details1;
            let urlArr = [];
            for (i in arr) {
                let { houseManageNo } = arr[i];
                let { pblancNo } = arr[i];
                requestUrl_Details1 = `http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getAPTLttotPblancDetail?houseManageNo=${houseManageNo}&pblancNo=${pblancNo}&serviceKey=${SERVICE_KEY_DETAIL1}`;
                urlArr.push({ requestUrl_Details1 })
            }
            for (let i = 0; i < urlArr.length; i++) {
                let { requestUrl_Details1 } = urlArr[i];
                request(requestUrl_Details1, async (err, re, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let result = body;
                        let xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
                        let info = JSON.parse(xmlToJson).response.body.items.item;
                        if (info.gnrlrnk1etcggrcptdepd) {
                            const contractStartDate = info.cntrctcnclsbgnde._text;
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
                                contractStartDate: contractStartDate,
                                contractEndDate: contractEndDate,
                                relevantArea1Date: relevantArea1Date,
                                etcArea1Date: etcArea1Date,
                                gyeonggi1Date: gyeonggi1Date,
                                relevantArea2Date: relevantArea2Date,
                                etcArea2Date: etcArea2Date,
                                gyeonggi2Date: gyeonggi2Date,
                                homePage: homePage,
                                houseManageNo: houseManageNo,
                                applyAddress: applyAddress,
                                plusSupplyStartDate: plusSupplyStartDate,
                                plusSupplyEndDate: plusSupplyEndDate,
                                supplySize: supplySize,
                                fk_pblancNo: fk_pblancNo
                            })
                        } else {
                            //console.log(info)
                            const contractStartDate = info.cntrctcnclsbgnde._text;
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
                                contractStartDate: contractStartDate,
                                contractEndDate: contractEndDate,
                                relevantArea1Date: relevantArea1Date,
                                etcArea1Date: etcArea1Date,
                                relevantArea2Date: relevantArea2Date,
                                etcArea2Date: etcArea2Date,
                                homePage: homePage,
                                houseManageNo: houseManageNo,
                                applyAddress: applyAddress,
                                plusSupplyStartDate: plusSupplyStartDate,
                                plusSupplyEndDate: plusSupplyEndDate,
                                supplySize: supplySize,
                                fk_pblancNo: fk_pblancNo
                            })
                        }
                    }
                })
            }
            console.log({ success: 'ok' })
        } catch (err) {
            console.log(err);
        }
        // 민영 디테일 2
        try {
            //const SERVICE_KEY_DETAIL2='Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D';
            let arr = [];
            const keyword = await PrivateApt.findAll({
                attributes: ['houseManageNo', 'pblancNo'],
                include: [{
                    model: PrivateAptDetail2,
                    required: false,
                    attributes: [],

                }],
                where: sequelize.where(
                    sequelize.col('PrivateAptDetail2.fk_pblancNo'),
                    'IS',
                    null
                )
            });
            console.log('here')
            console.log(keyword);
            for (i in keyword) {
                const { houseManageNo, pblancNo } = keyword[i]
                arr.push({ houseManageNo, pblancNo })
            }
            console.log(arr)
            let requestUrl_Details2;
            let url = [];
            for (i in arr) {
                let { houseManageNo } = arr[i];
                let { pblancNo } = arr[i];
                houseManageNo = String(houseManageNo);
                pblancNo = String(pblancNo);
                //console.log(typeof houseManageNo, pblancNo)
                //requestUrl_Details2=`http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getRemndrLttotPblancMdl?houseManageNo=2021930001&pblancNo=2021930001&serviceKey=Pifa2dNF%2F%2BDOgnjpswa7G%2B8t%2B1B28ekfKa%2FmZtTwwmLTZtbw05Xn8DeUw0BHRG2mEg4M1BCH1WfcQJdblk3TmQ%3D%3D`
                requestUrl_Details2 = `http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoSvc/getAPTLttotPblancMdl?houseManageNo=${houseManageNo}&pblancNo=${pblancNo}&serviceKey=V8XKM0aXiYL%2BsbW7DE%2F0uN2LNZAifUC01NBtlZfCbhAMa5I6pj6Mqp6G1kbbBX5lsu8WxLIqd5ssSTCPKiJTnQ%3D%3D`
                url.push({ requestUrl_Details2 })
            }
            for (let i = 0; i < url.length; i++) {
                let { requestUrl_Details2 } = url[i];
                //console.log(requestUrl_Details2)
                request(requestUrl_Details2, async (err, re, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let result = body;
                        let xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
                        let info2 = JSON.parse(xmlToJson).response.body.items.item;
                        for (i in info2) {
                            //console.log(info2[i])
                            await PrivateAptDetail2.create({
                                fk_pblancNo: Number(info2[i]['pblancno']['_text']),
                                houseManageNo: Number(info2[i]['housemanageno']['_text']),
                                modelNo: info2[i]['modelno']['_text'],
                                type: info2[i]['housety']['_text'],
                                geSupplySize: info2[i]['suplyhshldco']['_text'],
                                spSupplySize: info2[i]['spsplyhshldco']['_text'],
                                supplyAreaSize: info2[i]['suplyar']['_text'],
                                supplyAmount: info2[i]['lttottopamount']['_text']
                            })
                        }
                    }
                })
            }
            console.log('ok')
            console.log({ success: 'ok' })
        } catch (error) {
            console.log({ error })
        }
        try {
            const browser = await puppeteer.launch({ headless: false });
            const keyword = await PrivateApt.findAll({
                attributes: ['houseManageNo', 'pblancNo', 'houseName'],
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
            const houseName = keyword;
            console.log(keyword.length);
            for (i in keyword) {
                //console.log(houseName[i].houseName);
                const name = houseName[i].houseName;
                const no = houseName[i].pblancNo;
                const houseManageNo = houseName[i].houseManageNo;
                const page = await browser.newPage();
                await page.goto(`https://search.zum.com/search.zum?method=image&option=accu&query=${name}&rd=1&cm=tab&co=9`);
                // await page.click('')
                const issueSrcs = await page.evaluate(() => {
                    const srcs = Array.from(
                        document.querySelectorAll('div.gs-result.gs-imageResult.gs-imageResult-popup > div.gs-image-thumbnail-box > div > a > img')
                    ).map((image) => image.getAttribute('src'));
                    //console.log(srcs);
                    return srcs;
                });
    
                if (!issueSrcs) {
                    res.status(500).send();
                } else {
                    await PrivateImg.create({ houseManageNo: houseManageNo, fk_pblancNo: no, url1: issueSrcs[0], url2: issueSrcs[1], url3: issueSrcs[2], url4: issueSrcs[3], url5: issueSrcs[4] })
                    await page.waitFor(3000);
                }
            }
    
            await browser.close();
            console.log({ success: 'ookkk' });
            return;
        } catch (e) {
            console.error(e);
        }
    
        try {
            let urlArr = [];
            const url = await PrivateImg.findAll({
                attributes: ['id', 'url1', 'url2', 'url3', 'url4', 'url5', 'fk_pblancNo']
            });
            for (i in url) {
    
                urlArr.push({ id: url[i]['id'], url1: url[i]['url1'], url2: url[i]['url2'], url3: url[i]['url3'], url4: url[i]['url4'], url5: url[i]['url5'], fk_pblancNo: url[i]['fk_pblancNo'] });
                //console.log(urlArr)
            }
            for (let i = 0; i < urlArr.length; i++) {
                const directory = fs.existsSync(`./screenshot/image${urlArr[i].id}`);
                if (!directory) fs.mkdirSync(`./screenshot/image${urlArr[i].id}`);
                let path = [];
                let url = [];
                url.push(urlArr[i].url1, urlArr[i].url2, urlArr[i].url3, urlArr[i].url4, urlArr[i].url5);
                // console.log(urlArr[i].url1)
                for (let j = 0; j < url.length; j++) {
                    const CAPTURE_URL = url[j];
                    const file_name = `${urlArr[i].fk_pblancNo}-${Date.now()}.png`;
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.setViewport({ width: 230, height: 225, });
                    await page.goto(CAPTURE_URL + Buffer.from(JSON.stringify(req.body)).toString('base64'), { waitUntil: 'domcontentloaded' });
                    await page.waitFor(2000);
                    await page.screenshot({ fullPage: true, path: `./screenshot/image${urlArr[i].id}/${file_name}` });
                    path.push({ image_url: `./screenshot/${urlArr[i].id}/${file_name}` });
                    await browser.close();
                    console.log('여기')
                }
            }
        } catch (error) {
            console.log(error);
        }
    })
    // 민영 이미지 크롤링
    
}
module.exports = {
    dailyPrivateData
};