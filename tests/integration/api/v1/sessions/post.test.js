import { version as uuidVersion } from "uuid";
import orchestractor from "tests/orchestractor";
import session from "models/session.js";

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
    test("With incorrect email and incorrect password:", async () => {
      await orchestractor.createUser({});

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
    test("With correct email and correct password:", async () => {
      const createdUser = await orchestractor.createUser({
        email: "emailcorreto@curso.com",
        password: "senhaCorreta",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "emailcorreto@curso.com",
          password: "senhaCorreta",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: createdUser.id,
        token: responseBody.token,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const expiresAtaTime = new Date(responseBody.expires_at);
      const createAtaTime = new Date(responseBody.created_at);

      expiresAtaTime.setMilliseconds(0);
      createAtaTime.setMilliseconds(0);

      expect(expiresAtaTime - createAtaTime).toBe(session.EXPIRATION_IN_MILLISECONDS);


    });
  });
});
