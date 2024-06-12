const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  combinedSearchSortPagination,
  search,
  // pagenation,
  // sorting,
} = require("../controllers/controllers");
const { validateUser } = require("../validation/validation");

//add users, get user
router.route("/users").post(validateUser, addUser).get(getAllUsers);
//update and delete user by id
router.route("/users/:id").put( updateUser).delete(deleteUser);
//search
router.get("/users/search", search);
//sort
// router.get("/users/sort",sorting);
//pagenation
// router.get("/users/items", pagenation);


//validate user endpoints in frontened
router.post("/validateUser", validateUser);


module.exports = router;
