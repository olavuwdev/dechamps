import { version as uuidVersion } from "uuid";
import orchestractor from "tests/orchestractor";
import password from "models/password";
import user from "models/user";

beforeAll(async () => {
  await orchestractor.waitForAllProcess();
  await orchestractor.cleanDatabaseProcess();
  await orchestractor.runPendingMigrations();
});

describe("POST '/api/v1/sessions'", () => {
  describe("Anonymous user", () => {
    test("With incorrect email but correct password:", async () => {
      await orchestractor.createUser({
        password: "senhaCorreta",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.incorreto@curso.com",
          password: "senhaCorreta",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se o email e senha digitados estão corretos.",
        status_code: 401,
      });
    });
    test("With correct email but incorrect password:", async () => {
      await orchestractor.createUser({
        email: "email.correto@curso.com",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.correto@curso.com",
          password: "senhaIncorreta",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se o email e senha digitados estão corretos.",
        status_code: 401,
      });
    });
    test("With incorrect email but incorrect password:", async () => {
      await orchestractor.createUser({
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.incorreto@curso.com",
          password: "senhaIncorreta",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se o email e senha digitados estão corretos.",
        status_code: 401,
      });
    });
  });
});
