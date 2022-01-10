const Users = require('../models/User')
<<<<<<< HEAD

const Usermypage = async (req, res) => {
    const { userKey } = res.locals.user
    const exist
}

module.exports = {

}
=======
const Likes = require('../models/Like')
const Private = require('../models/PrivateApt')
const Public = require('../models/PubNotice')
const { sequelize } = require('../models')

const getMypage = async (req, res, next) => {
    try {
        const { userKey } = req.params
        // const { userKey } = req.params;
        //        // const { userKey, likeId, aptNo } = req.params;
        var publicList = []
        var privateList = []
        const existuser = await Users.findOne({ where: { userKey } })
        const existlike = await Likes.findAll({ where: { fk_userKey: userKey }, raw: true })
        console.log(existlike)
        console.log("for 시작")
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
        const pubList = await sequelize.query(
            `SELECT Pubnotices.*,(SELECT PublicImg.url1 FROM PublicImg WHERE Pubnotices.panId = PublicImg.panId) AS ImgUrl, CASE WHEN likes.panId IS NULL THEN "false" ELSE "true" END AS islike FROM Pubnotices LEFT JOIN likes ON Pubnotices.panId = likes.panId AND likes.fk_userKey="${userKey}" WHERE Pubnotices.panId IN (SELECT likes.panId FROM likes where likes.fk_userKey = ${userKey})`
        )
        const priList = await sequelize.query(
            `SELECT privateapts.*,
        (SELECT concat(min(cast(privateAptDetail2.supplyAreaSize as decimal(10,4))),'~',max(cast(privateAptDetail2.supplyAreaSize as decimal(10,4)))) as size FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as size,
        (SELECT concat(format(min(cast(replace(privateAptDetail2.supplyAmount,",",'') as unsigned)),0),'~', format(max(cast(replace(privateAptDetail2.supplyAmount,",",'')as unsigned)),0)) as supplyAmount FROM zip_dev.privateAptDetail2 where privateapts.pblancNo = privateAptDetail2.fk_pblancNo group by fk_pblancNo) as supplyAmount,
        (SELECT privateimgs.url1 FROM privateimgs WHERE privateapts.pblancNo = privateimgs.fk_pblancNo) AS ImgUrl, CASE WHEN likes.fk_pblancNo IS NULL THEN "false" ELSE "true" END AS islike FROM privateapts LEFT JOIN likes ON privateapts.pblancNo = likes.fk_pblancNo AND likes.fk_userKey="${userKey}" WHERE privateapts.pblancNo IN (SELECT likes.fk_pblancNo where likes.fk_userKey = ${userKey})`
        )
        console.log("testtest")
        //console.log(pubList[0])
        //console.log(priList[0])
        // res.send({existuser,privateList,publicList})
        res.send({ existuser, public: pubList[0], private: priList[0] })


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

module.exports = {
    getMypage,
    putMypage
}

// 마이페이지에서는 찜ㅇ해서 보여주는 거랑 내가 지정한 지역 변경하는거
// 바디에 대구를 했으면 대구를 라는 관심저역을 담겨져오면 유저키를 이용해서 시도를 업데이트 해주면됨

// 프라이빗 리스트랑 퍼블릭 유저랑 디테일
>>>>>>> main
