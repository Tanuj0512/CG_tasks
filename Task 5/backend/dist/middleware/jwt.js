"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
    console.log('Received Access Token:', accessToken);
    if (!accessToken) {
        res.status(401).json({ error: "Access token not provided" });
        return;
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(accessToken, "secretKey");
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("Error verifying token:", err);
        res.clearCookie("access-token");
        res.status(403).json({ error: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
const createTokens = (user) => {
    const accessToken = (0, jsonwebtoken_1.sign)({ username: user.username, id: user.id, isAdmin: user.isAdmin }, "secretKey");
    return accessToken;
};
exports.createTokens = createTokens;
