import retry from "async-retry";


async function waitForAllProcess() {
  await waitForWebServer();
  async function waitForWebServer() {
    await retry(checkServer, {
      retries: 100,
    })

    async function checkServer() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();
    }
  }
}

export default {
  waitForAllProcess
};