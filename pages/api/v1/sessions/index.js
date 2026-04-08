import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
const router = createRouter();
import { UnauthorizedError } from "infra/erros.js";

router.post(postHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;
  try {
    const storedUser = await user.findOneByEmail(userInputValues.email);
    const passwordMatch = await user.comparePassword(
      userInputValues.password,
      storedUser.password,
    );

    if (!passwordMatch) {
      console.log("passou aqui");
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se o email e senha digitados estão corretos.",
      });
    }
  } catch (error) {
    throw new UnauthorizedError({
      message: "Dados de autenticação não conferem.",
      action: "Verifique se o email e senha digitados estão corretos.",
    });
  }
  return response.status(201).json({});
}

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
