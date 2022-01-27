const cron = require('node-schedule')
const request = require("request");
const express = require("express");
// const scheduler = require('node-schedule')
const PubNotice = require('../models/PubNotice')
const PubImg = require('../models/PublicImg')
const { nextTick } = require("process");
const { raw } = require('express');

require("dotenv").config(); // config 안에 .env 파일위치 직접 지정 하능
const PUB_API_SECRET_KEY = process.env.PUB_API_SECRET_KEY;
const case1 = ["060", "064", "390"]
const case2 = ["061", "062", "063", "064"]
const UATC_list = ['06', '39']


Date.prototype.fourmonthAgo_yyyymmdd = function () {
    var fourmonthAgo = new Date(new Date().setDate(new Date().getMonth() - 4));
    var yyyy = fourmonthAgo.getFullYear().toString();
    var mm = (fourmonthAgo.getMonth() + 1).toString();
    var dd = fourmonthAgo.getDate().toString();

    return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
}
Date.prototype.yesterDay_yyyymmdd = function () {
    var yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    var yyyy = yesterday.getFullYear().toString();
    var mm = (yesterday.getMonth() + 1).toString();
    var dd = yesterday.getDate().toString();

    return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
}
Date.prototype.announce_compare_yyyymmdd = function () {
    var announce_compare = new Date(new Date().setDate(new Date().getDate() - 7));

    var yyyy = announce_compare.getFullYear().toString();
    var mm = (announce_compare.getMonth() + 1).toString();
    var dd = announce_compare.getDate().toString();

    return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
}
Date.prototype.today_yyyymmdd = function () {
    var todayDate = new Date(new Date().setDate(new Date().getDate()));

    var yyyy = todayDate.getFullYear().toString();
    var mm = (todayDate.getMonth() + 1).toString();
    var dd = todayDate.getDate().toString();

    return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
}
const yesterday = new Date().yesterDay_yyyymmdd()
const announce = new Date().announce_compare_yyyymmdd()
const fourmonthago = new Date().fourmonthAgo_yyyymmdd()
const today = new Date().today_yyyymmdd()
//목록 받기
const dailyPublicData2 = () => {
    cron.scheduleJob('0 21 0 * * *',
        async function () {
            // 메일 자정에 작동
            const existAll = await PubNotice.findAll({ raw: true })
            // console.log(existAll)
            for (let item of existAll) {
                console.log(item['panId'])
                console.log(item['announceDate'])
                const thisPanId = item['panId']
                const thisAnnounceDate = item['announceDate']
                const thisStartDate = item['startDate']
                const thisCloseDate = item['closeDate']
                const thisPanDate = item['panDate']
                const thisPanState = item['panState']
                if (Number(thisAnnounceDate.replaceAll('.', '')) < Number(announce)) {
                    console.log(Number(thisAnnounceDate.replaceAll('.', '')))
                    console.log(Number(announce))
                    console.log("true")
                    await PubNotice.destroy({ where: { panId: thisPanId } })

                } else {
                    if (Number(thisPanDate) <= Number(today) && Number(today) < Number(thisStartDate.replaceAll('.',''))) {
                        if (thisPanState !== '공고중') {
                            await PubNotice.update({ panState: '공고중' }, { where: { panId: thisPanId } })
                        }
                    } else if (Number(thisStartDate.replaceAll('.','')) <= Number(today) && Number(today) <= Number(thisCloseDate.replaceAll('.',''))) {
                        if (thisPanState !== '접수중') {
                            await PubNotice.update({ panState: '접수중' }, { where: { panId: thisPanId } })
                        }
                    }else if(Number(today) > Number(thisCloseDate.replaceAll('.',''))){
                        if (thisPanState !== '접수마감'){
                            await PubNotice.update({ panState: '점수마감' }, { where: { panId: thisPanId } })
                        }
                    }
                }

            }
            
            console.log('ok')
        }
    )
}


module.exports = {
    dailyPublicData2
};