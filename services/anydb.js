
const zconn = async (host,user,password,database,port, queryx) => {
  //console.log(host,user,password,database,port, queryx)
  try {
      const mysql = require('mysql2/promise');
      const dbnya = { /* don't expose password or any sensitive info, done only for demo */
          host: host,
          user: user,
          password: password,
          database: database,
          port: port,
          dateStrings:true,
          multipleStatements: true
      }

      const conn =  await mysql.createConnection(dbnya); 
      
      const [result] = await conn.query(queryx)
      conn.end()
      
      return JSON.parse(JSON.stringify(result))
    
  } catch (error) {
      console.log(error)
      return "error"
  }
}
 

module.exports= {
  zconn
}