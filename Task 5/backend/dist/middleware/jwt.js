"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createTokens = (user) => {
    const accessToken = (0, jsonwebtoken_1.sign)({ username: user.username, id: user.id, isAdmin: user.isAdmin }, "seceretKey");
    return accessToken;
};
exports.createTokens = createTokens;
