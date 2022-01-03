const { Sequelize } = require('sequelize');
const db = require('.');

module.exports = class PrivateAptDetail1 extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                contractStartDate: {  //계약시작일
                    type: Sequelize.STRING(30),
                },
                contractEndDate: {  //계약 종료일
                    type: Sequelize.STRING(30),
                },
                relevantArea1Date: {  //1순의 접수일(해당지역)
                    type: Sequelize.STRING(30),
                },
                etcArea1Date: {    //1순위 접수(기타지역)
                    type: Sequelize.STRING(30),
                },
                gyeonggi1Date: {   //1순위 접수(경기)
                    type: Sequelize.STRING(30),
                },
                relevantArea2Date: {   //2순위 접수(해당)
                    type: Sequelize.STRING(30),
                },
                etcArea2Date: {     //2순위 접수(기타)
                    type: Sequelize.STRING(30),
                },
                gyeonggi2Date: {     //2순위 접수(경기)
                    type: Sequelize.STRING(30),
                },
                homePage: {        //홈페이지 주소
                    type: Sequelize.STRING(70),
                    allowNull:true,
                },
                houseManageNo: {      //주택관리 번호
                    type:Sequelize.INTEGER,
                    allowNull:false,
                    primaryKey:true,

                },
                applyAddress: {          //공급위치
                    type: Sequelize.STRING(70),
                },
                plusSupplyStartDate: {        //특별공극접수 시작일
                    type: Sequelize.STRING(30),
                    allowNull:true,
                },
                plusSupplyEndDate: {       //특별공급 접수 종료일
                    type: Sequelize.STRING(30),
                    allowNull:true,
                },
                supplySize: {         //공급규모
                    type: Sequelize.STRING(15),  
                },

            },
            {
                sequelize,
                timestamps: true,
                underscored: false, //_사용 여부
                modelName: 'PrivateAptDetail1', //js에서사용
                tableName: 'privateAptDetail1', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
    static associate(db) {
        db.PrivateAptDetail1.belongsTo(db.PrivateApt, { 
            foreignKey: 'fk_pblancNo', 
            targetKey: 'pblancNo',
            onDelete: 'cascade' 
        });
    }
};