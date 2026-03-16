import { InternalServerError, MethodNotAllowedError } from "infra/erros";
function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.log("Erro dentro do catch do next-connect: ");
  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();

  return response
    .status(publicErrorObject.statusCode)
    .json(publicErrorObject)
    .end();
}
const controller = {
  onNoMatchHandler,
  onErrorHandler,
};
export default controller;
