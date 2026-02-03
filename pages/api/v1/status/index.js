import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersion = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersion.rows[0].server_version;

  const databaseMaxConnectionResult = await database.query("SHOW max_connections;");
  const databaseMaxConnectionsValue = databaseMaxConnectionResult.rows[0].max_connections

  const databaseOpennedConnections = 
  await database.query("SELECT count(*)::int FROM pg_stat_activity where datname = 'local_db' ;");
  const databaseOpennedConnectionsValue = databaseOpennedConnections.rows[0].count;
  console.log(databaseOpennedConnectionsValue)
  response.status(200).json({
    updated_at: updatedAt,
    dependencies:{
      database:{
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        oppened_connections: databaseOpennedConnectionsValue
      }
    }
  });
}

export default status;