import database from "infra/database.js";
//EndPoint: /api/v1/status
async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseName = process.env.POSTGRES_DB;

  const databaseVersion = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersion.rows[0].server_version;

  const databaseMaxConnectionResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionResult.rows[0].max_connections;

  const databaseOpennedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity where datname = $1;",
    values: [databaseName],
  });
  const databaseOpennedConnectionsValue =
    databaseOpennedConnections.rows[0].count;
  console.log(databaseOpennedConnectionsValue);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        oppened_connections: parseInt(databaseOpennedConnectionsValue),
      },
    },
  });
}

export default status;
