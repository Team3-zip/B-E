const Users = require('../models/User')
const jwt = require('jsonwebtoken')
//const { where } = require('sequelize/dist')

const getUsers = async (req, res) => {
    const { userKey, nickname, profileImg } = req.body;

    const existUsers = await Users.findOne({
        attributes: ['userKey', 'nickname', 'profileImg'],
        where: { userKey },
        raw: true
    })
   
   
    if(existUsers === null){
        console.log("create")
        await Users.create({ userKey: userKey, nickname: nickname, profileImg: profileImg })
        res.status(200).send({ result: 'SUCCESS!' })
    }
    else if (nickname !== existUsers['nickname'] || profileImg !== existUsers['profileImg']) {
        console.log("if")
        await Users.update({ nickname: nickname, profileImg: profileImg }, { where: { userKey: userKey } })
        res.status(200).send({ result: 'SUCCESS!' })
    }
    res.send('ok')
}


module.exports = {
    getUsers
}

// user관련 변수에 존재한지 안한지에서 닉네임 값만 반환을 해서
// 닉네임 값이랑 다시 들어온 닉네임값이 맞는지 확인하고
// 변경한 닉네임을 확인 후 닉네임만 업데이트하기
// 닉네임만 찾고 싶으면 attributes를 사용