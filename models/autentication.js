import user from "models/user.js";
import password from "models/password.js";
import { UnauthorizedError, NotFoundError } from "infra/erros.js";

async function authUser(providerEmail, providerPassword) {
  try {
    const storedUser = await findUserByEmail(providerEmail);
    await validatePassword(providerPassword, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se o email e senha digitados estão corretos.",
      });
    }
    throw error;
  }

  async function findUserByEmail(email) {
    let storedUser;
    try {
      storedUser = await user.findOneByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Dados de autenticação não conferem.",
          action: "Verifique se o email e senha digitados estão corretos.",
        });
      }
      throw error;
    }
    return storedUser;
  }
  async function validatePassword(providedPassword, storedPassword) {
    const passwordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );
    if (!passwordMatch) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se o email e senha digitados estão corretos.",
      });
    }
  }
}

const autentication = {
  authUser,
};

export default autentication;
