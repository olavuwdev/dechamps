import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator";

async function waitForAllProcess() {
  await waitForWebServer();
  async function waitForWebServer() {
    await retry(checkServer, {
      retries: 50,
      maxTimeout: 1000,
    });

    async function checkServer() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status != 200) {
        throw Error();
      }
    }
  }
}

async function cleanDatabaseProcess() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function runPendingMigrations(){
  await migrator.runPendingMigrations()
}
const orchestractor = {
  waitForAllProcess,
  cleanDatabaseProcess,
  runPendingMigrations
};

export default orchestractor;
