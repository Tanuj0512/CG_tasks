import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.Myhost,
  user: process.env.Myuser,
  password: process.env.Mypassword,
  database: process.env.Mydatabase,
});

export default db;