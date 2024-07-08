"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers/controllers");
const validation_1 = __importDefault(require("../validation/validation"));
const fileUpoad_1 = __importDefault(require("../middleware/fileUpoad"));
const jwt_1 = require("../middleware/jwt");
const router = express_1.default.Router();
router.post("/register", controllers_1.registerUser);
router.post("/login", controllers_1.userLogin);
router.use(jwt_1.verifyToken);
router.post("/logout", controllers_1.logoutUser);
router
    .route("/users")
    .get(controllers_1.getUser)
    .post(fileUpoad_1.default.single("file"), validation_1.default, controllers_1.addUser);
router
    .route("/users/:id")
    .put(fileUpoad_1.default.single("file"), validation_1.default, controllers_1.updateUser)
    .delete(controllers_1.deleteUser);
router.route("/users/paginatation").get(controllers_1.paginatation);
exports.default = router;
