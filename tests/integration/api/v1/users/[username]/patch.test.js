import { version as uuidVersion } from "uuid";
import orchestractor from "tests/orchestractor";

beforeAll(async () => {
  await orchestractor.waitForAllProcess();
  await orchestractor.cleanDatabaseProcess();
  await orchestractor.runPendingMigrations();
});

describe("PATCH '/api/v1/users/[username]'", () => {
  describe("Anonymous user", () => {
    test("With noexisting `username`:", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
        {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "John Doe",
              email: "john.doe@example.com"
            })
          }
      );
      expect(response.status).toBe(404);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username digitado esta correto.",
        status_code: 404,
      });
    });
    test("With duplicated `username`:", async () => {
      const user1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@curso",
          password: "senha123",
        }),
      });
      expect(user1.status).toBe(201);

      const user2 = await fetch("http://localhost:3000/api/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@curso",
          password: "senha123",
        }),
      });
      expect(user2.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1"
        }),
      });
      expect(response.status).toBe(400);
      const responseBody2 = await response.json();
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Username informado já está sendo utilzado.",
        action: "Utilize outro username e tente novamente.",
        status_code: 400,
      });
    });
    test("With duplicated `email`:", async () => {
      const email1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email1",
          email: "email1@curso",
          password: "senha123",
        }),
      });
      expect(email1.status).toBe(201);

      const email2 = await fetch("http://localhost:3000/api/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email2",
          email: "email2@curso",
          password: "senha123",
        }),
      });
      expect(email2.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/email2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email1@curso"
        }),
      });
      expect(response.status).toBe(400);
      const responseBody2 = await response.json();
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Email informado já está sendo utilzado.",
        action: "Utilize outro email e tente novamente.",
        status_code: 400,
      });
    });
  });
  
});
