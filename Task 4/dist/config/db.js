"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = promise_1.default.createPool({
    host: process.env.Myhost,
    user: process.env.Myuser,
    password: process.env.Mypassword,
    database: process.env.Mydatabase,
});
exports.default = db;
// import mysql from "mysql2/promise";
// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "T@nuj123",
//   database: "crud_users",
// });
// export default db;
