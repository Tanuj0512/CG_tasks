const { count } = require("console");
const db = require("../config/db");
//add user query

const addUserQuery = {
  addUser:
    "INSERT INTO users (firstName, lastName, dob, address, mobile) VALUES (?, ?, ?, ?, ?)",
};

const getUserQuery = {
  getUser: " SELECT * FROM users",
};

const updateUserQuery = {
  updateUser:
    "UPDATE users SET firstName = ?, lastName = ?, dob = ?, address = ?, mobile = ? WHERE id = ?",
};

const deleteUserQuery = {
  deleteUser: "DELETE FROM users WHERE id = ?",
};

const setSearchQuery = {
  searchQuery: `
    SELECT * FROM users
    WHERE firstName LIKE ? OR lastName LIKE ? OR mobile LIKE ? OR address LIKE ? OR dob LIKE ?
    ORDER BY ?? ??
    LIMIT ? OFFSET ?
  `,
  countSql: `
    SELECT COUNT(*) as total FROM users
    WHERE firstName LIKE ? OR lastName LIKE ? OR mobile LIKE ? OR address LIKE ? OR dob LIKE ?
  `,
};

const setSortQuery = {
  sortQuery: `
    SELECT * FROM users
    ORDER BY ?? ??
    LIMIT ? OFFSET ?
  `,
  countSql: "SELECT COUNT(*) as total FROM users",
};

const setPagenation = {
  pagegenation: "SELECT * FROM users ORDER BY id DESC LIMIT ? OFFSET ?", // Retrieves user data for current page
  countPagenation: "SELECT COUNT(*) AS total FROM users", // Counts total users in table, for pagination calculations
};



module.exports = {
  addUserQuery,
  getUserQuery,
  deleteUserQuery,
  updateUserQuery,
  setSearchQuery,
  setPagenation,
  setSortQuery: setSortQuery,
  // setOrderByUser,
};
