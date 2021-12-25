const Sequelize = require('sequelize');
const User = require('./User');
const Comment = require('./Comment');
const Like = require('./Like');
const PubNotice = require('./PubNotice');
const PubDetail = require('./PubDetail')
const PrivateApt = require('./PrivateApt');
const PrivateAptDetail1 = require('./PrivateAptDetail1');
const PrivateAptDetail2 = require('./PrivateAptDetail2');
const PrivateImg = require('./PrivateImg');
const PublicImg = require('./PublicImg');
const Youtube = require('./Youtube');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.PrivateApt = PrivateApt;
db.PrivateAptDetail1 = PrivateAptDetail1;
db.PrivateAptDetail2=PrivateAptDetail2;
db.PubNotice = PubNotice;
db.PubDetail = PubDetail;
db.PrivateImg = PrivateImg;
db.PublicImg = PublicImg;
db.User = User;
db.Comment = Comment;
db.Like = Like;
db.Youtube = Youtube;

PrivateApt.init(sequelize);
PubNotice.init(sequelize);
User.init(sequelize); //연결 객체 (sequelize)를 이용해서 연결!!
Comment.init(sequelize);
Like.init(sequelize);
PrivateAptDetail1.init(sequelize);
PrivateAptDetail2.init(sequelize);
PubDetail.init(sequelize);
PrivateImg.init(sequelize);
PublicImg.init(sequelize);
Youtube.init(sequelize);

PrivateApt.associate(db);
PrivateAptDetail1.associate(db);
PrivateAptDetail2.associate(db);
PrivateImg.associate(db);
PublicImg.associate(db);
PubNotice.associate(db);
PubDetail.associate(db);
User.associate(db);
Comment.associate(db);
Like.associate(db);

module.exports = db;
