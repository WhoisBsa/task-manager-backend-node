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

  //apenas testando a conexão
  const client = await pool.connect();
  console.log("Criou pool de conexões no PostgreSQL!");

  const res = await client.query('SELECT NOW()');
  console.log(res.rows[0]);
  client.release();

  //guardando para usar sempre o mesmo
  global.connection = pool;
  return pool.connect();
}

const getAll = async () => {
  const connection = await connect();

  const res = await connection.query('SELECT * FROM logins');
  console.log(res);
  return res.rows;
};

export { getAll };
