import { reduzirSimples, somar, textoCaminho } from './reduce.js';

/** Disposição exata do "jogo da velha" (p. 52). */
export const LAYOUT_QUADRO = Object.freeze([
  Object.freeze([3, 6, 9]),
  Object.freeze([2, 5, 8]),
  Object.freeze([1, 4, 7]),
]);

/** Só as linhas que a autora interpreta. A diagonal 3-5-7 não tem texto no livro. */
export const LINHAS_INTERPRETADAS = Object.freeze([
  { tipo: 'horizontal', numeros: [3, 6, 9] },
  { tipo: 'horizontal', numeros: [2, 5, 8] },
  { tipo: 'horizontal', numeros: [1, 4, 7] },
  { tipo: 'vertical', numeros: [3, 2, 1] },
  { tipo: 'vertical', numeros: [6, 5, 4] },
  { tipo: 'vertical', numeros: [9, 8, 7] },
  { tipo: 'diagonal', numeros: [1, 5, 9] },
]);

/** Algarismos da data original, sem zeros, como em 6.2.1950 → 6, 2, 1, 9, 5 (p. 52–53). */
export function digitosDaData({ dia, mes, ano }) {
  return `${dia}${mes}${ano}`.split('').map(Number).filter((d) => d !== 0);
}

export function calcularQuadro(data) {
  const digitos = digitosDaData(data);
  const contagem = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => [n, 0]));
  for (const digito of digitos) contagem[digito] += 1;
  const numeros = Object.keys(contagem).map(Number);
  const presentes = numeros.filter((n) => contagem[n] > 0);
  const soma = somar(digitos);
  const reducaoSoma = reduzirSimples(soma);
  return {
    digitos,
    contagem,
    presentes,
    ausentes: numeros.filter((n) => contagem[n] === 0),
    repetidos: numeros.filter((n) => contagem[n] > 1),
    celulas: LAYOUT_QUADRO.map((linha) =>
      linha.map((numero) => ({ numero, vezes: contagem[numero] })),
    ),
    linhasCompletas: LINHAS_INTERPRETADAS.filter((l) =>
      l.numeros.every((n) => contagem[n] > 0),
    ),
    soma,
    reducaoSoma,
    passos: [`${digitos.join(' + ')} = ${textoCaminho(reducaoSoma)}`],
    regra: 'R-QUADRO',
    paginas: 'p. 52–53',
  };
}
