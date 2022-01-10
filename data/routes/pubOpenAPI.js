
const request = require("request");
const express = require("express");
// const scheduler = require('node-schedule')
const  PubNotice  = require('../models/PubNotice')
const PubImg = require('../models/PublicImg')
const { nextTick } = require("process");
const router = express.Router()

require("dotenv").config(); // config 안에 .env 파일위치 직접 지정 하능
const PUB_API_SECRET_KEY  = process.env.PUB_API_SECRET_KEY;
const case1 = ["060", "064", "390"]
const case2 = ["061", "062", "063", "064"]


router.get('/pubget1', async (req, res, next) => {
    
    const options = {
        method: "GET",
        url: `http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1?serviceKey=${PUB_API_SECRET_KEY}&PG_SZ=300&PAGE=1&PAN_ST_DT=20211117&UPP_AIS_TP_CD=06`,
        //UPP AIS_TP_CD 05분양주택 06임대주택 39신혼희망타운
        headers: {},
    };

    request(options, async function (err, response, body) {
        if (err) {
            console.log("위에서 에러")
            throw new Error("위에서 에러");
        }
        let info = JSON.parse(body)[1]["dsList"];
        console.log(info);
        let noticeList = { ...info }

        for (let i in noticeList) {
            console.log("===================")
            console.log("===================")
            console.log(noticeList[i])
            // if(noticeList2[i]['PAN_SS'] !== '접수마감'){
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

            // await PubNotice.create({
            //     panState:PAN_SS,
            //     panUploadDate:PAN_NT_ST_DT,
            //     aisTypeCode:AIS_TP_CD,
            //     suplyTypeCode:SPL_INF_TP_CD,
            //     sidoName:CNP_CD_NM,
            //     panId:PAN_ID,
            //     uppAisTypeName:UPP_AIS_TP_NM,
            //     aisTypeName:AIS_TP_CD_NM,
            //     closeDate:CLSG_DT,
            //     panDate:PAN_DT,
            //     uppAisTypeCode:UPP_AIS_TP_CD,
            //     panName:PAN_NM,
            //     allCount:ALL_CNT,
            //     detailUrl:DTL_URL,
            //     csCode:CCR_CNNT_SYS_DS_CD
            // })
            const options2 = {
                method: "GET",
                url: `http://apis.data.go.kr/B552555/lhLeaseNoticeDtlInfo1/getLeaseNoticeDtlInfo1?serviceKey=${PUB_API_SECRET_KEY}&SPL_INF_TP_CD=${SPL_INF_TP_CD}&CCR_CNNT_SYS_DS_CD=${CCR_CNNT_SYS_DS_CD}&PAN_ID=${PAN_ID}&UPP_AIS_TP_CD=${UPP_AIS_TP_CD}`,
                // headers: {'Accept': 'application/json'},
                headers: {},
            };
            request(options2, async function (err, response, body) {
                console.log(options2.url)
                console.log(body)
                try {
                    if (err) {
                        console.log(err)
                        console.log("에러가 나타낫다")
                        throw new Error("에러가 나타낫다")
                    }
                } catch (e) {
                    console.log(e)
                }
                try{
                let info_detail = JSON.parse(body)[1]
                const noticeDetail = { ...info_detail }
                console.log("노티스디텡르")
                console.log(noticeDetail)
                console.log(noticeDetail['dsSplScdl']) // 잘 나옴
                // const { dsSplScdl } = noticeDetail['dsSplScdl']
                const dsAhflInfo = noticeDetail['dsAhflInfo']
                const dsSbd = noticeDetail['dsSbd']
                const dsSplScdl = noticeDetail['dsSplScdl']
                const dsSbdAhfl = noticeDetail['dsSbdAhfl']
                try{
                    var Img_URL1 = dsSbdAhfl[0]['AHFL_URL']
                }catch{
                    Img_URL1 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                }
                try{
                    var Img_URL2 = dsSbdAhfl[1]['AHFL_URL']
                }catch{
                    Img_URL2 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                }
                try{
                    var Img_URL3 = dsSbdAhfl[2]['AHFL_URL']
                }catch{
                    Img_URL3 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                }
                if (case1.includes(SPL_INF_TP_CD) && CCR_CNNT_SYS_DS_CD === "02") {
                    // dsSplScdl = info_detail['dsSplScdl']
                    // dsAhflInfo = info_detail['dsAhflInfo']
                    // dsSbd = info_detail['dsSbd']
                    // console.log(info_detail)
                    // console.log(dsSplScdl + "!!!!!!!!!!!!!!!!")
                    // console.log(dsAhflInfo)
                    console.log(...noticeDetail['dsSplScdl'])

                    console.log(dsSplScdl[0]['ACP_DTTM'])
                    // const ACP_DTTM = dsSplScdl[0]['ACP_DTTM']
                    // const ANNOUNCEDATE = dsSplScdl[0]['PZWR_ANC_DT']
                    console.log("444444444444444444444444444444444444444444444444444")
                    const { ACP_DTTM,PZWR_ANC_DT,PZWR_PPR_SBM_ST_DT,PZWR_PPR_SBM_ED_DT,CTRT_ST_DT,CTRT_ED_DT } = { ...dsSplScdl[0] }
                    console.log(ACP_DTTM,PZWR_ANC_DT,PZWR_PPR_SBM_ST_DT,PZWR_PPR_SBM_ED_DT,CTRT_ST_DT,CTRT_ED_DT)
                    console.log(ACP_DTTM)
                    const { LCT_ARA_ADR, LCT_ARA_DTL_ADR, MIN_MAX_RSDN_DDO_AR, HTN_FMLA_DS_CD_NM, SUM_TOT_HSH_CNT, MVIN_XPC_YM } = { ...dsSbd[0] }
                    console.log(LCT_ARA_ADR)
                    const AHFL_URL = dsAhflInfo[1]['AHFL_URL']
                    
                    console.log(Img_URL1,Img_URL2,Img_URL3)
                    console.log('============case1============')
                    console.log(ACP_DTTM)
                    console.log(ACP_DTTM.slice(0, 10), ACP_DTTM.slice(19, 29))
                    console.log(AHFL_URL)
                    // await PubDetail.create({
                    //     panId: PAN_ID,
                    //     contractStartDate: ACP_DTTM.slice(0, 10),
                    //     contractEndDate: ACP_DTTM.slice(19, 29),
                    //     address: `${LCT_ARA_ADR} ${LCT_ARA_DTL_ADR}`,
                    //     size: MIN_MAX_RSDN_DDO_AR,
                    //     heatMethod: HTN_FMLA_DS_CD_NM,
                    //     houseCnt: SUM_TOT_HSH_CNT,
                    //     moveYM: MVIN_XPC_YM,
                    //     fileLink: AHFL_URL,
                    // })
                    await PubNotice.create({
                        panState:PAN_SS,
                        panUploadDate:PAN_NT_ST_DT,
                        aisTypeCode:AIS_TP_CD,
                        suplyTypeCode:SPL_INF_TP_CD,
                        sidoName:CNP_CD_NM,
                        panId:PAN_ID,
                        uppAisTypeName:UPP_AIS_TP_NM,
                        aisTypeName:AIS_TP_CD_NM,
                        startDate:ACP_DTTM.slice(0, 10),
                        closeDate:CLSG_DT,
                        announceDate:PZWR_ANC_DT,
                        submitStartDate:PZWR_PPR_SBM_ST_DT,
                        submitEndDate:PZWR_PPR_SBM_ED_DT,
                        contractStartDate:CTRT_ST_DT,
                        contractEndDate:CTRT_ED_DT,
                        houseCnt: SUM_TOT_HSH_CNT,
                        moveYM: MVIN_XPC_YM,
                        address: `${LCT_ARA_ADR} ${LCT_ARA_DTL_ADR}`,
                        heatMethod: HTN_FMLA_DS_CD_NM,
                        panDate:PAN_DT,
                        size: MIN_MAX_RSDN_DDO_AR,
                        uppAisTypeCode:UPP_AIS_TP_CD,
                        panName:PAN_NM,
                        allCount:ALL_CNT,
                        fileLink: AHFL_URL,
                        detailUrl:DTL_URL,
                        csCode:CCR_CNNT_SYS_DS_CD
                    })
                    await PubImg.create({
                        panId: PAN_ID,
                        url1: Img_URL1,
                        url2: Img_URL2,
                        url3: Img_URL3
                    })

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

                    const { PZWR_ANC_DT,PPR_ACP_ST_DT,PPR_ACP_CLSG_DT,CTRT_ST_DT,CTRT_ED_DT} = {...dsSplScdl[0]}
                    console.log(PZWR_ANC_DT,PPR_ACP_ST_DT,PPR_ACP_CLSG_DT,CTRT_ST_DT,CTRT_ED_DT)
                    console.log(Img_URL1,Img_URL2,Img_URL3)
                    console.log('============case2============')
                    console.log(SBSC_ACP_ST_DT, SBSC_ACP_CLSG_DT)
                    console.log(LGDN_ADR)
                    console.log(AHFL_URL)
                    // await PubDetail.create({
                    //     panId: PAN_ID,
                    //     contractStartDate: SBSC_ACP_ST_DT,
                    //     contractEndDate: SBSC_ACP_CLSG_DT,
                    //     address: `${LGDN_ADR} ${LGDN_DTL_ADR}`,
                    //     size: DDO_AR,
                    //     heatMethod: HTN_FMLA_DESC,
                    //     houseCnt: HSH_CNT,
                    //     moveYM: MVIN_XPC_YM,
                    //     fileLink: AHFL_URL,
                    // })
                    await PubNotice.create({
                        panState:PAN_SS,
                        panUploadDate:PAN_NT_ST_DT,
                        aisTypeCode:AIS_TP_CD,
                        suplyTypeCode:SPL_INF_TP_CD,
                        sidoName:CNP_CD_NM,
                        panId:PAN_ID,
                        uppAisTypeName:UPP_AIS_TP_NM,
                        aisTypeName:AIS_TP_CD_NM,
                        startDate: SBSC_ACP_ST_DT,
                        closeDate:CLSG_DT,
                        announceDate:PZWR_ANC_DT,
                        submitStartDate:PPR_ACP_ST_DT,
                        submitEndDate:PPR_ACP_CLSG_DT,
                        contractStartDate:CTRT_ST_DT,
                        contractEndDate:CTRT_ED_DT,
                        houseCnt: HSH_CNT,
                        moveYM: MVIN_XPC_YM,
                        address: `${LGDN_ADR} ${LGDN_DTL_ADR}`,
                        heatMethod: HTN_FMLA_DESC,
                        panDate:PAN_DT,
                        size: DDO_AR,
                        uppAisTypeCode:UPP_AIS_TP_CD,
                        panName:PAN_NM,
                        allCount:ALL_CNT,
                        fileLink: AHFL_URL,
                        detailUrl:DTL_URL,
                        csCode:CCR_CNNT_SYS_DS_CD
                    })
                    await PubImg.create({
                        panId: PAN_ID,
                        url1: Img_URL1,
                        url2: Img_URL2,
                        url3: Img_URL3
                    })
                }
            }catch{
                {}
            }
                // console.log(...info_detail)
            })
            
        }

        // }
    }
    );
    res.send('ok')
})
router.get('/pubget2', async (req, res, next) => {
    
    const options = {
        method: "GET",
        url: `http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1?serviceKey=${PUB_API_SECRET_KEY}&PG_SZ=300&PAGE=1&PAN_ST_DT=20211117&UPP_AIS_TP_CD=39`,
        //UPP AIS_TP_CD 05분양주택 06임대주택 39신혼희망타운
        headers: {},
    };

    request(options, async function (err, response, body) {
        if (err) {
            console.log("위에서 에러")
            throw new Error("위에서 에러");
        }
        let info = JSON.parse(body)[1]["dsList"];
        console.log(info);
        let noticeList = { ...info }

        for (let i in noticeList) {
            console.log("===================")
            console.log("===================")
            console.log(noticeList[i])
            // if(noticeList2[i]['PAN_SS'] !== '접수마감'){
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

            // await PubNotice.create({
            //     panState:PAN_SS,
            //     panUploadDate:PAN_NT_ST_DT,
            //     aisTypeCode:AIS_TP_CD,
            //     suplyTypeCode:SPL_INF_TP_CD,
            //     sidoName:CNP_CD_NM,
            //     panId:PAN_ID,
            //     uppAisTypeName:UPP_AIS_TP_NM,
            //     aisTypeName:AIS_TP_CD_NM,
            //     closeDate:CLSG_DT,
            //     panDate:PAN_DT,
            //     uppAisTypeCode:UPP_AIS_TP_CD,
            //     panName:PAN_NM,
            //     allCount:ALL_CNT,
            //     detailUrl:DTL_URL,
            //     csCode:CCR_CNNT_SYS_DS_CD
            // })
            const options2 = {
                method: "GET",
                url: `http://apis.data.go.kr/B552555/lhLeaseNoticeDtlInfo1/getLeaseNoticeDtlInfo1?serviceKey=${PUB_API_SECRET_KEY}&SPL_INF_TP_CD=${SPL_INF_TP_CD}&CCR_CNNT_SYS_DS_CD=${CCR_CNNT_SYS_DS_CD}&PAN_ID=${PAN_ID}&UPP_AIS_TP_CD=${UPP_AIS_TP_CD}`,
                // headers: {'Accept': 'application/json'},
                headers: {},
            };
            request(options2, async function (err, response, body) {
                try {
                    if (err) {
                        console.log(err)
                        console.log("에러가 나타낫다")
                        throw new Error("에러가 나타낫다")
                    }
                } catch (e) {
                    console.log(e)
                }
                let info_detail = JSON.parse(body)[1]
                const noticeDetail = { ...info_detail }
                console.log("노티스디텡르")
                console.log(noticeDetail)
                console.log(noticeDetail['dsSplScdl']) // 잘 나옴
                // const { dsSplScdl } = noticeDetail['dsSplScdl']
                const dsAhflInfo = noticeDetail['dsAhflInfo']
                const dsSbd = noticeDetail['dsSbd']
                const dsSplScdl = noticeDetail['dsSplScdl']
                const dsSbdAhfl = noticeDetail['dsSbdAhfl']
                try{
                    var Img_URL1 = dsSbdAhfl[0]['AHFL_URL']
                }catch{
                    Img_URL1 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                }
                try{
                    var Img_URL2 = dsSbdAhfl[1]['AHFL_URL']
                }catch{
                    Img_URL2 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                }
                try{
                    var Img_URL3 = dsSbdAhfl[2]['AHFL_URL']
                }catch{
                    Img_URL3 = "https://image.ajunews.com//content/image/2021/06/17/20210617221916152271.jpg"
                }
                if (case1.includes(SPL_INF_TP_CD) && CCR_CNNT_SYS_DS_CD === "02") {
                    // dsSplScdl = info_detail['dsSplScdl']
                    // dsAhflInfo = info_detail['dsAhflInfo']
                    // dsSbd = info_detail['dsSbd']
                    // console.log(info_detail)
                    // console.log(dsSplScdl + "!!!!!!!!!!!!!!!!")
                    // console.log(dsAhflInfo)
                    console.log(...noticeDetail['dsSplScdl'])

                    // console.log(dsSplScdl[0]['ACP_DTTM'])
                    // const ACP_DTTM = dsSplScdl[0]['ACP_DTTM']
                    console.log("444444444444444444444444444444444444444444444444444")
                    const { ACP_DTTM,PZWR_ANC_DT,PZWR_PPR_SBM_ST_DT,PZWR_PPR_SBM_ED_DT,CTRT_ST_DT,CTRT_ED_DT } = { ...dsSplScdl[0] }
                    console.log(ACP_DTTM,PZWR_ANC_DT,PZWR_PPR_SBM_ST_DT,PZWR_PPR_SBM_ED_DT,CTRT_ST_DT,CTRT_ED_DT)

                    console.log(ACP_DTTM)
                    const { LCT_ARA_ADR, LCT_ARA_DTL_ADR, MIN_MAX_RSDN_DDO_AR, HTN_FMLA_DS_CD_NM, SUM_TOT_HSH_CNT, MVIN_XPC_YM } = { ...dsSbd[0] }
                    console.log(LCT_ARA_ADR)
                    const AHFL_URL = dsAhflInfo[1]['AHFL_URL']
                    
                    console.log(Img_URL1,Img_URL2,Img_URL3)
                    console.log('============case1============')
                    console.log(ACP_DTTM)
                    console.log(ACP_DTTM.slice(0, 10), ACP_DTTM.slice(19, 29))
                    console.log(AHFL_URL)
                    // await PubDetail.create({
                    //     panId: PAN_ID,
                    //     contractStartDate: ACP_DTTM.slice(0, 10),
                    //     contractEndDate: ACP_DTTM.slice(19, 29),
                    //     address: `${LCT_ARA_ADR} ${LCT_ARA_DTL_ADR}`,
                    //     size: MIN_MAX_RSDN_DDO_AR,
                    //     heatMethod: HTN_FMLA_DS_CD_NM,
                    //     houseCnt: SUM_TOT_HSH_CNT,
                    //     moveYM: MVIN_XPC_YM,
                    //     fileLink: AHFL_URL,
                    // })
                    await PubNotice.create({
                        panState:PAN_SS,
                        panUploadDate:PAN_NT_ST_DT,
                        aisTypeCode:AIS_TP_CD,
                        suplyTypeCode:SPL_INF_TP_CD,
                        sidoName:CNP_CD_NM,
                        panId:PAN_ID,
                        uppAisTypeName:UPP_AIS_TP_NM,
                        aisTypeName:AIS_TP_CD_NM,
                        startDate:ACP_DTTM.slice(0, 10),
                        closeDate:CLSG_DT,
                        announceDate:PZWR_ANC_DT,
                        submitStartDate:PZWR_PPR_SBM_ST_DT,
                        submitEndDate:PZWR_PPR_SBM_ED_DT,
                        contractStartDate:CTRT_ST_DT,
                        contractEndDate:CTRT_ED_DT,
                        houseCnt: SUM_TOT_HSH_CNT,
                        moveYM: MVIN_XPC_YM,
                        address: `${LCT_ARA_ADR} ${LCT_ARA_DTL_ADR}`,
                        heatMethod: HTN_FMLA_DS_CD_NM,
                        panDate:PAN_DT,
                        size: MIN_MAX_RSDN_DDO_AR,
                        uppAisTypeCode:UPP_AIS_TP_CD,
                        panName:PAN_NM,
                        allCount:ALL_CNT,
                        fileLink: AHFL_URL,
                        detailUrl:DTL_URL,
                        csCode:CCR_CNNT_SYS_DS_CD
                    })
                    await PubImg.create({
                        panId: PAN_ID,
                        url1: Img_URL1,
                        url2: Img_URL2,
                        url3: Img_URL3
                    })

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
                    console.log("44444444444444444444444444444444")
                    const { PZWR_ANC_DT,PPR_ACP_ST_DT,PPR_ACP_CLSG_DT,CTRT_ST_DT,CTRT_ED_DT} = {...dsSplScdl[0]}
                    console.log(PZWR_ANC_DT,PPR_ACP_ST_DT,PPR_ACP_CLSG_DT,CTRT_ST_DT,CTRT_ED_DT)
                    console.log(Img_URL1,Img_URL2,Img_URL3)
                    console.log('============case2============')
                    console.log(SBSC_ACP_ST_DT, SBSC_ACP_CLSG_DT)
                    console.log(LGDN_ADR)
                    console.log(AHFL_URL)
                    // await PubDetail.create({
                    //     panId: PAN_ID,
                    //     contractStartDate: SBSC_ACP_ST_DT,
                    //     contractEndDate: SBSC_ACP_CLSG_DT,
                    //     address: `${LGDN_ADR} ${LGDN_DTL_ADR}`,
                    //     size: DDO_AR,
                    //     heatMethod: HTN_FMLA_DESC,
                    //     houseCnt: HSH_CNT,
                    //     moveYM: MVIN_XPC_YM,
                    //     fileLink: AHFL_URL,
                    // })
                    await PubNotice.create({
                        panState:PAN_SS,
                        panUploadDate:PAN_NT_ST_DT,
                        aisTypeCode:AIS_TP_CD,
                        suplyTypeCode:SPL_INF_TP_CD,
                        sidoName:CNP_CD_NM,
                        panId:PAN_ID,
                        uppAisTypeName:UPP_AIS_TP_NM,
                        aisTypeName:AIS_TP_CD_NM,
                        startDate: SBSC_ACP_ST_DT,
                        closeDate:CLSG_DT,
                        announceDate:PZWR_ANC_DT,
                        submitStartDate:PPR_ACP_ST_DT,
                        submitEndDate:PPR_ACP_CLSG_DT,
                        contractStartDate:CTRT_ST_DT,
                        contractEndDate:CTRT_ED_DT,
                        houseCnt: HSH_CNT,
                        moveYM: MVIN_XPC_YM,
                        address: `${LGDN_ADR} ${LGDN_DTL_ADR}`,
                        heatMethod: HTN_FMLA_DESC,
                        panDate:PAN_DT,
                        size: DDO_AR,
                        uppAisTypeCode:UPP_AIS_TP_CD,
                        panName:PAN_NM,
                        allCount:ALL_CNT,
                        fileLink: AHFL_URL,
                        detailUrl:DTL_URL,
                        csCode:CCR_CNNT_SYS_DS_CD
                    })
                    await PubImg.create({
                        panId: PAN_ID,
                        url1: Img_URL1,
                        url2: Img_URL2,
                        url3: Img_URL3
                    })
                }
                // console.log(...info_detail)
            })
            
        }

        // }
    }
    );
    res.send('ok')
})
module.exports = router
