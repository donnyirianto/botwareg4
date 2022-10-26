const mysql = require('mysql2/promise');
const config = require('../config');

const conn =  mysql.createPool(config.db); 

async function query(query) {
  const result = await conn.query(query)

  return result
}
async function execute(query) {
  const result = await conn.execute(query)

  return result

}

module.exports = {
  query, execute
}