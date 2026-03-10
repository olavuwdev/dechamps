import retry from "async-retry";
import database from "infra/database";

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

async function cleanDatabaseProcess(){
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}
const orchestractor = {
  waitForAllProcess,
  cleanDatabaseProcess
};

export default orchestractor;
