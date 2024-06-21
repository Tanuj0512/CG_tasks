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
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const schema_1 = __importDefault(require("../query/schema"));
//get Users
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = schema_1.default.getUserQuery.getUser;
    try {
        const [result] = yield db_1.default.query(sql);
        res.status(200).json(result);
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(424).json({ error: "Failed to fetch users" });
    }
});
exports.getUser = getUser;
//add User
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, dob, address, mobile } = req.body;
    const sql = schema_1.default.addUserQuery.addUser;
    const values = [firstName, lastName, dob, address, mobile];
    try {
        const result = yield db_1.default.query(sql, values);
        res.status(200).json({ message: "User added successfully" });
    }
    catch (err) {
        console.error("Error adding user:", err);
        res.status(422).json({ error: "Failed to add user" });
    }
});
exports.addUser = addUser;
//update user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName, dob, address, mobile } = req.body;
        const sql = schema_1.default.updateUserQuery.updateUser;
        const values = [firstName, lastName, dob, address, mobile, id];
        const result = yield db_1.default.query(sql, values);
        if (result.affectedRows === 0) {
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
//delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sql = schema_1.default.deleteUserQuery.deleteUser;
        const result = yield db_1.default.query(sql, [id]);
        if (result.affectedRows === 0) {
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
//search, sort, pagenation
// export const pagenation = async (req: Request, res: Response) => {
//   try {
//     const searchTerm = (req.query.term as string) || "";
//     const sortBy = (req.query.sortBy as string) || "firstName";
//     const order = req.query.order === "desc" ? "DESC" : "ASC";
//     const page = parseInt(req.query.page as string) || 1;
//     const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
//     const offset = (page - 1) * itemsPerPage;
//     if (isNaN(page) || page < 1) {
//       return res.status(400).json({ error: "Invalid page parameter" });
//     }
//     if (isNaN(itemsPerPage) || itemsPerPage < 1) {
//       return res.status(400).json({ error: "Invalid itemsPerPage parameter" });
//     }
//     const validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
//     if (!validSortBy.includes(sortBy)) {
//       return res.status(400).json({ error: "Invalid sortBy parameter" });
//     }
//     const validOrder = ["ASC", "DESC"];
//     if (!validOrder.includes(order)) {
//       return res.status(400).json({ error: "Invalid order parameter" });
//     }
//     const searchCondition = queries.pagenationQuery.searchCondition(searchTerm);
//     const searchParams = searchTerm
//       ? [
//           `%${searchTerm}%`,
//           `%${searchTerm}%`,
//           `%${searchTerm}%`,
//           `%${searchTerm}%`,
//           `%${searchTerm}%`,
//         ]
//       : [];
//     const tableQuery = queries.pagenationQuery.tableQuery(
//       searchCondition,
//       sortBy,
//       order
//     );
//     const countSql = queries.pagenationQuery.countQuery(searchCondition);
//     const [results] = await db.query<User[]>(tableQuery, [
//       ...searchParams,
//       itemsPerPage,
//       offset,
//     ]);
//     const [countResults] = await db.query<CountResult[]>(
//       countSql,
//       searchParams
//     );
//     const totalItems = countResults[0].total;
//     res.setHeader("X-Total-Count", totalItems.toString());
//     res.json(results);
//   } catch (error) {
//     console.error("Unexpected error", error);
//     res.status(500).json({ error: "Unexpected error occurred" });
//   }
// };
exports.default = { getUser: exports.getUser, addUser: exports.addUser, updateUser: exports.updateUser, deleteUser: exports.deleteUser };
