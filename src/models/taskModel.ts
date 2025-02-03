import { Document, model, ObjectId, Schema } from "mongoose";

interface ITask extends Document {
    text: string;
    userId: string;
    createdAt: Date;
}

const taskSchema = new Schema<ITask>({
    text: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default model<ITask>("task", taskSchema);