"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const userSchema = Joi.object({
    firstName: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
        'string.base': `"First Name" should be a type of 'text'`,
        'string.empty': `"First Name" cannot be an empty field`,
        'string.min': `"First Name" should have a minimum length of 3`,
        'string.max': `"First Name" should have a maximum length of 30`,
        'any.required': `"First Name" is a required field`
    }),
    lastName: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
        'string.base': `"Last Name" should be a type of 'text'`,
        'string.empty': `"Last Name" cannot be an empty field`,
        'string.min': `"Last Name" should have a minimum length of 3`,
        'string.max': `"Last Name" should have a maximum length of 30 `,
        'any.required': `"Last Name" is a required field`
    }),
    dob: Joi.date()
        .required()
        .messages({
        'date.base': `"Date of Birth" should be a valid date`,
        'any.required': `"Date of Birth" is a required field`
    }),
});
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }
    next();
};
exports.default = validateUser;
