import express from "express";
import { getUser, addUser, updateUser, deleteUser, pagenation } from "../controllers/controllers";
import validateUser from "../validation/validation";

const router = express.Router();

router.route("/users").get(getUser).post(validateUser ,addUser);
router.route("/users/:id").put(validateUser,updateUser) .delete(deleteUser)
router.route("/users/pagenation").get(pagenation)


export default router;
