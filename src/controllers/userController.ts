import { Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const oldUser = await userModel.findOne({ email });

        if (oldUser) {
            res.status(400).json({ message: `${oldUser.name} already exists, please sign in` });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, password: hashPassword
        });

        await newUser.save();

        res.status(200).json({ message: `${name} registration successful, please login`, status: "success" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const oldUser = await userModel.findOne({ email });

        if (!oldUser) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, oldUser?.password);

        if (!isMatch) {
            res.status(401).json({ message: `${oldUser.name} password doesn't match` });
            return;
        }

        const token = jwt.sign({ userId: oldUser._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        res.status(200).json({ message: `${oldUser.name} login successful`, user: oldUser.name, userId: oldUser._id, token });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}