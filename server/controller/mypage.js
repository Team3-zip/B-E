const Users = require('../models/User')
const Likes = require('../models/Like')

const getMypage = async (req, res, next) => {
    try {
        // const { userKey } = res.locals.user
        const { userKey } = req.body
        const { likeId } = req.body
        const existuser = await Users.findOne({ where: { userKey } })
        const existlike = await Likes.findOne({ where: { likeId } })

        res.status(200).send({ existuser, existlike })
    } catch (error) {
        console.log('-----------------------------')
        console.log('에러발생' + error)
        res.status(400).send({ error })
    }
}

const putMypage = async (req, res, next) => {
    try {
        // const { userKey } = res.locals.user
        const { userKey, sido } = req.body
        const { nickname } = req.params
        console.log("test1")
        const existSido = await Users.findOne({ where: { userKey, nickname: nickname } })
        if (existSido) {
            await Users.update({ sido }, { where: { userKey } }) // 특정 정보를 정해줘서 그 안에 있는 "sido"를 업데이트해줘라.
            res.status(200).send({
                message: '관심지역 수정이 완료되었습니다.'
            })
        }
    } catch (error) {
        console.log('-----------------------------')
        console.log('에러발생' + error)
        res.status(400).send({ errorMessge: '다시 시도해 주세요.' })
    }
}

module.exports = {
    getMypage,
    putMypage
}

// 마이페이지에서는 찜ㅇ해서 보여주는 거랑 내가 지정한 지역 변경하는거
// 바디에 대구를 했으면 대구를 라는 관심저역을 담겨져오면 유저키를 이용해서 시도를 업데이트 해주면됨