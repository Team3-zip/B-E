const { Sequelize } = require('sequelize');
const db = require('.');

module.exports = class Like extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                likeId: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false, //_사용 여부
                modelName: 'Like', //js에서사용
                tableName: 'likes', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
    static associate(db) {
        db.Like.belongsTo(db.User, {
            foreignKey: 'fk_userKey',
            targetKey: 'userKey',
            onDelete: 'cascade'
        });
        db.Like.belongsTo(db.PrivateApt,{
            foreignKey:'fk_pblancNo', 
            targetKey:'pblancNo',
            onDelete: 'cascade'
        });
        db.Like.belongsTo(db.PubNotice,{
            foreignKey:'panId', 
            targetKey:'panId',
            onDelete: 'cascade'
        });
    }
};
