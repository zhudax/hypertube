const mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
	host     : process.env.HOST,
	user     : process.env.DB_USER,
	password : process.env.DB_PASS
});

var connection_db = mysql.createConnection({
	host     : process.env.HOST,
	user     : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : "hypertube"
});

module.exports = {
	connection: connection,
	connection_db: connection_db
};