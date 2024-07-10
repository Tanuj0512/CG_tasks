"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promise_1 = require("mysql2/promise");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var db = promise_1.default.createPool({
    host: process.env.Myhost,
    user: process.env.Myuser,
    password: process.env.Mypassword,
    database: process.env.Mydatabase,
});
exports.default = db;
