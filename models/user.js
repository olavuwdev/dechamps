import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/erros.js";
import password from "models/password.js";

async function create(userInputValues) {
  await validationUniqueUsername(userInputValues.username);
  await validationUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `INSERT INTO users 
            (username, email, password)
                VALUES ($1, $2, $3)
                RETURNING *;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return result.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);
  console.log("UserInputValues", userInputValues);
  if("username" in userInputValues) {
    await validationUniqueUsername(userInputValues.username);
  }
  if("email" in userInputValues) {
    await validationUniqueEmail(userInputValues.email);
  }

}

async function findOneByUsername(username) {
  const user = await runSelectQuery(username);
  return user;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
        SELECT 
            *
        FROM users
            WHERE LOWER(username) = LOWER($1)
        LIMIT 1;
            `,
      values: [username],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username digitado esta correto.",
      });
    }
    return results.rows[0];
  }
}
async function validationUniqueEmail(email) {
  const results = await database.query({
    text: `
        SELECT 
            email
        FROM users
        WHERE LOWER(email) = LOWER($1);`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "Email informado já está sendo utilzado.",
      action: "Utilize outro email e tente novamente.",
    });
  }
}
async function validationUniqueUsername(username) {
  const results = await database.query({
    text: `
        SELECT 
            username
        FROM users
        WHERE LOWER(username) = LOWER($1);`,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "Username informado já está sendo utilzado.",
      action: "Utilize outro username e tente novamente.",
    });
  }
}
async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}



const user = {
  create,
  findOneByUsername,
  update,
};

export default user;
