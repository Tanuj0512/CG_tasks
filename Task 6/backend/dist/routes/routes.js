"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_crud_1 = require("../controllers/controller.crud");
const controller_auth_1 = require("../controllers/controller.auth");
const validation_1 = __importDefault(require("../validation/validation"));
const fileUpoad_1 = __importDefault(require("../middleware/fileUpoad"));
const jwt_1 = require("../middleware/jwt");
const router = express_1.default.Router();
router.post("/register", controller_auth_1.registerUser);
router.post("/login", controller_auth_1.userLogin);
router.use(jwt_1.verifyToken);
router
    .route("/users")
    .get(controller_crud_1.getUser)
    .post(fileUpoad_1.default.single("file"), validation_1.default, controller_crud_1.addUser);
router
    .route("/users/:id")
    .put(fileUpoad_1.default.single("file"), validation_1.default, controller_crud_1.updateUser)
    .delete(controller_crud_1.deleteUser);
router.route("/users/pagination").get(controller_crud_1.pagination);
router.post("/upload", fileUpoad_1.default.array("files"), jwt_1.verifyToken, controller_crud_1.uploadFiles);
router.get("/images", jwt_1.verifyToken, controller_crud_1.authenticatedUser);
router.get("/images/:fileId", controller_crud_1.showImage);
router.post("/logout", jwt_1.verifyToken, controller_auth_1.logoutUser);
exports.default = router;
