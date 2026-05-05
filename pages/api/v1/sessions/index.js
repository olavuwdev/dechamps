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
  controller.setSessionCookie(NewSession.token, response);

  return response.status(201).json(NewSession);
}

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
