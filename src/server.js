import { configDotenv } from "dotenv";
import express from 'express';
import http from "http";
import { Server } from 'socket.io';
import { getAll } from "./db.js";
import startWebSocketServer from "./socket.js";

configDotenv();

const app = express();
const apiRouter = express.Router();
const PORT = process.env?.PORT || 3000;

app.use(express.json());

apiRouter.get('/all', async (req, res) => {
  try {
    const tasks = await getAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.use('/api', apiRouter);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server now listen on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8080", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

startWebSocketServer(io);
