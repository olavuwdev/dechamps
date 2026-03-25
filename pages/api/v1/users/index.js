import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
const router = createRouter();

router.post(postHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);
  return response.status(201).json(newUser);
}

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
