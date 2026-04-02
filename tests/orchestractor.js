import retry from "async-retry";
import database from "infra/database.js";
import migrator from "models/migrator.js";
import user from "models/user.js";
import { faker } from "@faker-js/faker";

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

async function createUser(objectUser) {
  const newUser = await user.create({
    username:
      objectUser.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: objectUser.email || faker.internet.email(),
    password: objectUser.password || "validpassword",
  });
  return newUser;
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}
const orchestractor = {
  waitForAllProcess,
  cleanDatabaseProcess,
  runPendingMigrations,
  createUser,
};

export default orchestractor;
