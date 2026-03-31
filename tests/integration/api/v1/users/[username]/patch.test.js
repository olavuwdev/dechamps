import orchestractor from "tests/orchestractor";
import password from "models/password";
import user from "models/user";

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
    //Testar atualizando o `username` de um usuario
    test("With unique `username`:", async () => {
      const userUpdate1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "userUpdate1",
          email: "userUpdate1@curso",
          password: "senha123",
        }),
      });
      expect(userUpdate1.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/userUpdate1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "userUpdate2"
        }),
      });
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "userUpdate2",
        email: "userUpdate1@curso",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
    test("With unique `email`:", async () => {
      const emailUpdate1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailUpdate1",
          email: "emailUpdate1@curso",
          password: "senha123",
        }),
      });
      expect(emailUpdate1.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/emailUpdate1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "emailUpdate2@curso"
        }),
      });
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "emailUpdate1",
        email: "emailUpdate2@curso",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
    test("With new `password`:", async () => {
      const newPassword1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "newPassword1",
          email: "newPassword1@curso",
          password: "senha123",
        }),
      });
      expect(newPassword1.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/newPassword1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "novaSenha123"
        }),
      });
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "newPassword1",
        email: "newPassword1@curso",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDatabase = await user.findOneByUsername("newPassword1");
      const correctPasswordMatch = await password.compare("novaSenha123", userInDatabase.password);
      const incorrectPasswordMatch = await password.compare("senha123", userInDatabase.password);

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
  
});
