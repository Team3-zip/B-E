const { Sequelize } = require('sequelize');
const db = require('.');

module.exports = class PrivateImg extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                houseManageNo:{ //주택관리번호
                    type:Sequelize.INTEGER,
                    allowNull:true,
                    primaryKey:true,
                },
                url1: {
                    type: Sequelize.STRING(300),
                },
                url2: {
                    type: Sequelize.STRING(300),
                },
                url3: {
                    type: Sequelize.STRING(300),
                },
                url4: {
                    type: Sequelize.STRING(300),
                },
                url5: {
                    type: Sequelize.STRING(300),
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false, //_사용 여부
                modelName: 'PrivateImg', //js에서사용
                tableName: 'privateimgs', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
    static associate(db) {
        db.PrivateImg.belongsTo(db.PrivateApt, {
            foreignKey : 'fk_pblancNo',
            sourceKey:'pblancNo'
        })  
    }
};