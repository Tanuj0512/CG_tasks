"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers/controllers");
const validation_1 = __importDefault(require("../validation/validation"));
const router = express_1.default.Router();
router.route("/users").get(controllers_1.getUser).post(validation_1.default, controllers_1.addUser);
router.route("/users/:id").put(validation_1.default, controllers_1.updateUser).delete(controllers_1.deleteUser);
router.route("/users/pagenation").get(controllers_1.pagenation);
exports.default = router;
