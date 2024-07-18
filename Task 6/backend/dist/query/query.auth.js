"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registerUserQuery = {
    registerUser: "INSERT INTO auth_users (username, password) VALUES (?, ?)",
};
const userLoginQuery = {
    userLogin: "SELECT * FROM auth_users WHERE username = ?",
};
exports.default = {
    registerUserQuery,
    userLoginQuery
};
