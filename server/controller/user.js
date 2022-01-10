const Users = require('../models/User')
const jwt = require('jsonwebtoken')
//const { where } = require('sequelize/dist')

const getUsers = async (req, res) => {
    const { userKey, nickname } = req.body

    const existUsers = await Users.findAll({
        attributes: ['nickname'],
        where: { userKey },
        raw:true
    })

    if (existUsers.length) {
        res.status(400).send({
            errorMessage: '잘못된 경로입니다.'
        })
        return
    }
    // // 같은 유저인데 닉네임이 변경되어서 로그인 할 경우
    // if (nickname !== existUsers['nickname']) {
    //     await Users.update({ where: { nickname :nickname} })
    //     return
    // }
    await Users.create({ userKey, nickname })
    res.status(200).send({})
}

module.exports = {
    getUsers
}

// user관련 변수에 존재한지 안한지에서 닉네임 값만 반환을 해서
// 닉네임 값이랑 다시 들어온 닉네임값이 맞는지 확인하고
// 변경한 닉네임을 확인 후 닉네임만 업데이트하기
// 닉네임만 찾고 싶으면 attributes를 사용