import { executeQuery } from '../db.js';

const getAllTasks = async () => {
  const res = await executeQuery('SELECT * FROM tasks');

  return res.rows;
};

const createTask = async (newTask) => {
  const sql = 'INSERT INTO TASKS (title, description, team_id, created_at) VALUES ($1, $2, $3, $4);';
  const values = ['task', newTask, 1, new Date()];
  
  return await executeQuery(sql, values);
};

export { createTask, getAllTasks };
