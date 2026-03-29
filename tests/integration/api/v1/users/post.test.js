import { version as uuidVersion } from "uuid";
import orchestractor from "tests/orchestractor";
import password from "models/password";
import user from "models/user";

beforeAll(async () => {
  await orchestractor.waitForAllProcess();
  await orchestractor.cleanDatabaseProcess();
  await orchestractor.runPendingMigrations();
});

describe("POST '/api/v1/users'", () => {
  describe("Anonymous user", () => {
    test("With unique and valid date:", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "olavuwdev",
          email: "ollavoadriel@curso",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(201);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "olavuwdev",
        email: "ollavoadriel@curso",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("olavuwdev");
      const correctPasswordMatch = await password.compare("senha123", userInDatabase.password);
      const incorrectPasswordMatch = await password.compare("SenhaErrada", userInDatabase.password);

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated `email`:", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "devAmbu",
          email: "duplicado@curso",
          password: "senha123",
        }),
      });
      expect(response1.status).toBe(201);
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "devNinja",
          email: "Duplicado@curso",
          password: "senha123",
        }),
      });
      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Email informado já está sendo utilzado.",
        action: "Utilize outro email e tente novamente.",
        status_code: 400,
      });
    });
    test("With duplicated `username`:", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "userDuplicated",
          email: "olavo@curso",
          password: "senha123",
        }),
      });
      expect(response1.status).toBe(201);
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "userDuplicated",
          email: "adriel@curso",
          password: "senha123",
        }),
      });
      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Username informado já está sendo utilzado.",
        action: "Utilize outro username e tente novamente.",
        status_code: 400,
      });
    });
  });
});
