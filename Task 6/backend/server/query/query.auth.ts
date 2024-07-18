const registerUserQuery = {
  registerUser: "INSERT INTO auth_users (username, password) VALUES (?, ?)",
};

const userLoginQuery = {
  userLogin: "SELECT * FROM auth_users WHERE username = ?",
};

export default {
    registerUserQuery,
    userLoginQuery
}