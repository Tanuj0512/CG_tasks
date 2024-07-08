"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserQuery = {
    getUser: " SELECT * FROM users",
};
const addUserQuery = {
    addUser: "INSERT INTO users (firstName, lastName, dob, address, mobile, filePath) VALUES (?, ?, ?, ?, ?, ?)",
};
const updateUserQuery = {
    updateUser: "UPDATE users SET firstName = ?, lastName = ?, dob = ?, address = ?, mobile = ?, filePath = ? WHERE id = ?",
};
const deleteUserQuery = {
    deleteUser: "DELETE FROM users WHERE id = ?",
};
const paginatationQuery = {
    searchCondition: (searchTerm) => searchTerm
        ? "WHERE firstName LIKE ? OR lastName LIKE ? OR mobile LIKE ? OR address LIKE ? OR dob LIKE ?"
        : "",
    tableQuery: (searchCondition, sortBy, order) => `
    SELECT * FROM users
    ${searchCondition}
    ORDER BY ${sortBy} ${order} 
    LIMIT ? OFFSET ?
  `,
    countQuery: (searchCondition) => `SELECT COUNT(*) as total FROM users ${searchCondition}`,
    totalQuery: "SELECT COUNT(*) as total FROM users",
};
const registerUserQuery = {
    registerUser: "INSERT INTO auth_users (username, password) VALUES (?, ?)"
};
const userLoginQuery = {
    userLogin: "SELECT * FROM auth_users WHERE username = ?"
};
exports.default = {
    getUserQuery,
    addUserQuery,
    updateUserQuery,
    deleteUserQuery,
    paginatationQuery,
    registerUserQuery,
    userLoginQuery
};
