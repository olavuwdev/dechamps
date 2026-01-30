const calculadora = require('../../models/calculadora.js');

test("Deve retornar 8 ao somar 4 e 4", () => {
  const resultado = calculadora.somar(4, 4);
  expect(resultado).toBe(8);
});