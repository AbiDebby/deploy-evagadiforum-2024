const mysql2 = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
});

module.exports = connection.promise();



module.exports = connection.promise();

//  process.env.DB_PASSWORD,
// added the remote setting