import { getAll } from './db.js';

const startWebSocketServer = (io) => {
  io.on('connection', (socket) => {
    console.log('WebSocket connection established');

    let previousId;
    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
      previousId = currentId;
    };

    socket.on('message', (message) => {
      console.log(`Message received: ${message}`);

      socket.send('Message received successfully.');
    });

    socket.on('close', () => {
      console.log('Closed WebSocket connection.');
    });

    socket.send('Connection established successfully.');

    socket.on('get_tasks', async (callback) => {
      try {
        const tasks = await getAll();
        callback(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        callback({ error: 'Failed to fetch tasks' });
      }
    });
  });
};

export default startWebSocketServer;
