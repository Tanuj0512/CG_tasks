const db = require("../config/db");


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

const queryPagenation = {
  searchCondition: searchTerm =>
    searchTerm ? "WHERE firstName LIKE ? OR lastName LIKE ? OR mobile LIKE ? OR address LIKE ? OR dob LIKE ?" : "",

  tableQuery: (searchCondition, sortBy, order) => `
    SELECT * FROM users
    ${searchCondition}
    ORDER BY ${sortBy} ${order} 
    LIMIT ? OFFSET ?
  `,

  countQuery: searchCondition => `SELECT COUNT(*) as total FROM users ${searchCondition}`,

  totalQuery: 'SELECT COUNT(*) as total FROM users'
};


module.exports = {
  addUserQuery,
  getUserQuery,
  deleteUserQuery,
  updateUserQuery,
  queryPagenation,

};
