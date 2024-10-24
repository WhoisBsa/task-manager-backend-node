import pkg from 'pg';

const { Pool } = pkg;

async function connect() {
  if (global.connection)
    return global.connection.connect();

  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

  global.connection = pool;
  return pool.connect();
}

const executeQuery = async (query, params = []) => {
  const connection = await connect();

  try {
    const result = await connection.query(query, params);
    return result;
  } catch (error) {
    console.error('Error when executing query: ', error);
    throw error;
  } finally {
    connection.release();
  }
};

export { executeQuery };

