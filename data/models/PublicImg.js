const { Sequelize } = require('sequelize');
const db = require('.');

module.exports = class PublicImg extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                url1: {
                    type: Sequelize.STRING(300),
                },
                url2: {
                    type: Sequelize.STRING(300),
                },
                url3: {
                    type: Sequelize.STRING(300),
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false, //_사용 여부
                modelName: 'PublicImg', //js에서사용
                tableName: 'PublicImg', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
    static associate(db) {
        db.PublicImg.belongsTo(db.PubNotice, { 
            foreignKey: 'panId', 
            targetKey: 'panId' ,
            onDelete: 'cascade'
        });

    }

};