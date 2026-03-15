class ValitationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function salvarUsuario(input) {
  if (!input) {
    throw new ReferenceError("é necessário fornecer um objeto de entrada.");
  }
  if (!input.name) {
    throw new ValitationError("Preencha o campo de nome.");
  }
  if (!input.username) {
    throw new ValitationError("Preencha o campo de nome de usuário.");
  }
  if (!input.age) {
    throw new ValitationError("Preencha o campo de idade.");
  }
}
try {
  salvarUsuario({
    name: "Olavo Adriel",
  });
} catch (error) {
  if (error instanceof ReferenceError) {
    throw error;
  }
  if (error instanceof ValitationError) {
    throw error;
  }
  console.error("Ocorreu um erro ao salvar o usuário:");
  console.error(error);
}
