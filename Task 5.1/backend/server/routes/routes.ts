import express from "express";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  pagination,
  registerUser,
  userLogin,
  uploadFiles,
  authenticatedUser,
  logoutUser,
  showImage
} from "../controllers/crud";
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

// New route for multiple file upload without user ID
router.post("/upload", upload.array("files"),verifyToken, uploadFiles);

//all images
router.get('/images', verifyToken, authenticatedUser);
//specific images
router.get('/images/:fileId', showImage)

// Logout route
router.post('/logout', verifyToken, logoutUser)



export default router;
