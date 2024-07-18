// import express from "express";
// import {
//   getUser,
//   addUser,
//   updateUser,
//   deleteUser,
//   pagination,
//   uploadFiles,
//   authenticatedUser,
//   showImage,
// } from "../../controllers/v1/controller.crud";
// // import {
// //   registerUser,
// //   logoutUser,
// //   userLogin,
// // } from "../../controllers/v1/controller.auth";
// import validateUser from "../../validation/validation";
// import upload from "../../middleware/fileUpoad";
// import { verifyToken } from "../../middleware/jwt";

// const router = express.Router();

// // router.post("/register", registerUser);
// // router.post("/login", userLogin);
// // Protected routes - require authentication
// router.use(verifyToken);

// // Get all users, Add users
// router
//   .route("/users")
//   .get(getUser)
//   .post(upload.single("file"), validateUser, addUser);


// // Update user, Delete user
// router
//   .route("/users/:id")
//   .put(upload.single("file"), validateUser, updateUser)
//   .delete(deleteUser);

// //Pagination
// router.route("/users/pagination").get(pagination);

// // New route for multiple file upload without user ID
// router.post("/upload", upload.array("files"), verifyToken, uploadFiles);

// // All images
// router.get("/images", verifyToken, authenticatedUser);

// // Specific images
// router.get("/images/:fileId", showImage);

// // Logout route
// // router.post("/logout", verifyToken, logoutUser);

// export default router;
