require('dotenv').config();

const config = { 
  db50: { /* don't expose password or any sensitive info, done only for demo */
    host: '192.168.131.50',
    user: 'edp1',
    password: 'abcd@1234',
    database: 'management_co',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    dateStrings:true,
    multipleStatements: true
  }, 
  dbho: { /* don't expose password or any sensitive info, done only for demo */
    host: process.env.DB_HOST_HO,
    user: process.env.DB_USER_HO,
    password: process.env.DB_PASS_HO,
    database: process.env.DB_NAME_HO,
    port: process.env.DB_PORT_HO,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    dateStrings:true,
    multipleStatements: true
  },
};

module.exports = config;