const { Sequelize } = require('sequelize');
const db = require('.');

module.exports = class PrivateAptDetail2 extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                houseManageNo: {      //주택관리 번호
                    type:Sequelize.INTEGER,
                    allowNull:false,
                },
                modelNo: {          //모델번호
                    type: Sequelize.INTEGER,
                },
                type: {        //모델타입
                    type: Sequelize.STRING(10),
                },
                supplyAreaSize: {       //전용면적
                    type: Sequelize.STRING(20),
                },
                geSupplySize :{        //일반공급세대수
                    type: Sequelize.STRING(10),
                },
                spSupplySize :{         //특별공급세대수
                    type: Sequelize.STRING(10),
                },
                supplyAmount: {         //공급금액(분양최고금액,만원단위)
                    type: Sequelize.STRING(20),  
                },

            },
            {
                sequelize,
                timestamps: true,
                underscored: false, //_사용 여부
                modelName: 'PrivateAptDetail2', //js에서사용
                tableName: 'privateAptDetail2', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
    static associate(db) {
        db.PrivateAptDetail2.belongsTo(db.PrivateApt, { 
            foreignKey: 'fk_pblancNo', 
            targetKey: 'pblancNo',
            onDelete: 'cascade' 
        });
    }
};