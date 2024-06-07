import { Pool } from 'pg';

const pool = new Pool({
  host:       process.env.POSTGRES_HOST,
  user:       process.env.POSTGRES_USER,
  database:   process.env.POSTGRES_DB,
  password:   process.env.POSTGRES_PASSWORD,
  port:       process.env.POSTGRES_PORT,
});