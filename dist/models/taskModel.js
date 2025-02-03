"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.default = (0, mongoose_1.model)("task", taskSchema);
