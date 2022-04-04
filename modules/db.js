const mysql = require('mysql');

// DB connection using .env settings
const pool = mysql.createPool({
    connectionLimit : 10,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    port : process.env.DB_PORT
});

// Open pooled connection to DB
pool.getConnection((error, connection) => {
    if (error){ // if no success
        console.log(error);
    } else { // if success
        console.log('connected');
    }
});

module.exports = pool;