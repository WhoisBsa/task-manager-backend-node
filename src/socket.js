import { getCacheValue, setCacheValue } from './db/redis.js';
import { createTask, getAllTasks } from './db/tasks/tasks.js';

const startWebSocketServer = (io) => {
  io.on('connection', (socket) => {
    console.log('WebSocket connection established');
    socket.send('Connection established successfully.');

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

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected.');
    });

    socket.on('get_tasks', async (callback) => {
      try {
        console.time()
        console.log('Fetching tasks');

        const cachedResults = await getCacheValue('all_tasks')

        let tasks = [];

        console.log(tasks.length, cachedResults?.length)

        if (cachedResults) {
          tasks = cachedResults;
        } else {
          tasks = await getAllTasks();
          await setCacheValue('all_tasks', tasks);
        }

        socket.emit('tasks', tasks)

        console.log(tasks.length, cachedResults?.length)

        console.timeEnd();
        callback(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        callback({ error: 'Failed to fetch tasks' });
      }
    });

    socket.on('create_task', async (newTask) => {
      try {
        console.log('Creating task:', newTask);
        await createTask(newTask);

        const tasks = await getAllTasks();
        await setRedisItem('all_tasks', tasks);

        io.emit('tasks', tasks);
      } catch (error) {
        console.error('Error inserting task:', error);
      }
    });
  });
};

export default startWebSocketServer;
