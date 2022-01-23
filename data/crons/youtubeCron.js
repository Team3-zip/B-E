const express = require('express');
const cron = require('node-schedule')
const request = require('request');
const Youtube = require('../models/Youtube');
const router = express.Router();

require("dotenv").config(); // config 안에 .env 파일위치 직접 지정 하능
const YouTube = require('youtube-node');
const youtube = new YouTube();

const  YOUTUBE_SECRET_KEY  = process.env.YOUTUBE_SECRET_KEY;


//목록 받기
const monthlyYoutubeData = () => {
    cron.scheduleJob('0 0 0 * * *', async function(){
        // 0 0 0 * * 1
    // 매주 월요일 스케쥴러 실생
    let word = '주택청약 가이드'; 
    let limit = 10; 

    youtube.setKey(YOUTUBE_SECRET_KEY);
    youtube.addParam('order', 'relevance'); 
    youtube.addParam('type', 'video'); 

    youtube.search(word, limit, async function (err, result) { 
        if (err) { console.log(err); return; } // 에러일 경우 에러공지하고 빠져나감

        console.log(JSON.stringify(result, null, 2)); // 받아온 전체 리스트 출력

        let items = result["items"];
        await Youtube.destroy({where:{}});        
        for (let i in items) {
            let item = items[i];
            let title = item["snippet"]["title"];
            let video_id = item["id"]["videoId"];
            let thumbnails = item['snippet']['thumbnails']['high']['url']
            let url = "https://www.youtube.com/watch?v=" + video_id;
            console.log(`제목 : ${title}`);
            console.log(`URL : ${url}`);
            console.log(`이미지 URL : ${thumbnails}`)
            console.log("-----------");
            await Youtube.create({
                title:title,
                link:url,
                thumbnail:thumbnails
            })
        }
    });
    console.log('ok')
    })
    
}
module.exports = {
    monthlyYoutubeData
};