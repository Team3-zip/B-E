const Users = require('../models/User')
const Likes = require('../models/Like')
const { User } = require('../models')

const getMypage = async (req, res, next) => {
    try {
        const { userKey } = res.locals.user
        const { likeId } = req.body
        const existuser = await Users.findOne({ where: { userKey } })
        const existlike = await Likes.findOne({ where: { likeId } })

        res.status(200).send({ existuser, existlike })
    } catch (error) {
        res.status(400).send({ error })
    }
}

const putMypage = async (req, res, next) => {
    const { userKey } = res.locals.user
    const { sido } = req.params

    const existSido = await Users.findOne({ where: { userKey, sido } })

    if (existSido) {
        await Users.update({ sido })
        res.status(200).send({
            message: '관심지역 수정이 완료 되었습니다.'
        })
    } else {
        res.status(400).send({
            errorMessage: '다시 시도해 주세요.'
        })
    }
}

module.exports = {
    getMypage,
    putMypage
}

// 마이페이지에서는 찜ㅇ해서 보여주는 거랑 내가 지정한 지역 변경하는거
// 바디에 대구를 했으면 대구를 라는 관심저역을 담겨져오면 유저키를 이용해서 시도를 업데이트 해주면됨