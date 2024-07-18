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
exports.showImages = exports.uploadFiles = exports.pagination = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany();
        res.status(200).json(users);
    }
    catch (err) {
        console.log("Error fetching users: ", err);
        res.status(424).json({ error: "Failed to fetch users" });
    }
});
exports.getUser = getUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, dob, address, mobile } = req.body;
    try {
        const newUser = yield prisma.users.create({
            data: {
                firstName,
                lastName,
                dob: new Date(dob),
                address,
                mobile,
            },
        });
        res.status(200).json({ message: "User added successfully", user: newUser });
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
        const existingUser = yield prisma.users.findUnique({
            where: { id: Number(id) },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = yield prisma.users.update({
            where: { id: Number(id) },
            data: {
                firstName,
                lastName,
                dob: new Date(dob),
                address,
                mobile,
            },
        });
        res.json(updatedUser);
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
        const userExist = yield prisma.users.findUnique({
            where: { id: Number(id) },
        });
        if (!userExist) {
            return res.status(404).json({ error: "User not found" });
        }
        const deletedUser = yield prisma.users.delete({
            where: { id: Number(id) },
        });
        res.json({ deletedUser });
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
        const order = req.query.order === "desc" ? "desc" : "asc";
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const offset = (page - 1) * itemsPerPage;
        if (isNaN(page) || page < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }
        const validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
        if (!validSortBy.includes(sortBy) || !["asc", "desc"].includes(order)) {
            return res.status(400).json({ error: "Invalid sort parameters" });
        }
        const searchCondition = searchTerm ? {
            OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { address: { contains: searchTerm, mode: 'insensitive' } }
            ]
        } : {};
        const [results, count] = yield Promise.all([
            prisma.users.findMany({
                where: searchCondition,
                orderBy: { [sortBy]: order },
                skip: offset,
                take: itemsPerPage,
            }),
            prisma.users.count({
                where: searchCondition,
            }),
        ]);
        res.setHeader("X-Total-Count", count.toString());
        res.json(results);
    }
    catch (error) {
        console.error("Unexpected error", error);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});
exports.pagination = pagination;
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }
    try {
        const user = yield prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const uploadFiles = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.images.create({
                data: {
                    image_path: file.path,
                    users: { connect: { id: userId } },
                },
            });
        }));
        yield Promise.all(uploadFiles);
        res.status(200).json({ message: "Files uploaded successfully" });
    }
    catch (err) {
        console.error("Error uploading files:", err);
        res.status(500).json({ error: "Failed to upload files" });
    }
});
exports.uploadFiles = uploadFiles;
const showImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const userName = (_b = req.user) === null || _b === void 0 ? void 0 : _b.username;
    try {
        const images = yield prisma.images.findMany({
            where: { user_id: userId },
            select: { id: true, image_path: true },
        });
        if (!images || images.length === 0) {
            return res.status(404).json({ error: "No images found for the user" });
        }
        const apiRoute = "http://localhost:3010/uploads/";
        const imagePaths = images.map((image) => ({
            fileId: image.id,
            filePath: image.image_path ? apiRoute + path_1.default.basename(image.image_path) : null,
        }));
        res.json({
            user_id: userId,
            userName: userName,
            files: { imagePaths },
        });
    }
    catch (err) {
        console.error("Error fetching images:", err);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});
exports.showImages = showImages;
