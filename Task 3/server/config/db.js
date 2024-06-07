const mysql = require("mysql2");
require("dotenv").config();

//database configuration
const db = mysql.createConnection({
  // host: process.env.Myhost,
  // user: process.env.Myuser,
  // password: process.env.Mypassword,
  // database: process.env.Mydatabase,
  host: "localhost",
  user: "root",
  password: "T@nuj123",
  database: "crud_users",
});

//database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("MySQL connected");
});

module.exports = db;
