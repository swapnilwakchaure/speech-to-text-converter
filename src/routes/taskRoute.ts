import { Router } from "express";
import { createTaskFromAudio, getAllTasks, upload } from "../controllers/taskController";

const router = Router();

router.post("/tasks/audio", upload.single("audio"), createTaskFromAudio);
router.get("/tasks", getAllTasks);

export default router;