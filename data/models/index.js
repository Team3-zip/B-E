const Sequelize = require('sequelize');
const User = require('./User');
const Comment = require('./Comment');
const Like = require('./Like');
const PubNotice = require('./PubNotice');
const PrivateApt = require('./PrivateApt');
const PrivateAptDetail1 = require('./PrivateAptDetail1');
const PrivateAptDetail2 = require('./PrivateAptDetail2');
const PrivateImg = require('./PrivateImg');
const PublicImg = require('./PublicImg');
const Youtube = require('./Youtube');

const env = process.env.NODE_ENV || 'production';
// const config = require('../config/config')[env];
// const db = {};

const sequelize = new Sequelize(
    secrets.DATABASE_NAME,
    secrets.DATABASE_USER_NAME,
    secrets.DATABASE_PASSWORD,
    secrets.DATABASE_HOST,
    secrets.DATABASE_DIALECT,
    secrets.DATABASE_TIMEZONE
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.PrivateApt = PrivateApt;
db.PrivateAptDetail1 = PrivateAptDetail1;
db.PrivateAptDetail2=PrivateAptDetail2;
db.PubNotice = PubNotice;
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
PrivateImg.init(sequelize);
PublicImg.init(sequelize);
Youtube.init(sequelize);

PrivateApt.associate(db);
PrivateAptDetail1.associate(db);
PrivateAptDetail2.associate(db);
PrivateImg.associate(db);
PublicImg.associate(db);
PubNotice.associate(db);
User.associate(db);
Comment.associate(db);
Like.associate(db);

module.exports = db;
