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

        const newTask = await taskModel.create({ text });
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskModel.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}