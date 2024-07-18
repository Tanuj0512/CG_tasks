"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = __importDefault(require("../../validation/validation"));
const controllers_crud_1 = require("../../controllers/v2/controllers.crud");
const controller_auth_1 = require("../../controllers/v2/controller.auth");
const jwt_1 = require("../../middleware/jwt");
const fileUpoad_1 = __importDefault(require("../../middleware/fileUpoad"));
const router = express_1.default.Router();
router.post("/register", controller_auth_1.registerUser);
router.post("/login", controller_auth_1.userLogin);
router.use(jwt_1.verifyToken);
router
    .route("/users")
    .get(controllers_crud_1.getUser)
    .post(validation_1.default, jwt_1.verifyToken, controllers_crud_1.addUser);
router
    .route("/users/:id")
    .put(validation_1.default, jwt_1.verifyToken, controllers_crud_1.updateUser)
    .delete(jwt_1.verifyToken, controllers_crud_1.deleteUser);
router.route("/users/pagination").get(jwt_1.verifyToken, controllers_crud_1.pagination);
router.post("/upload", fileUpoad_1.default.array("files"), jwt_1.verifyToken, controllers_crud_1.uploadFiles);
router.get("/images", jwt_1.verifyToken, controllers_crud_1.showImages);
router.post("/logout", controller_auth_1.logoutUser);
exports.default = router;
