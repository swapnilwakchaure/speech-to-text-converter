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
exports.deleteTask = exports.getAllTasks = exports.createTaskFromAudio = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sdk_1 = require("@deepgram/sdk");
const dotenv_1 = __importDefault(require("dotenv"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const stream_1 = require("stream");
dotenv_1.default.config();
const deepgram = (0, sdk_1.createClient)(process.env.DEEPGRAM_API_KEY);
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
const createTaskFromAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const audioFile = req.file;
        const { userId } = req.query;
        if (!audioFile) {
            res.status(400).json({ message: "No audio file uploaded." });
            return;
        }
        const audioStream = new stream_1.Readable({
            read() {
                this.push(audioFile.buffer);
                this.push(null);
            }
        });
        const { result, error } = yield deepgram.listen.prerecorded.transcribeFile(audioStream, {
            mimetype: audioFile.mimetype,
            model: "nova-2",
            smart_format: true
        });
        if (error)
            throw error;
        const text = (_c = (_b = (_a = result.results) === null || _a === void 0 ? void 0 : _a.channels[0]) === null || _b === void 0 ? void 0 : _b.alternatives[0]) === null || _c === void 0 ? void 0 : _c.transcript;
        if (text) {
            const newTask = yield taskModel_1.default.create({ text, userId });
            res.status(201).json(newTask);
            return;
        }
        else {
            res.status(401).json({ message: "Task is required", status: "error" });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createTaskFromAudio = createTaskFromAudio;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sortBy, userId } = req.query;
        let sortOrder = { createdAt: -1 };
        if (sortBy === 'asc') {
            sortOrder = { createdAt: 1 };
        }
        else if (sortBy === 'desc') {
            sortOrder = { createdAt: -1 };
        }
        const tasks = yield taskModel_1.default.find({ userId }).sort(sortOrder);
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllTasks = getAllTasks;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log({ id });
        const deletedTask = yield taskModel_1.default.findByIdAndDelete(id);
        if (!deletedTask) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.status(200).json({ message: "Task deleted successfully", status: "success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteTask = deleteTask;
