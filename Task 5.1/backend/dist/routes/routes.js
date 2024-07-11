"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crud_1 = require("../controllers/crud");
const validation_1 = __importDefault(require("../validation/validation"));
const fileUpoad_1 = __importDefault(require("../middleware/fileUpoad"));
const jwt_1 = require("../middleware/jwt");
const router = express_1.default.Router();
router.post("/register", crud_1.registerUser);
router.post("/login", crud_1.userLogin);
router.use(jwt_1.verifyToken);
router
    .route("/users")
    .get(crud_1.getUser)
    .post(fileUpoad_1.default.single("file"), validation_1.default, crud_1.addUser);
router
    .route("/users/:id")
    .put(fileUpoad_1.default.single("file"), validation_1.default, crud_1.updateUser)
    .delete(crud_1.deleteUser);
router.route("/users/pagination").get(crud_1.pagination);
router.post("/upload", fileUpoad_1.default.array("files"), jwt_1.verifyToken, crud_1.uploadFiles);
router.get('/images', jwt_1.verifyToken, crud_1.authenticatedUser);
router.get('/images/:fileId', crud_1.showImage);
router.post('/logout', jwt_1.verifyToken, crud_1.logoutUser);
exports.default = router;
