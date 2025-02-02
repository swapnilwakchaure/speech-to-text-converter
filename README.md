Assignment Title: "Voice-based Task Manager"

Objective: Build a small MERN stack application where users can add tasks by speaking. The app will use the Deepgram API for speech-to-text conversion and store the tasks in MongoDB.

Assignment Requirements
Frontend:
1. Build a React.js frontend with the following features:
2. A button to record audio (using the browser's built-in microphone).
3. Display a list of tasks fetched from the backend.

Backend:
1. Use Node.js and Express.js to handle:
2. Audio file upload from the frontend.
3. Integration with the Deepgram API to transcribe the speech into text.
4. Storing the task (transcribed text) in MongoDB.
5. Fetching all tasks stored in the database and returning them to the frontend.

Database:
1. Use MongoDB to store:
2. Task text (e.g., “Buy groceries”)
3. Timestamp when the task was created.

Integration:
1. The audio recording from the frontend should be sent to the backend.
2. The backend should send the audio to the Deepgram API for transcription and return the task text to the frontend.

Technology:
1. Frontend: React JS, TypeScript, Vite, Yarn
2. Backend: Node JS, Express JS, TypeScript, Yarn
3. Database: MongoDB

### Start the project
mkdir voice-task-manager-backend
cd voice-task-manager-backend
yarn init -y
yarn add express mongoose cors dotenv multer
yarn add -D @deepgram/sdk typescript @types/express @types/cors @types/multer @types/node ts-node-dev