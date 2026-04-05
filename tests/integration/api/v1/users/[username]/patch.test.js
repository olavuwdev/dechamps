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
            email: "john.doe@example.com",
          }),
        },
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
      await orchestractor.createUser({
        username: "user1",
      });

      await orchestractor.createUser({
        username: "user2",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
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
      await orchestractor.createUser({
        email: "email1@curso",
      });
      const createUser2 = await orchestractor.createUser({
        email: "email2@curso",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "email1@curso",
          }),
        },
      );
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
      const createUser1 = await orchestractor.createUser({
        username: "userUpdate1",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "userUpdate2",
          }),
        },
      );
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "userUpdate2",
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
    test("With unique `email`:", async () => {
      const createUser1 = await orchestractor.createUser({
        email: "emailUpdate1@curso",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "emailUpdate2@curso",
          }),
        },
      );
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: createUser1.username,
        email: "emailUpdate2@curso",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
    test("With new `password`:", async () => {
      const newPassword1 = await orchestractor.createUser({
        password: "senha123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${newPassword1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "novaSenha123",
          }),
        },
      );
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: newPassword1.username,
        email: newPassword1.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDatabase = await user.findOneByUsername(
        newPassword1.username,
      );
      const correctPasswordMatch = await password.compare(
        "novaSenha123",
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "senha123",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
