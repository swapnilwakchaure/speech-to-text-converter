"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.connection = mongoose_1.default.connect(process.env.MONGODB_URI || "")
    .then(() => console.log("Connected to the MongoDB database."))
    .catch((error) => console.log("MongoDB connection error: ", error));
