import express from "express";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  pagination,
} from "../controllers/controllers";
import validateUser from "../validation/validation";
import upload from "../middleware/fileUpoad";

const router = express.Router();

router
  .route("/users")
  .get(getUser)
  .post(upload.single("file"), validateUser, addUser);

router
  .route("/users/:id")
  .put(upload.single("file"), validateUser, updateUser)
  .delete(deleteUser);

router.route("/users/pagination").get(pagination);

export default router;
