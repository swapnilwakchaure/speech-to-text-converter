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
exports.loginController = exports.registerController = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const oldUser = yield userModel_1.default.findOne({ email });
        if (oldUser) {
            res.status(400).json({ message: `${oldUser.name} already exists, please sign in` });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = new userModel_1.default({
            name, email, password: hashPassword
        });
        yield newUser.save();
        res.status(200).json({ message: `${name} registration successful, please login`, status: "success" });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const oldUser = yield userModel_1.default.findOne({ email });
        if (!oldUser) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, oldUser === null || oldUser === void 0 ? void 0 : oldUser.password);
        if (!isMatch) {
            res.status(401).json({ message: `${oldUser.name} password doesn't match` });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: oldUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: `${oldUser.name} login successful`, user: oldUser.name, userId: oldUser._id, token });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.loginController = loginController;
