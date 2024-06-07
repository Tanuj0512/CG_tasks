const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  search,
} = require("../controllers/controllers");
const { validateUser } = require("../middleware/validate");

//add users, get user
router.route("/users").post(validateUser, addUser).get(getAllUsers);

//search
router.get("/users/search", search);

//update and delete user by id
router.route("/users/:id").put(validateUser, updateUser).delete(deleteUser);

module.exports = router;
