const Sequelize = require("sequelize");
const db = require('.');

module.exports = class PubNotice extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                panState: {
                    // 공고상태
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                panUploadDate: {
                    // 공고 게시일
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                aisTypeCode: {
                    // 매물 유형 코드
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                suplyTypeCode: {
                    // 공급정보 구분코드
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                sidoName: {
                    // 지역명
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                panId: {
                    // 공고 아이디
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    primaryKey: true,
                },
                uppAisTypeName: {
                    // 공고유형명
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                aisTypeName: {
                    // 공고 세부 유형명
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                startDate: {
                    // 청약 신청일
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                closeDate: {
                    // 청약 마감일
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                announceDate: {
                    // 발표일
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                submitStartDate: {
                    // 서류제출일
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                submitEndDate: {
                    // 서류마감일
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                contractStartDate: {
                    // 계약시작일
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                contractEndDate: {
                    // 계약마감일
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                houseCnt: {
                    // 총 세대수
                    type: Sequelize.STRING(20), 
                    allowNull: true, 
                },
                size: {
                    // 전용 면적
                    type: Sequelize.STRING(20), 
                    allowNull: true,
                }, 
                moveYM: {
                    // 입주 예정월
                    type: Sequelize.STRING(20), 
                    allowNull: true, 
                },
                heatMethod: {
                    // 난방 방식
                    type: Sequelize.STRING(20),
                    allowNull: true,
                },
                panDate: {
                    // 모집 공고일
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                uppAisTypeCode: {
                    // 상위 매물 유형 코드
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                panName: {
                    // 공고명
                    type: Sequelize.STRING(80),
                    allowNull: false,
                },
                allCount: {
                    // 전체조회건수
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                fileLink: {
                    // 공고문 다운 링크
                    type: Sequelize.TEXT, 
                    allowNull: true, 
                },
                address:{
                    type: Sequelize.TEXT,
                    allowNull:true,
                },
                detailUrl: {
                    // 공고 상세 URL
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                csCode: {
                    // 고객센터 연계 시스템 구분코드
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
            },
            // {
            //     panState: {
            //         // 공고상태
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     rNum: {
            //         // 순번
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     panStartDate: {
            //         // 공고 게시일
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     aisTypeCode: {
            //         // 매물 유형 코드
            //         type: Sequelize.STRING(20),
            //         allowNull: true,
            //     },
            //     suplyTypeCode: {
            //         // 공급정보 구분코드
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     sidoName: {
            //         // 지역명
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     panId: {
            //         // 공고 아이디
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //         primaryKey: true,
            //     },
            //     uppAisTypeName: {
            //         // 공고유형명
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     aisTypeName: {
            //         // 공고 세부 유형명
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     closeDate: {
            //         // 공고 마감일
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     panDate: {
            //         // 모집 공고일
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     uppAisTypeCode: {
            //         // 상위 매물 유형 코드
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     panName: {
            //         // 공고명
            //         type: Sequelize.STRING(80),
            //         allowNull: false,
            //     },
            //     allCount: {
            //         // 전체조회건수
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            //     detailUrl: {
            //         // 공고 상세 URL
            //         type: Sequelize.TEXT,
            //         allowNull: false,
            //     },
            //     csCode: {
            //         // 고객센터 연계 시스템 구분코드
            //         type: Sequelize.STRING(20),
            //         allowNull: false,
            //     },
            // },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "PubNotice",
                tableName: "Pubnotices",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) { 
        // db.PubNotice.hasOne(db.PubDetail, { 
        //     foreignKey: 'panId', 
        //     sourceKey: 'panId' 
        // });
        db.PubNotice.hasOne(db.PublicImg, { 
            foreignKey: 'panId', sourceKey: 'panId' 
        });
        db.PubNotice.hasMany(db.Like, {
            foreignKey:'panId', 
            sourceKey:'panId'
        });
    }
};