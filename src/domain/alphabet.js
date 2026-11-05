/** Tabela de conversão de letras em números (cap. 2, p. 16). */
export const TABELA_LETRAS = Object.freeze({
  1: 'AJS',
  2: 'BKT',
  3: 'CLU',
  4: 'DMV',
  5: 'ENW',
  6: 'FOX',
  7: 'GPY',
  8: 'HQZ',
  9: 'IR',
});

const VALORES = Object.freeze(
  Object.fromEntries(
    Object.entries(TABELA_LETRAS).flatMap(([numero, letras]) =>
      [...letras].map((letra) => [letra, Number(numero)]),
    ),
  ),
);

export const VOGAIS = Object.freeze(['A', 'E', 'I', 'O', 'U']);

/** Devolve o valor da letra A–Z ou null: nunca atribui número a símbolo desconhecido. */
export function valorLetra(letra) {
  return Object.hasOwn(VALORES, letra) ? VALORES[letra] : null;
}

export const ehVogalBase = (letra) => VOGAIS.includes(letra);
