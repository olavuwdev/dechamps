import retry from "async-retry";

async function waitForAllProcess() {
  await waitForWebServer();
  async function waitForWebServer() {
    await retry(checkServer, {
      retries: 50,
      maxTimeout: 1000,
    });

    async function checkServer() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if(response.status != 200){
        throw Error();
      }
    }
  }
}

export default {
  waitForAllProcess,
};
