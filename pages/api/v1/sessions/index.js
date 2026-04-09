import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import autentication from "models/autentication.js";
const router = createRouter();

router.post(postHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const autenticatedUser = await autentication.authUser(
    userInputValues.email,
    userInputValues.password,
  );

  return response.status(201).json({});
}

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
