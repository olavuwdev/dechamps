import { Client } from 'pg';

async function query(objectQuery) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
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

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    }
  }
  return false;
}