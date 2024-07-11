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
exports.logoutUser = exports.showImage = exports.authenticatedUser = exports.uploadFiles = exports.userLogin = exports.registerUser = exports.pagination = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const schema_1 = __importDefault(require("../query/schema"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../middleware/jwt");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = schema_1.default.getUserQuery.getUser;
    try {
        const [result] = yield db_1.default.query(sql);
        console.log("Fetched users:", result);
        res.status(200).json(result);
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(424).json({ error: "Failed to fetch users" });
    }
});
exports.getUser = getUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, dob, address, mobile } = req.body;
    const file = req.file;
    const sql = schema_1.default.addUserQuery.addUser;
    const values = [firstName, lastName, dob, address, mobile, file.path];
    try {
        const result = yield db_1.default.query(sql, values);
        res.status(200).json({ message: "User added successfully", file: file });
    }
    catch (err) {
        console.error("Error adding user:", err);
        res.status(422).json({ error: "Failed to add user" });
    }
});
exports.addUser = addUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName, dob, address, mobile } = req.body;
        const checkUserSql = schema_1.default.getUserQuery.getUser;
        const updateUserSql = schema_1.default.updateUserQuery.updateUser;
        const file = req.file;
        const values = file
            ? [firstName, lastName, dob, address, mobile, file.path, id]
            : [firstName, lastName, dob, address, mobile, id];
        const [userResult] = yield db_1.default.query(checkUserSql, [id]);
        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const [updateResult] = yield db_1.default.query(updateUserSql, values);
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ id, firstName, lastName, dob, address, mobile });
    }
    catch (err) {
        console.error("Error updating user:", err);
        res.status(424).json({ error: "Failed to update user" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const checkUserSql = schema_1.default.getUserQuery.getUser;
        const deleteUserSql = schema_1.default.deleteUserQuery.deleteUser;
        const [userResult] = yield db_1.default.query(checkUserSql, [id]);
        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const [deleteResult] = yield db_1.default.query(deleteUserSql, [id]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).send("User deleted");
    }
    catch (err) {
        console.error("Error deleting user:", err);
        res.status(424).json({ error: "Failed to delete user" });
    }
});
exports.deleteUser = deleteUser;
const pagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.term || "";
        const sortBy = req.query.sortBy || "firstName";
        const order = req.query.order === "desc" ? "DESC" : "ASC";
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const offset = (page - 1) * itemsPerPage;
        if (isNaN(page) || page < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }
        const validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
        if (!validSortBy.includes(sortBy) || !["ASC", "DESC"].includes(order)) {
            return res.status(400).json({ error: "Invalid sort parameters" });
        }
        const searchCondition = schema_1.default.paginationQuery.searchCondition(searchTerm);
        const searchParams = searchTerm ? new Array(5).fill(`%${searchTerm}%`) : [];
        const tableQuery = schema_1.default.paginationQuery.tableQuery(searchCondition, sortBy, order);
        const countSql = schema_1.default.paginationQuery.countQuery(searchCondition);
        const [results] = yield db_1.default.query(tableQuery, [
            ...searchParams,
            itemsPerPage,
            offset,
        ]);
        const [[{ total }]] = yield db_1.default.query(countSql, searchParams);
        res.setHeader("X-Total-Count", total.toString());
        res.json(results);
    }
    catch (error) {
        console.error("Unexpected error", error);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});
exports.pagination = pagination;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const hash = yield bcrypt_1.default.hash(password, 10);
        const connection = yield db_1.default.getConnection();
        const insertUserSql = schema_1.default.registerUserQuery.registerUser;
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
            const [rows] = yield connection.execute(schema_1.default.userLoginQuery.userLogin, [username]);
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
            else {
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
        }
        finally {
            connection.release();
        }
    }
    catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Failed to log in" });
    }
});
exports.userLogin = userLogin;
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }
    try {
        for (const file of files) {
            const [result] = yield db_1.default.query(schema_1.default.uploadFileQuery.uploadImage, [userId, file.path]);
            if (result.affectedRows === 0) {
                return res.status(500).json({ error: "Failed to upload file" });
            }
        }
        res.status(200).json({ message: "Files uploaded successfully" });
    }
    catch (err) {
        console.error("Error uploading files:", err);
        res.status(500).json({ error: "Failed to upload files" });
    }
});
exports.uploadFiles = uploadFiles;
const authenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const userName = (_c = req.user) === null || _c === void 0 ? void 0 : _c.username;
    try {
        const [rows] = yield db_1.default.query(schema_1.default.fetchImageQuery.fetchImage, [userId]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No images found for the user" });
        }
        const imagePaths = rows.map((row) => row.image_path);
        res.json({
            user_id: userId,
            userName: userName,
            files: imagePaths,
        });
    }
    catch (err) {
        console.error("Error fetching images:", err);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});
exports.authenticatedUser = authenticatedUser;
const showImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { fileId } = req.params;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    try {
        const [rows] = yield db_1.default.query("SELECT image_path FROM images WHERE user_id = ? AND id = ?", [userId, fileId]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "File not found" });
        }
        const filePath = rows[0].image_path;
        const allFilePath = path_1.default.join(__dirname, "../../uploads", filePath);
        const apiRoute = "http://localhost:3010/uploads/";
        const imageUrl = apiRoute + path_1.default.basename(allFilePath);
        res.status(200).json({ imageUrl });
    }
    catch (err) {
        console.error("Error fetching file:", err);
        res.status(500).json({ error: "Failed to fetch file" });
    }
});
exports.showImage = showImage;
const logoutUser = (req, res) => {
    res.clearCookie("access-token");
    res.json({ message: "Logout successful" });
};
exports.logoutUser = logoutUser;
exports.default = {
    getUser: exports.getUser,
    addUser: exports.addUser,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
    pagination: exports.pagination,
    registerUser: exports.registerUser,
    userLogin: exports.userLogin,
    authenticatedUser: exports.authenticatedUser,
    logoutUser: exports.logoutUser,
    showImage: exports.showImage,
};
