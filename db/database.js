const mysql = require("mysql2")

async function MySql(){
  const connection = await mysql.createPool({
    uri: "mysql://root:HMfjOuYCQpidQDOqHVnbCremotXJBUdJ@junction.proxy.rlwy.net:59134/railway"
  })
  const pool = connection.promise()

  return pool
}

module.exports = MySql