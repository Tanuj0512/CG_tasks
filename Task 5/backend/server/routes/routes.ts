

import express from "express";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  pagination,
  registerUser,
  userLogin,
  
  
} from "../controllers/controllers";
import validateUser from "../validation/validation";
import upload from "../middleware/fileUpoad";
import { verifyToken } from "../middleware/jwt";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
// Protected routes - require authentication
router.use(verifyToken);


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