import { Client } from 'pg';

async function query(objectQuery) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  const res = await client.query(objectQuery);
  await client.end();
  return res;
}

const database = {
  query
};
export default database;