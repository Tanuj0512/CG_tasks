"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserQuery = {
    getUser: " SELECT * FROM users",
};
const addUserQuery = {
    addUser: "INSERT INTO users (firstName, lastName, dob, address, mobile) VALUES (?, ?, ?, ?, ?)",
};
const updateUserQuery = {
    updateUser: "UPDATE users SET firstName = ?, lastName = ?, dob = ?, address = ?, mobile = ?,  WHERE id = ?",
};
const deleteUserQuery = {
    deleteUser: "DELETE FROM users WHERE id = ?",
};
const paginationQuery = {
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
const uploadFileQuery = {
    uploadImage: "INSERT INTO images (user_id, image_path) VALUES (?, ?)"
};
const fetchImageQuery = {
    fetchImage: "SELECT * FROM images WHERE user_id = ?"
};
exports.default = {
    getUserQuery,
    addUserQuery,
    updateUserQuery,
    deleteUserQuery,
    paginationQuery,
    uploadFileQuery,
    fetchImageQuery
};
