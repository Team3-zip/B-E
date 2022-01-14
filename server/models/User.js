const { Sequelize } = require('sequelize');
const db = require('.');
//user만 sequelize에서 생성해주는 id값 사용
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                nickname: {
                    type: Sequelize.STRING(15),
                    allowNull: true,
                },
                userKey: {
                    type: Sequelize.STRING(30),
                    allowNull: true,
                    primaryKey: true
                },
                sido: {
                    type: Sequelize.STRING(15),
                    defaultValue: '경기'
                },
                profileImg: {
                    type: Sequelize.STRING(300),
                },
                email: {
                    type:Sequelize.STRING(100),
                    allowNull: true,
                    defaultValue:null
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false, //_사용 여부
                modelName: 'User', //js에서사용
                tableName: 'users', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
    static associate(db) {
        db.User.hasMany(db.Comment, {
            foreignKey: 'fk_userKey',
            sourceKey: 'userKey'
        });
        db.User.hasMany(db.Like, {
            foreignKey: 'fk_userKey',
            sourceKey: 'userKey'
        });
    }
};