const mysql = require('mysql2/promise');
const config = require('../config');
//console.log(config.dbco)
const conn =  mysql.createPool(config.dbco); 
async function query(query) {
  const result = await conn.query(query)
  return result
} 

module.exports = {
  query 
}