import crypto from "node:crypto";
import database from "infra/database.js";
import { UnauthorizedError } from "infra/erros.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 Days

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const result = await database.query({
      text: `INSERT INTO session
            (token, user_id, expires_at)
                VALUES ($1, $2, $3)
                RETURNING *;`,
      values: [token, userId, expiresAt],
    });
    return result.rows[0];
  }
}
async function findOneValidByToken(token) {
  const sessionFound = await runInsertQuery(token);
  return sessionFound;

  async function runInsertQuery(sessionToken) {
    const result = await database.query({
      text: `
            SELECT 
              *
            FROM
              session
            WHERE
              token = $1
            AND
              expires_at > NOW()
            LIMIT 1
      ;`,
      values: [sessionToken],
    });
    if (result.rowCount === 0) {
      throw new UnauthorizedError({
        message: "Usuario não possui sessão ativa.",
        action: "Verifique se o username esta logado e tente novamente.",
      })
    }
    return result.rows[0];
  }
}

async function renew(sessionId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const renewSessionObject = await runUpdateQuery(sessionId, expiresAt);
  return renewSessionObject;

  async function runUpdateQuery(sessionId, expiredAt) {
    const result = await database.query({
      text: `
        UPDATE session
        set
          expires_at = $2,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *;`,
      values: [sessionId, expiredAt]
    });
    return result.rows[0];
  }
}

const session = {
  create,
  findOneValidByToken,
  renew,
  EXPIRATION_IN_MILLISECONDS,
};

export default session;
