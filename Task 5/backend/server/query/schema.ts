const getUserQuery = {
  getUser: " SELECT * FROM users",
};

const addUserQuery = {
  addUser:
    "INSERT INTO users (firstName, lastName, dob, address, mobile, filePath) VALUES (?, ?, ?, ?, ?, ?)",
};

const updateUserQuery = {
  updateUser:
  "UPDATE users SET firstName = ?, lastName = ?, dob = ?, address = ?, mobile = ?, filePath = ? WHERE id = ?",
};

const deleteUserQuery = {
  deleteUser: "DELETE FROM users WHERE id = ?",
};

const paginationQuery = {
  searchCondition: (searchTerm: string) =>
    searchTerm
      ? "WHERE firstName LIKE ? OR lastName LIKE ? OR mobile LIKE ? OR address LIKE ? OR dob LIKE ?"
      : "",

  tableQuery: (searchCondition: string, sortBy: string, order: string) => `
    SELECT * FROM users
    ${searchCondition}
    ORDER BY ${sortBy} ${order} 
    LIMIT ? OFFSET ?
  `,

  countQuery: (searchCondition: string) =>
    `SELECT COUNT(*) as total FROM users ${searchCondition}`,

  totalQuery: "SELECT COUNT(*) as total FROM users",
};

export default {
  getUserQuery,
  addUserQuery,
  updateUserQuery,
  deleteUserQuery,
  paginationQuery,
};
