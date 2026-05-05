import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import session from "models/session.js";
const router = createRouter();

router.get(getHandler);

async function getHandler(request, response) {
    const sessionId = request.cookies.session_id;
    const sessionObject = await session.findOneValidByToken(sessionId);
    const renewedSessionObject = await session.renew(sessionObject.id);
    await controller.setSessionCookie(renewedSessionObject.token, response);
    const objectUser = await user.findById(sessionObject.user_id);

    return response.status(200).json(objectUser);
}

export default router.handler({
    onNoMatch: controller.onNoMatchHandler,
    onError: controller.onErrorHandler,
});
