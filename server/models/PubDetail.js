const Sequelize = require('sequelize');
const db = require('.');

module.exports = class PubDetail extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            contractStartDate: {
                type: Sequelize.STRING(30), 
                allowNull: true,
            }, 
            contractEndDate: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            address:{
                type: Sequelize.TEXT,
                allowNull:true,
            },
            size: {
                type: Sequelize.STRING(20), 
                allowNull: true,
            }, 
            heatMethod: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            houseCnt: {
                type: Sequelize.STRING(20), 
                allowNull: true, 
            },
            moveYM: {
                type: Sequelize.STRING(20), 
                allowNull: true, 
            },
            fileLink: {
                type: Sequelize.TEXT, 
                allowNull: true, 
            },

        }, {
            sequelize,
            timestamps: true,
            underscored: false, 
            modelName: 'PubDetail', 
            tableName: 'Pubdetails', 
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.PubDetail.belongsTo(db.PubNotice, { 
            foreignKey: 'panId', 
            targetKey: 'panId',
            onDelete: 'cascade'
        });
        
    }
};