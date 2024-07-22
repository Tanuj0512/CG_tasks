import express from "express";
import validateUserV2 from "../../validation/v2/validation";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  uploadFiles,
  showImages,
  pagination,
} from "../../controllers/v2/controllers.crud";
// import {
//   registerUser,
//   userLogin,
//   logoutUser,
// } from "../../controllers/v2/controller.auth";
import { verifyToken } from "../../middleware/jwt";
import upload from "../../middleware/fileUpoad";

const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", userLogin);
router.use(verifyToken);

router.route("/users").get(getUser).post(validateUserV2, verifyToken, addUser);
router
  .route("/users/:id")
  .put(validateUserV2, verifyToken, updateUser)
  .delete(verifyToken, deleteUser);
router.route("/users/pagination").get(verifyToken, pagination);

router.post("/upload", upload.array("files"), verifyToken, uploadFiles);

router.get("/images", verifyToken, showImages);

// router.post("/logout", verifyToken, logoutUser);

export default router;
