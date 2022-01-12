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
const yesterday = new Date().yesterDay_yyyymmdd()
const announce = new Date().announce_compare_yyyymmdd()
const fourmonthago = new Date().fourmonthAgo_yyyymmdd()

//목록 받기
const dailyPublicData2 = () => {
    cron.scheduleJob('0 2 0 * * *',
        async function () {
            // 메일 자정에 작동
            const existAll = await PubNotice.findAll({ raw: true })
            // console.log(existAll)
            for (let item of existAll) {
                console.log(item['panId'])
                console.log(item['announceDate'])
                const thisPanId = item['panId']
                const thisAnnounceDate = item['announceDate']
                if (Number(thisAnnounceDate.replaceAll('.', '')) < Number(announce)) {
                    console.log(Number(thisAnnounceDate.replaceAll('.', '')))
                    console.log(Number(announce))
                    console.log("true")
                    await PubNotice.destroy({where:{panId:thisPanId}})
                    
                } else {
                    console.log("false")
                }

            }
            // const { announceDate } = existAll
            // console.log(announceDate)
            // console.log(announceDate.replaceAll('.', ''))
            // console.log(existPanId)

            for (let tc in UATC_list) {

                const options = {
                    method: "GET",
                    url: `http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1?serviceKey=${PUB_API_SECRET_KEY}&PG_SZ=300&PAGE=1&PAN_ST_DT=${fourmonthago}&PAN_ED_DT=${yesterday}&UPP_AIS_TP_CD=${UATC_list[tc]}`,
                    //UPP AIS_TP_CD 05분양주택 06임대주택 39신혼희망타운
                    headers: {},
                };

                request(options, async function (err, response, body) {
                    if (err) {
                        console.log("위에서 에러")
                        console.log(err)
                        throw new Error("위에서 에러");
                    }
                    let info = JSON.parse(body)[1]["dsList"];
                    console.log(info);
                    let noticeList = { ...info }

                    for (let i in noticeList) {
                        console.log("===================")
                        console.log("===================")
                        console.log(noticeList[i])
                        const { PAN_SS,
                            RNUM,
                            PAN_NT_ST_DT,
                            AIS_TP_CD,
                            SPL_INF_TP_CD,
                            CNP_CD_NM,
                            PAN_ID,
                            UPP_AIS_TP_NM,
                            AIS_TP_CD_NM,
                            CLSG_DT,
                            PAN_DT,
                            UPP_AIS_TP_CD,
                            PAN_NM,
                            ALL_CNT,
                            DTL_URL,
                            CCR_CNNT_SYS_DS_CD } = noticeList[i]
                        console.log(PAN_SS,
                            RNUM,
                            PAN_NT_ST_DT,
                            AIS_TP_CD,
                            SPL_INF_TP_CD,
                            CNP_CD_NM,
                            PAN_ID,
                            UPP_AIS_TP_NM,
                            AIS_TP_CD_NM,
                            CLSG_DT,
                            PAN_DT,
                            UPP_AIS_TP_CD,
                            PAN_NM,
                            ALL_CNT,
                            DTL_URL,
                            CCR_CNNT_SYS_DS_CD)
                        console.log("=================================request2===================================")


                        const options2 = {
                            method: "GET",
                            url: `http://apis.data.go.kr/B552555/lhLeaseNoticeDtlInfo1/getLeaseNoticeDtlInfo1?serviceKey=${PUB_API_SECRET_KEY}&SPL_INF_TP_CD=${SPL_INF_TP_CD}&CCR_CNNT_SYS_DS_CD=${CCR_CNNT_SYS_DS_CD}&PAN_ID=${PAN_ID}&UPP_AIS_TP_CD=${UPP_AIS_TP_CD}`,
                            // headers: {'Accept': 'application/json'},
                            headers: {},
                        };
                        request(options2, async function (err, response, body) {
                            // console.log(options2.url)
                            // console.log(body)
                            try {
                                if (err) {
                                    console.log(err)
                                    console.log("에러가 나타낫다")
                                    throw new Error("에러가 나타낫다")
                                }
                            } catch (e) {
                                console.log(e)
                            }
                            try {
                                let info_detail = JSON.parse(body)[1]
                                const noticeDetail = { ...info_detail }
                                // console.log("노티스디텡르")
                                // console.log(noticeDetail)
                                // console.log(noticeDetail['dsSplScdl']) // 잘 나옴
                                // const { dsSplScdl } = noticeDetail['dsSplScdl']
                                const dsAhflInfo = noticeDetail['dsAhflInfo']
                                const dsSbd = noticeDetail['dsSbd']
                                const dsSplScdl = noticeDetail['dsSplScdl']
                                const dsSbdAhfl = noticeDetail['dsSbdAhfl']
                                try {
                                    var Img_URL1 = dsSbdAhfl[0]['AHFL_URL']
                                } catch {
                                    Img_URL1 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                                }
                                try {
                                    var Img_URL2 = dsSbdAhfl[1]['AHFL_URL']
                                } catch {
                                    Img_URL2 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                                }
                                try {
                                    var Img_URL3 = dsSbdAhfl[2]['AHFL_URL']
                                } catch {
                                    Img_URL3 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                                }
                                if (case1.includes(SPL_INF_TP_CD) && CCR_CNNT_SYS_DS_CD === "02") {

                                    // console.log(...noticeDetail['dsSplScdl'])

                                    // console.log(dsSplScdl[0]['ACP_DTTM'])

                                    // console.log("444444444444444444444444444444444444444444444444444")
                                    const { ACP_DTTM, PZWR_ANC_DT, PZWR_PPR_SBM_ST_DT, PZWR_PPR_SBM_ED_DT, CTRT_ST_DT, CTRT_ED_DT } = { ...dsSplScdl[0] }
                                    // console.log(ACP_DTTM, PZWR_ANC_DT, PZWR_PPR_SBM_ST_DT, PZWR_PPR_SBM_ED_DT, CTRT_ST_DT, CTRT_ED_DT)
                                    // console.log(ACP_DTTM)
                                    const { LCT_ARA_ADR, LCT_ARA_DTL_ADR, MIN_MAX_RSDN_DDO_AR, HTN_FMLA_DS_CD_NM, SUM_TOT_HSH_CNT, MVIN_XPC_YM } = { ...dsSbd[0] }
                                    // console.log(LCT_ARA_ADR)
                                    const AHFL_URL = dsAhflInfo[1]['AHFL_URL']

                                    // console.log(Img_URL1, Img_URL2, Img_URL3)
                                    // console.log('============case1============')
                                    // console.log(ACP_DTTM)
                                    // console.log(ACP_DTTM.slice(0, 10), ACP_DTTM.slice(19, 29))
                                    // console.log(AHFL_URL)

                                    const existPanId = await PubNotice.findOne({ where: { panId: PAN_ID }, raw: true })
                                    const { announceDate } = existPanId
                                    console.log(announceDate)
                                    console.log(announceDate.replaceAll('.', ''))
                                    console.log(existPanId)
                                    if (existPanId !== null) {
                                        // if (Number(announceDate.replaceAll('.', '')) < Number(announce)) {
                                        //     console.log(Number(announceDate.replaceAll('.', '')))
                                        //     console.log(Number(announce))
                                        //     console.log("true")
                                        //     console.log(existPanId)
                                        //     console.log(announceDate.replaceAll('.',''))
                                        //     console.log(announce)
                                        //     await existPanId.destroy()
                                        // } 
                                        
                                        await PubNotice.update(
                                            {
                                                panState: PAN_SS,
                                                panUploadDate: PAN_NT_ST_DT,
                                                aisTypeCode: AIS_TP_CD,
                                                suplyTypeCode: SPL_INF_TP_CD,
                                                sidoName: CNP_CD_NM,
                                                panId: PAN_ID,
                                                uppAisTypeName: UPP_AIS_TP_NM,
                                                aisTypeName: AIS_TP_CD_NM,
                                                startDate: ACP_DTTM.slice(0, 10),
                                                closeDate: CLSG_DT,
                                                announceDate: PZWR_ANC_DT,
                                                submitStartDate: PZWR_PPR_SBM_ST_DT,
                                                submitEndDate: PZWR_PPR_SBM_ED_DT,
                                                contractStartDate: CTRT_ST_DT,
                                                contractEndDate: CTRT_ED_DT,
                                                houseCnt: SUM_TOT_HSH_CNT,
                                                moveYM: MVIN_XPC_YM,
                                                address: `${LCT_ARA_ADR} ${LCT_ARA_DTL_ADR}`,
                                                heatMethod: HTN_FMLA_DS_CD_NM,
                                                panDate: PAN_DT,
                                                size: MIN_MAX_RSDN_DDO_AR,
                                                uppAisTypeCode: UPP_AIS_TP_CD,
                                                panName: PAN_NM,
                                                allCount: ALL_CNT,
                                                fileLink: AHFL_URL,
                                                detailUrl: DTL_URL,
                                                csCode: CCR_CNNT_SYS_DS_CD
                                            },
                                            { where: { panId: PAN_ID } }
                                        )


                                    }


                                }
                                if (case2.includes(SPL_INF_TP_CD) && CCR_CNNT_SYS_DS_CD === "03") {
                                    // console.log(dsSplScdl)
                                    try {
                                        var SBSC_ACP_ST_DT = dsSplScdl[0]['SBSC_ACP_ST_DT']
                                    } catch {
                                        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                                        console.log(dsSplScdl)
                                        var SBSC_ACP_ST_DT = ""
                                    }
                                    try {
                                        var SBSC_ACP_CLSG_DT = dsSplScdl[0]['SBSC_ACP_CLSG_DT']
                                    } catch {
                                        var SBSC_ACP_CLSG_DT = ""
                                    }
                                    try {
                                        var { LGDN_ADR, LGDN_DTL_ADR, DDO_AR, HTN_FMLA_DESC, HSH_CNT, MVIN_XPC_YM } = { ...dsSbd[0] }
                                    } catch {
                                        var LGDN_ADR, LGDN_DTL_ADR, DDO_AR, HTN_FMLA_DESC, HSH_CNT, MVIN_XPC_YM = ""
                                    }
                                    try {
                                        var AHFL_URL = dsAhflInfo[1]['AHFL_URL']
                                    } catch {
                                        var AHFL_URL = ""
                                    }
                                    console.log("444444444444444444444444444444444444444444444444444")

                                    const { PZWR_ANC_DT, PPR_ACP_ST_DT, PPR_ACP_CLSG_DT, CTRT_ST_DT, CTRT_ED_DT } = { ...dsSplScdl[0] }
                                    console.log(PZWR_ANC_DT, PPR_ACP_ST_DT, PPR_ACP_CLSG_DT, CTRT_ST_DT, CTRT_ED_DT)
                                    console.log(Img_URL1, Img_URL2, Img_URL3)
                                    console.log('============case2============')
                                    console.log(SBSC_ACP_ST_DT, SBSC_ACP_CLSG_DT)
                                    console.log(LGDN_ADR)
                                    console.log(AHFL_URL)

                                    const existPanId = await PubNotice.findOne({ where: { panId: PAN_ID }, raw: true },)
                                    const { announceDate } = existPanId
                                    console.log(announceDate)
                                    console.log(announceDate.replaceAll('.', ''))
                                    console.log(existPanId)
                                    if (existPanId) {
                                        // if (Number(announceDate.replaceAll('.', '')) < Number(announce)) {
                                        //     console.log(Number(announceDate.replaceAll('.', '')))
                                        //     console.log(Number(announce))
                                        //     console.log("true")
                                        //     console.log(JSON.parse({ "sndflksjdfls;fijelskdfeoifjsdlkfjeifnsflak!!!!!": "Sfs" }))
                                        //     console.log(announceDate.replaceAll('.', ''))
                                        //     console.log(announce)
                                        //     await existPanId.destroy()
                                        // } 

                                        
                                        await PubNotice.update(
                                            {
                                                panState: PAN_SS,
                                                panUploadDate: PAN_NT_ST_DT,
                                                aisTypeCode: AIS_TP_CD,
                                                suplyTypeCode: SPL_INF_TP_CD,
                                                sidoName: CNP_CD_NM,
                                                panId: PAN_ID,
                                                uppAisTypeName: UPP_AIS_TP_NM,
                                                aisTypeName: AIS_TP_CD_NM,
                                                startDate: SBSC_ACP_ST_DT,
                                                closeDate: CLSG_DT,
                                                announceDate: PZWR_ANC_DT,
                                                submitStartDate: PPR_ACP_ST_DT,
                                                submitEndDate: PPR_ACP_CLSG_DT,
                                                contractStartDate: CTRT_ST_DT,
                                                contractEndDate: CTRT_ED_DT,
                                                houseCnt: HSH_CNT,
                                                moveYM: MVIN_XPC_YM,
                                                address: `${LGDN_ADR} ${LGDN_DTL_ADR}`,
                                                heatMethod: HTN_FMLA_DESC,
                                                panDate: PAN_DT,
                                                size: DDO_AR,
                                                uppAisTypeCode: UPP_AIS_TP_CD,
                                                panName: PAN_NM,
                                                allCount: ALL_CNT,
                                                fileLink: AHFL_URL,
                                                detailUrl: DTL_URL,
                                                csCode: CCR_CNNT_SYS_DS_CD
                                            },
                                            { where: { panId: PAN_ID } }
                                        )

                                    }

                                }
                            } catch {
                                { }
                            }
                        })

                    }

                    response.statusCode

                }

                );
            }
            console.log('ok')
        }
    )
}


module.exports = {
    dailyPublicData2
};