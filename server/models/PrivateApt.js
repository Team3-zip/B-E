const {Sequelize} = require('sequelize');
const { PrivateAptDetail1 } = require('.');
const db = require('.');

module.exports= class PrivateApt extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                pblancNo: { //모집공고번호              
                    type:Sequelize.INTEGER,
                    primaryKey:true,
                    allowNull:false,
                    autoIncrement:false,
                },
                executor:{ //시행사
                    type:Sequelize.STRING(40),
                    allowNull:true,
                },
                operation:{ //민영 or 공영
                    type: Sequelize.STRING(10),
                    allowNull:true
                },
                houseManageNo:{ //주택관리번호
                    type:Sequelize.INTEGER,
                    allowNull:true,
                },
                houseName:{ //아파트이름 
                    type:Sequelize.STRING(40),
                    allowNull:true
                },
                winDate:{    //당첨자 발표일
                    type:Sequelize.STRING(20),
                    allowNull:true
                },
                receptStartDate:{   //청약접수시작일
                    type:Sequelize.STRING(20),
                    allowNull:true
                },
                receptEndDate:{     //청약접수 종료일
                    type:Sequelize.STRING(20),
                    allowNull:true
                },
                recruitDate : { //모집공고일
                    type:Sequelize.STRING(20),
                    allowNull:true
                }, 
                rentSection :{      //분양구분
                    type:Sequelize.STRING(15),
                    allowNull:true,
                },
                sido:{             //시도
                    type:Sequelize.STRING(15),
                    allowNull:true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false, //_사용 여부
                modelName: 'PrivateApt', //js에서사용
                tableName: 'privateapts', //db에서 사용
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
        
    }
    static associate(db) {
        db.PrivateApt.hasOne(db.PrivateAptDetail1, {
            foreignKey: 'fk_pblancNo',
            sourceKey: 'pblancNo',
        });
        db.PrivateApt.hasOne(db.PrivateImg, {
            foreignKey : 'fk_pblancNo',
            sourceKey:'pblancNo'
        });
        db.PrivateApt.hasOne(db.PrivateAptDetail2, {
            foreignKey : 'fk_pblancNo',
            sourceKey:'pblancNo'
        });
        db.PrivateApt.hasMany(db.Like, {
            foreignKey : 'fk_pblancNo',
            sourceKey:'pblancNo'
        });
    }
}