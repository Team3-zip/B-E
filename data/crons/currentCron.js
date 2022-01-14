const express = require('express');
const cron = require('node-schedule')

require("dotenv").config(); // config 안에 .env 파일위치 직접 지정 하능


//목록 받기
const currentTime = () => {
    cron.scheduleJob('*/10 * * * * *', async function(){
        // 0 0 0 * * 1
    // 매주 월요일 스케쥴러 실생
    
    
        
    console.log()
    
})
    
}
module.exports = {
    currentTime
};