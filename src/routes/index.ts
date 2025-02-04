import { Router } from "express";
import { createTaskFromAudio, deleteTask, getAllTasks, upload } from "../controllers/taskController";
import { loginController, registerController } from "../controllers/userController";

const router = Router();

router.post("/signup", registerController);
router.post("/signin", loginController);

router.post("/tasks/audio", upload.single("audio"), createTaskFromAudio);
router.get("/tasks", getAllTasks);
router.delete("/delete/:id", deleteTask);

export default router;