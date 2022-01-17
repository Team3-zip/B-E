const express = require('express');
const cron = require('node-schedule')
const nodemailer = require('nodemailer');
const { sequelize } = require('../models')
const User = require('../models/User')
require("dotenv").config(); // config 안에 .env 파일위치 직접 지정 하능
Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();

    return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
}
const today = new Date().yyyymmdd()
const mailPush = () => {
    cron.scheduleJob('0 0 7 * * *', async function () {
        // 0 0 0 * * 1
        const users = await User.findAll({
            attributes: ['userKey', 'nickname','email'],
            where: sequelize.where(
                sequelize.col('User.email'),
                'IS NOT',
                null
            ),raw:true
        });
        console.log(users)
        const emailarr = [ 'minsoohyeon1234@gmail.com']
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            }
        })

        for (let item of users) {
            const pubList = await sequelize.query(
                `SELECT Pubnotices.* from Pubnotices WHERE Pubnotices.panId IN (SELECT likes.panId FROM likes where likes.fk_userKey = ${item['userKey']})`
            )
            const priList = await sequelize.query(
                `SELECT privateapts.* from privateapts WHERE privateapts.pblancNo IN (SELECT likes.fk_pblancNo FROM likes where likes.fk_userKey = ${item['userKey']})`

            )
            
            var temp_pubList = {...pubList}
            var temp_priList = {...priList}
            // console.log(pubList)
            console.log(temp_pubList['0'])
            let pubhtml = ''
            let prihtml = ''
            temp_pubList['0'].map((one, index) => {

                if(Number(one.startDate.replaceAll('.','')) <= today && Number(one.closeDate.replaceAll('.','')) >= today){
                    console.log(Number(one.startDate.replaceAll('.','')))
                    pubhtml += `<li key=${index} name=${one.panName} date=${one.startDate}> <a href="https://www.dotzip.today/public/${one.panId}">${one.panName}</a></li>`

                }
            })
            temp_priList['0'].map((one, index) => {

                if(Number(one.receptStartDate.replaceAll('-','')) <= today && Number(one.receptEndDate.replaceAll('-','')) >= today){
                    console.log(Number(one.receptStartDate.replaceAll('-','')))
                    prihtml += `<li key=${index} name=${one.houseName} date=${one.receptStartDate}> <a href="https://www.dotzip.today/private/${one.pblancNo}">${one.houseName}</a></li>`

                }
            })
            console.log("pubhtml"+pubhtml)
            console.log(temp_pubList['0'].length)
            console.log(pubhtml.length)
            pubhtml.length !== 0? pubhtml = `<h3>공영 청약 목록.zip</h3>${pubhtml}` : {}
            prihtml.length !== 0? prihtml = `<h3>민영 청약 목록.zip</h3>${prihtml}` : {}

            // ejs.renderFile('../view/mail.html',
            //     {
            //         test: pubList
            //     }, {}, function (err, html) {
            //         temphtml = html
            //     })
            
            const mailOptions = {
                from: process.env.NODEMAILER_USER,    // 발송 메일 주소
                to: `${item['email']}`,     // 수신 메일 주소
                subject: `[${new Date().getMonth()+1}월${new Date().getDate()}일] ${item['nickname']}님이 찜하신 청약을 놓치지 마세요!`,   // 제목
                html: `<div><div>${pubhtml}</div><div>${prihtml}</div></div>`
                
                
            };

            if(pubhtml.length !== 0 || prihtml.length !== 0){
                transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error)
                } else {
                    console.log('send ok' + info.response)
                }
            })
        }
        }
        console.log()

    })

}
module.exports = {
    mailPush
};