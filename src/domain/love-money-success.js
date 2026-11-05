import { exibicao, reduzirComMestres, textoCaminho } from './reduce.js';

export const CATEGORIAS_ORACULO = Object.freeze({
  amor: 'Amor',
  dinheiro: 'Dinheiro',
  sucesso: 'Sucesso',
});

export const OPCOES_ORACULO = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22]);

/**
 * Método do cap. 7 (p. 59): três números de escolha livre, somados e reduzidos;
 * só não se reduz quando a soma chega a 11 ou 22.
 */
export function consultarOraculo(categoria, numeros) {
  // Valida também no domínio: uma chamada direta não pode depender da proteção dos selects.
  if (!Object.hasOwn(CATEGORIAS_ORACULO, categoria)) {
    throw new RangeError(`Categoria inválida: ${categoria}`);
  }
  if (!Array.isArray(numeros) || numeros.length !== 3) {
    throw new RangeError('Escolha exatamente três números.');
  }
  for (const n of numeros) {
    if (!OPCOES_ORACULO.includes(n)) throw new RangeError(`Número fora das opções: ${n}`);
  }
  const reducao = reduzirComMestres(numeros[0] + numeros[1] + numeros[2]);
  return {
    categoria,
    // Copia a lista para uma edição posterior do formulário não alterar a consulta pronta.
    numeros: [...numeros],
    reducao,
    valor: reducao.valor,
    exibicao: exibicao(reducao),
    conta: `${numeros.join(' + ')} = ${textoCaminho(reducao)}`,
  };
}
