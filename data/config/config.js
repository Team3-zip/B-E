require('dotenv').config();
const env = process.env;

const development = {
  username: env.USER_NAME,
  password: env.USER_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  timezone:"+09:00"
  //port: env.MYSQL_PORT
};

const test = {
  username: env.USER_NAME,
  password: env.USER_PASSWORD,
  database: env.DATABASE,
  host: env.HOST,
  dialect: "mysql",
  timezone:"+09:00"
  //port: env.MYSQL_PORT
};

const production = {
  username: env.MYSQL_USER_NAME,
  password: env.MYSQL_USER_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  timezone:"+09:00"
  //port: env.MYSQL_PORT!
};

module.exports = { development, production, test };