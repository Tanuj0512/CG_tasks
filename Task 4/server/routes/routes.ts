import express from "express";
import { getUser, addUser, updateUser, deleteUser,  } from "../controllers/controllers";

const router = express.Router();

router.route("/users").get(getUser).post(addUser);
router.route("/users/:id").put(updateUser) .delete(deleteUser)
// router.route("/users/pagenation").get(pagenation)


export default router;
