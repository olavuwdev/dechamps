import { version as uuidVersion } from "uuid";
import orchestractor from "tests/orchestractor";

beforeAll(async () => {
  await orchestractor.waitForAllProcess();
  await orchestractor.cleanDatabaseProcess();
  await orchestractor.runPendingMigrations();
});

describe("GET '/api/v1/users/[username]'", () => {
  describe("Anonymous user", () => {
    test("With exact case match:", async () => {
      

      await orchestractor.createUser({
        username: "MesmoCase",
        email: "ollavoadriel@curso",
        password: "senha123",
      });
      
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );
      expect(response2.status).toBe(200);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "MesmoCase",
        email: "ollavoadriel@curso",
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });

      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });
    test("With exact case mismatch:", async () => {
      
      await orchestractor.createUser({
        username: "CaseDiferente",
        email: "case.diferente@curso",
        password: "senha123",
      });
      
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/caseDiferente",
      );
      expect(response2.status).toBe(200);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "CaseDiferente",
        email: "case.diferente@curso",
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });

      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });
    test("With noexisting `username`:", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username digitado esta correto.",
        status_code: 404,
      });
    });
  });
});
