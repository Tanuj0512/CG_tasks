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

const searchQuery = {
  searchItem : "SELECT * FROM users WHERE firstName LIKE ? OR lastName LIKE ? OR dob LIKE ? OR address LIKE ? OR mobile LIKE ?"
}
module.exports = {addUserQuery,getUserQuery, deleteUserQuery, updateUserQuery,searchQuery}