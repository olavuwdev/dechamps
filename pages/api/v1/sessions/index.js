import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import session from "models/session.js";
import autentication from "models/autentication.js";
import * as cookie from "cookie";
const router = createRouter();

router.post(postHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const autenticatedUser = await autentication.authUser(
    userInputValues.email,
    userInputValues.password,
  );

  const NewSession = await session.create(autenticatedUser.id);

  const setCookie = cookie.serialize("session_id", NewSession.token, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  response.setHeader("Set-Cookie", setCookie);

  return response.status(201).json(NewSession);
}

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
