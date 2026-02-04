import { Client } from 'pg';

async function query(objectQuery) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.POSTGRES_SSLMODE === 'require' ? { rejectUnauthorized: false } : false
  });
  try {
    await client.connect();
    const res = await client.query(objectQuery);
    return res;
  } catch (erro) {
    console.error("Database query error:", erro);
  } finally {
    await client.end();
  }
}

const database = {
  query
};
export default database;