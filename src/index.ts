import cors from "cors";
import morgan from "morgan";
import express from "express";
import dotenv from "dotenv";
import { connection } from "./config/db";
import router from "./routes/index";
dotenv.config();

const port = process.env.port || 3030;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

app.get("/test", (req, res) => {
    res.status(200).send("server connected");
});

app.use("/api", router);

app.listen(port, async () => {
    try {
        await connection;
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error("Server connection error: ", error);
    }
});