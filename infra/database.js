import { Client } from "pg";

async function query(objectQuery) {
  let client;

  try {
    client = await getNewClient();
    const res = await client.query(objectQuery);
    return res;
  } catch (erro) {
    console.log("Erro ao conectar no database.js:")
    console.error(erro);
    throw error;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};
export default database;
function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      rejectUnauthorized: false,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
