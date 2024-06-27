"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUserQuery = {
    getUser: " SELECT * FROM users",
};
var addUserQuery = {
    addUser: "INSERT INTO users (firstName, lastName, dob, address, mobile) VALUES (?, ?, ?, ?, ?)",
};
var updateUserQuery = {
    updateUser: "UPDATE users SET firstName = ?, lastName = ?, dob = ?, address = ?, mobile = ? WHERE id = ?",
};
var deleteUserQuery = {
    deleteUser: "DELETE FROM users WHERE id = ?",
};
var pagenationQuery = {
    searchCondition: function (searchTerm) {
        return searchTerm
            ? "WHERE firstName LIKE ? OR lastName LIKE ? OR mobile LIKE ? OR address LIKE ? OR dob LIKE ?"
            : "";
    },
    tableQuery: function (searchCondition, sortBy, order) { return "\n    SELECT * FROM users\n    ".concat(searchCondition, "\n    ORDER BY ").concat(sortBy, " ").concat(order, " \n    LIMIT ? OFFSET ?\n  "); },
    countQuery: function (searchCondition) {
        return "SELECT COUNT(*) as total FROM users ".concat(searchCondition);
    },
    totalQuery: "SELECT COUNT(*) as total FROM users",
};
exports.default = {
    getUserQuery: getUserQuery,
    addUserQuery: addUserQuery,
    updateUserQuery: updateUserQuery,
    deleteUserQuery: deleteUserQuery,
    pagenationQuery: pagenationQuery,
};
