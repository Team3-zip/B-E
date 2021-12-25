const { Sequelize } = require('sequelize');
const db = require('.');

module.exports = class PublicImg extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                link: {
                    type: Sequelize.STRING(300),
                },
                thumbnail: {
                    type: Sequelize.STRING(300),
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false, //_사용 여부
                modelName: 'Youtube', //js에서사용
                tableName: 'youtube', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
};
