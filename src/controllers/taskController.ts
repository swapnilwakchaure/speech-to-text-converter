import { Request, Response } from "express";
import multer from "multer";
import { createClient } from "@deepgram/sdk";
import dotenv from "dotenv";
import taskModel from "../models/taskModel";
import { Readable } from "stream";
dotenv.config();

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const createTaskFromAudio = async (req: Request, res: Response) => {
    try {
        const audioFile = req.file;
        const { userId } = req.query;

        if (!audioFile) {
            res.status(400).json({ message: "No audio file uploaded." });
            return;
        }

        const audioStream = new Readable({
            read() {
                this.push(audioFile.buffer);
                this.push(null);
            }
        });

        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            audioStream,
            {
                mimetype: audioFile.mimetype!,
                model: "nova-2",
                smart_format: true
            }
        );

        if (error) throw error;

        const text = result.results?.channels[0]?.alternatives[0]?.transcript;

        if (text) {
            const newTask = await taskModel.create({ text, userId });
            res.status(201).json(newTask);
            return;
        } else {
            res.status(401).json({ message: "Task is required", status: "error" });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const { sortBy, userId } = req.query;

        let sortOrder: Record<string, 1 | -1> = { createdAt: -1 };

        if (sortBy === 'asc') {
            sortOrder = { createdAt: 1 };
        } else if (sortBy === 'desc') {
            sortOrder = { createdAt: -1 };
        }

        const tasks = await taskModel.find({ userId }).sort(sortOrder);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log({ id });

        const deletedTask = await taskModel.findByIdAndDelete(id);

        if (!deletedTask) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        res.status(200).json({ message: "Task deleted successfully", status: "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}