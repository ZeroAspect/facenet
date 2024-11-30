const { Sequelize } = require("sequelize");

// mysql://root:HMfjOuYCQpidQDOqHVnbCremotXJBUdJ@junction.proxy.rlwy.net:59134/railway
const sequelize = new Sequelize(
  "railway",
  "root",
  "HMfjOuYCQpidQDOqHVnbCremotXJBUdJ",
  {
    host: "junction.proxy.rlwy.net",
    dialect: "mysql",
    port: 59134,
  }
)

module.exports = sequelize