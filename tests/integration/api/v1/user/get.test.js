import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";
import orchestractor from "tests/orchestractor";
import session from "models/session.js";

beforeAll(async () => {
  await orchestractor.waitForAllProcess();
  await orchestractor.cleanDatabaseProcess();
  await orchestractor.runPendingMigrations();
});

describe("GET '/api/v1/user'", () => {
  describe("Anonymous user", () => {
    test("With valid session:", async () => {
      const createUserResponse = await orchestractor.createUser({
        username: "userWithValidSessions"
      });

      const sessionObject = await orchestractor.createSession(createUserResponse.id);
      const response2 = await fetch(
        "http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`
        }
      }
      );
      expect(response2.status).toBe(200);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        id: createUserResponse.id,
        username: "userWithValidSessions",
        email: createUserResponse.email,
        password: createUserResponse.password,
        created_at: createUserResponse.created_at.toISOString(),
        updated_at: createUserResponse.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();

      const renewObjectSession = await session.findOneValidByToken(sessionObject.token);
      expect(renewObjectSession.expires_at > sessionObject.expires_at,).toEqual(true);
      expect(renewObjectSession.updated_at > sessionObject.updated_at,).toEqual(true);

      const setCookieHeader = setCookieParser(response2, {
        map: true,
      });
      expect(setCookieHeader.session_id).toEqual({
        name: "session_id",
        value: renewObjectSession.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });

    });
    test.only("With close to expiring session:", async () => {
      const createUserResponse = await orchestractor.createUser({
        username: "userWithValidSessions"
      });

      jest.useFakeTimers(
        {
          now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS + 5000),
        }
      )
      const sessionObject = await orchestractor.createSession(createUserResponse.id);
      const response2 = await fetch(
        "http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`
        }
      }
      );
      jest.useRealTimers();
      expect(response2.status).toBe(200);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        id: createUserResponse.id,
        username: "userWithValidSessions",
        email: createUserResponse.email,
        password: createUserResponse.password,
        created_at: createUserResponse.created_at.toISOString(),
        updated_at: createUserResponse.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();

      const renewObjectSession = await session.findOneValidByToken(sessionObject.token);
      expect(renewObjectSession.expires_at > sessionObject.expires_at,).toEqual(true);
      expect(renewObjectSession.updated_at > sessionObject.updated_at,).toEqual(true);

      const setCookieHeader = setCookieParser(response2, {
        map: true,
      });
      expect(setCookieHeader.session_id).toEqual({
        name: "session_id",
        value: renewObjectSession.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });

    });
    test("With expired session:", async () => {

      jest.useFakeTimers(
        {
          now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
        }
      )
      const createUserResponse = await orchestractor.createUser({
        username: "userWithExpiredSessions"
      });

      const sessionObject = await orchestractor.createSession(createUserResponse.id);
      const response = await fetch(
        "http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`
        }
      }
      );
      jest.useRealTimers();
      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuario não possui sessão ativa.",
        action: "Verifique se o username esta logado e tente novamente.",
        status_code: 401,
      });
    });
    test("With no exist session:", async () => {
      const sessionToken = "5cedf9b7099f7f67d9d496261dac360bc4750278d5b5a8319d7f5999dc6bbfeeadb1f2224fb698bc3c593d3915592508";
      const response = await fetch(
        "http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionToken}`
        }
      }
      );
      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuario não possui sessão ativa.",
        action: "Verifique se o username esta logado e tente novamente.",
        status_code: 401,
      });
    });
  });
});
