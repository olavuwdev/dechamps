import database from "infra/database";
import orchestractor from "tests/orchestractor";
beforeAll(async () => {
  await orchestractor.waitForAllProcess();
  await orchestractor.cleanDatabaseProcess();
}); //Antes de Tudo rode a função cleanDatabase para limpar o banco de dados


describe("GET '/api/v1/migrations' ", () => {
  describe("Anonymous user", () => {
    test("Runnnig pending migrations ", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThanOrEqual(0);
    });
  });
});
