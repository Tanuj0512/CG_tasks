import express from "express";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  pagination,
  uploadFiles,
  showImages,
} from "../../controllers/v1/controller.crud";

import {
  registerUser,
  userLogin,
  logoutUser,
} from "../../controllers/v1/controller.auth";
import validateUserV1 from "../../validation/v1/validation";
import upload from "../../middleware/fileUpoad";
import { verifyToken } from "../../middleware/jwt";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
// Protected routes - require authentication
router.use(verifyToken);

// Get all users, Add users
router.route("/users").get(getUser).post(validateUserV1, verifyToken, addUser);

// Update user, Delete user
router
  .route("/users/:id")
  .put(validateUserV1, verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

//Pagination
router.route("/users/pagination").get(verifyToken, pagination);

// New route for multiple file upload without user ID
router.post("/upload", upload.array("files"), verifyToken, uploadFiles);

// All images
router.get("/images", verifyToken, showImages);

// Logout route
router.post("/logout", verifyToken, logoutUser);

export default router;
