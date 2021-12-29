const { Sequelize } = require('sequelize');
const db = require('.');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                commentId: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                },
                content: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true, //아니왜 ..? created_at, updated_at이 생성 되는거? 왜
                underscored: false, //_사용 여부
                modelName: 'Comment', //js에서사용
                tableName: 'comments', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
    static associate(db) {
        db.Comment.belongsTo(db.User, {
            foreignKey: 'fk_userKey',
            targetKey: 'userKey',
            onDelete: 'cascade'
        });
        db.Comment.belongsTo(db.PrivateApt, {
            foreignKey: 'fk_pblancNo',
            targetKey: 'pblancNo',
            onDelete: 'cascade'
        });
        
    }
};
