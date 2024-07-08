import express from "express";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  paginatation,
  registerUser,
  userLogin,
  logoutUser
} from "../controllers/controllers";
import validateUser from "../validation/validation";
import upload from "../middleware/fileUpoad";
import { verifyToken } from "../middleware/jwt";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
// Protected routes - require authentication
router.use(verifyToken);
router.post("/logout", logoutUser);

router
  .route("/users")
  .get(getUser)
  .post(upload.single("file"), validateUser, addUser);

router
  .route("/users/:id")
  .put(upload.single("file"), validateUser, updateUser)
  .delete(deleteUser);

router.route("/users/paginatation").get(paginatation);

export default router;
