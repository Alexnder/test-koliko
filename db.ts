import 'dotenv/config'
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  idleTimeoutMillis: 30000,
});

export default pool;