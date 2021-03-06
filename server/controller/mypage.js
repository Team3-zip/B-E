const Users = require('../models/User')
const Likes = require('../models/Like')
const Private = require('../models/PrivateApt')
const Public = require('../models/PubNotice')
const { sequelize, User } = require('../models')
const Joi = require('joi');

const updateUsersSchema = Joi.object({
    userKey: Joi.string().required(),
    email: Joi.string().email().required()
});
var sortJSON = function (data, key, type) {
    if (type == undefined) {
        type = "asc";
    }
    return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (type == "desc") {
            return x > y ? -1 : x < y ? 1 : 0;
        } else if (type == "asc") {
            return x < y ? -1 : x > y ? 1 : 0;
        }
    });
};
const getMypage = async (req, res, next) => {
    try {
        const { userKey } = req.params
        var publicList = []
        var privateList = []
        const existuser = await Users.findOne({ where: { userKey } })
        const existlike = await Likes.findAll({ where: { fk_userKey: userKey }, raw: true })
        console.log(existlike)
        console.log("for 시작")
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = ('0' + (newDate.getMonth() + 1)).slice(-2);
        let date = newDate.getDate();
        const sDate = year + '' + month + '' + date;
        let sta = '';
        let statusDate = '';
        let statusArr = [];
        let pblanArr = [];
        let tmpArr = [];
        console.log(sDate);
        for (let i = 0; i < existlike.length; i++) {
            console.log(existlike.length)
            if (existlike[i]['fk_pblancNo'] !== null) {
                console.log(existlike[i]['fk_pblancNo'])
                const privateOne = await Private.findOne({ where: { pblancNo: existlike[i]['fk_pblancNo'] }, raw: true })
                privateList.push(privateOne)
                // res.status(200).send({ existuser, existlike })
            } else if (existlike[i]['panId'] !== null) {
                console.log(existlike[i]['panId'])
                const publicOne = await Public.findOne({ where: { panId: existlike[i]['panId'] }, raw: true })
                publicList.push(publicOne)
                // res.status(200).send({ existuser, existlike })
            }
        }
        // console.log(`before sort : ${JSON.stringify(privateList)}`)
        privateList = sortJSON(privateList, "recruitDate", "desc")
        // console.log(`after sort : ${JSON.stringify(privateList)}`)
        const pubList = await sequelize.query(
            `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.panId IN (SELECT likes.panId FROM likes where likes.fk_userKey = ${userKey})`
        )
        const priList = await sequelize.query(
            `SELECT privateapts.*,
        (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
        (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
        (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.pblancNo IN (SELECT likes.fk_pblancNo where likes.fk_userKey = ${userKey}) ORDER BY privateapts.recruitDate DESC`
        )
        console.log("testtest")
        for (let i in privateList) {
            //console.log(privateList[i].pblancNo);
            pblanArr.push(privateList[i].pblancNo)
        }
        for (let i in pblanArr) {
            statusDate = await Private.findAll({
                order: [['recruitDate', 'DESC']], //
                attributes: ['recruitDate', 'receptStartDate', 'receptEndDate', 'pblancNo'],
                where: {
                    pblancNo: pblanArr[i],
                },
                raw: true
            });
            console.log(`statusDate :${JSON.stringify(statusDate)} end`)
            tmpArr.push(statusDate);
        }

        for (let i in tmpArr) {
            console.log(tmpArr[i][0])
            console.log(tmpArr[i][0]['receptStartDate'])
            const stDate = (tmpArr[i][0]['receptStartDate']).replace(/-/g, '');
            const enDate = (tmpArr[i][0]['receptEndDate']).replace(/-/g, '');
            console.log(`stDate :${stDate}`)
            console.log(`edDate : ${enDate}`)
            if (Number(tmpArr[i][0]['recruitDate']) === Number(stDate)) {
                sta = '공고중'
            }
            else if (Number(tmpArr[i][0]['recruitDate']) < Number(sDate) && Number(stDate) > Number(sDate)) {
                sta = '공고중'
            }
            else {
                sta = '접수마감'
            }
            if (Number(stDate) <= Number(sDate) && Number(enDate) >= Number(sDate)) {
                sta = '접수중'
            }
            statusArr.push({ 'status': sta, 'pblancNo': tmpArr[i][0]['pblancNo'] });
        }

        console.log(statusArr)
        res.send({ existuser, public: pubList[0], private: priList[0], statusArr })


    } catch (error) {
        console.log('-----------------------------')
        console.log('에러발생' + error)
        res.status(400).send({ error })
    }
}

const putMypage = async (req, res, next) => {
    try {
        const { userKey, sido } = req.body
        const { userName } = req.params
        console.log("test1")
        const existSido = await Users.findOne({ where: { userKey, nickname: userName } })
        if (existSido) {
            await Users.update({ sido }, { where: { userKey } }) // 특정 정보를 정해줘서 그 안에 있는 "sido"를 업데이트해줘라.
            res.status(200).send({
                message: '관심지역 수정이 완료되었습니다.'
            })
        }
    } catch (error) {
        console.log('-----------------------------')
        console.log('에러발생' + error)
        res.status(400).send({ errorMessge: '다시 시도해  주세요.' })
    }
}

const putEmail = async (req, res, next) => {
    try {

        const { userKey, email } = await updateUsersSchema.validateAsync(req.body);
        const { userName } = req.params;
        const existUser = await User.findOne({
            where: { userKey, nickname: userName },
            raw: true
        });
        console.log('here')
        console.log(existUser);
        if (existUser === null) {
            res.status(403).send({});
        } else {
            await Users.update({ email }, { where: { userKey } });
            res.status(204).send({});
        }
        console.log('이메일 변경완료!');
    } catch (error) {
        console.log('에러발생:' + error)
    }
}

module.exports = {
    getMypage,
    putMypage,
    putEmail
}

