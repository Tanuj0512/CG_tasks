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
exports.pagination = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const schema_1 = __importDefault(require("../query/schema"));
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
exports.default = { getUser: exports.getUser, addUser: exports.addUser, updateUser: exports.updateUser, deleteUser: exports.deleteUser, pagination: exports.pagination };
