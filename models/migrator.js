import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

const defaultMigrations = {
  dryRun: true,
  dir: join("infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrations,
      dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}
async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrations,
      dryRun: false,
      dbClient,
    });

    return migratedMigrations;
  } finally {
    await dbClient.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
