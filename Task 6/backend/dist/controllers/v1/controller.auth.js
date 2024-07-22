"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.userLogin = exports.registerUser = void 0;
const db_1 = __importDefault(require("../../config/db"));
const query_auth_1 = __importDefault(require("../../query/query.auth"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../middleware/jwt");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const hash = yield bcrypt_1.default.hash(password, 10);
        const connection = yield db_1.default.getConnection();
        const insertUserSql = query_auth_1.default.registerUserQuery.registerUser;
        const insertUserValues = [username, hash];
        yield connection.query(insertUserSql, insertUserValues);
        connection.release();
        res.json("User Registered");
    }
    catch (err) {
        console.error("Error registering user:", err);
        if (err === "ER_DUP_ENTRY") {
            res.status(409).json({ error: "Username already exists" });
        }
        else {
            res.status(500).json({ error: "Failed to register user" });
        }
    }
});
exports.registerUser = registerUser;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const connection = yield db_1.default.getConnection();
        try {
            const [rows] = yield connection.execute(query_auth_1.default.userLoginQuery.userLogin, [username]);
            if (!rows || rows.length === 0) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const user = rows[0];
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "Invalid password" });
                return;
            }
            const accessToken = (0, jwt_1.createTokens)({
                id: user.id,
                username: user.username,
            });
            console.log("Generated Access Token:", accessToken);
            res.cookie("access-token", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30 * 1000,
            });
            res.json({ message: "Login successful" });
        }
        catch (err) {
            console.error("Error during user query or password comparison:", err);
            res.status(500).json({ error: "Failed to log in" });
        }
        finally {
            connection.release();
        }
    }
    catch (err) {
        console.error("Error establishing database connection:", err);
        res.status(500).json({ error: "Failed to log in" });
    }
});
exports.userLogin = userLogin;
const logoutUser = (req, res) => {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const userName = (_b = req.user) === null || _b === void 0 ? void 0 : _b.username;
    res.clearCookie("access-token");
    res.json({ message: "Logout successful", userId, userName });
};
exports.logoutUser = logoutUser;
exports.default = {
    registerUser: exports.registerUser,
    userLogin: exports.userLogin,
    logoutUser: exports.logoutUser,
};
