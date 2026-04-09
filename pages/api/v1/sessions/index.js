import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import session from "models/session.js";
import autentication from "models/autentication.js";
const router = createRouter();

router.post(postHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const autenticatedUser = await autentication.authUser(
    userInputValues.email,
    userInputValues.password,
  );

  const userSession = await session.create(autenticatedUser.id);

  return response.status(201).json(userSession);
}

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
