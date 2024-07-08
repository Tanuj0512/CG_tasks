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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatation = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = void 0;
var db_1 = require("../config/db");
var schema_1 = require("../query/schema");
//get Users
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sql = schema_1.default.getUserQuery.getUser;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query(sql)];
            case 2:
                result = (_a.sent())[0];
                res.status(200).json(result);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error("Error fetching users:", err_1);
                res.status(424).json({ error: "Failed to fetch users" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
//add User
var addUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, dob, address, mobile, sql, values, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, dob = _a.dob, address = _a.address, mobile = _a.mobile;
                sql = schema_1.default.addUserQuery.addUser;
                values = [firstName, lastName, dob, address, mobile];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query(sql, values)];
            case 2:
                result = _b.sent();
                res.status(200).json({ message: "User added successfully" });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                console.error("Error adding user:", err_2);
                res.status(422).json({ error: "Failed to add user" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addUser = addUser;
//update user
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, firstName, lastName, dob, address, mobile, sql, values, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, dob = _a.dob, address = _a.address, mobile = _a.mobile;
                sql = schema_1.default.updateUserQuery.updateUser;
                values = [firstName, lastName, dob, address, mobile, id];
                return [4 /*yield*/, db_1.default.query(sql, values)];
            case 1:
                result = _b.sent();
                if (result.affectedRows === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                res.json({ id: id, firstName: firstName, lastName: lastName, dob: dob, address: address, mobile: mobile });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                console.error("Error updating user:", err_3);
                res.status(424).json({ error: "Failed to update user" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
//delete user
// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const sql = queries.deleteUserQuery.deleteUser;
//     const result = await db.query(sql, [id]);
//     if ((result as any).affectedRows === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).send("User deleted");
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.status(424).json({ error: "Failed to delete user" });
//   }
// };
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, checkUserSql, deleteUserSql, userResult, deleteResult, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                checkUserSql = schema_1.default.getUserQuery.getUser;
                deleteUserSql = schema_1.default.deleteUserQuery.deleteUser;
                return [4 /*yield*/, db_1.default.query(checkUserSql, [id])];
            case 1:
                userResult = (_a.sent())[0];
                if (userResult.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                return [4 /*yield*/, db_1.default.query(deleteUserSql, [id])];
            case 2:
                deleteResult = (_a.sent())[0];
                if (deleteResult.affectedRows === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                res.status(200).send("User deleted");
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.error("Error deleting user:", err_4);
                res.status(424).json({ error: "Failed to delete user" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
//search, sort, paginatation
var paginatation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var searchTerm, sortBy, order, page, itemsPerPage, offset, validSortBy, searchCondition, searchParams, tableQuery, countSql, results, total, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                searchTerm = req.query.term || "";
                sortBy = req.query.sortBy || "firstName";
                order = req.query.order === "desc" ? "DESC" : "ASC";
                page = parseInt(req.query.page) || 1;
                itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
                offset = (page - 1) * itemsPerPage;
                if (isNaN(page) || page < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid paginatation parameters" })];
                }
                validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
                if (!validSortBy.includes(sortBy) || !["ASC", "DESC"].includes(order)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid sort parameters" })];
                }
                searchCondition = schema_1.default.paginatationQuery.searchCondition(searchTerm);
                searchParams = searchTerm ? new Array(5).fill("%".concat(searchTerm, "%")) : [];
                tableQuery = schema_1.default.paginatationQuery.tableQuery(searchCondition, sortBy, order);
                countSql = schema_1.default.paginatationQuery.countQuery(searchCondition);
                return [4 /*yield*/, db_1.default.query(tableQuery, __spreadArray(__spreadArray([], searchParams, true), [
                        itemsPerPage,
                        offset,
                    ], false))];
            case 1:
                results = (_a.sent())[0];
                return [4 /*yield*/, db_1.default.query(countSql, searchParams)];
            case 2:
                total = (_a.sent())[0][0].total;
                res.setHeader("X-Total-Count", total.toString());
                res.json(results);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Unexpected error", error_1);
                res.status(500).json({ error: "Unexpected error occurred" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.paginatation = paginatation;
exports.default = { getUser: exports.getUser, addUser: exports.addUser, updateUser: exports.updateUser, deleteUser: exports.deleteUser, paginatation: exports.paginatation };
