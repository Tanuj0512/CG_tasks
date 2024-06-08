const db = require('../config/db')
//add user query 

const addUserQuery = {
  addUser :   "INSERT INTO users (firstName, lastName, dob, address, mobile) VALUES (?, ?, ?, ?, ?)"
};

const getUserQuery ={
 getUser :" SELECT * FROM users"
};

const updateUserQuery = {
updateUser :  "UPDATE users SET firstName = ?, lastName = ?, dob = ?, address = ?, mobile = ? WHERE id = ?"
};

const deleteUserQuery = {
deleteUser : "DELETE FROM users WHERE id = ?"
};

const setSearchQuery = {
  searchQuery : "SELECT * FROM users WHERE firstName LIKE ? OR lastName LIKE ? OR dob LIKE ? OR address LIKE ? OR mobile LIKE ?"
}

const setSortQuery = (sortBy, order, callback) => {
  const sortQuery = `SELECT * FROM users ORDER BY ${sortBy} ${order}`;
  db.query(sortQuery, callback);
};

const setPagenation = {
  pagegenation : "SELECT * FROM users LIMIT ? OFFSET ?"
}
module.exports = {addUserQuery,getUserQuery, deleteUserQuery, updateUserQuery, setSearchQuery, setPagenation, setSortQuery: setSortQuery}