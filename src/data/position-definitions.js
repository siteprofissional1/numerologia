/**
 * Descritores mínimos: a interface precisa somente da chave para localizar cada definição.
 * Object.fromEntries converte os pares [posição, descritor] em um objeto consultável por nome.
 */
/** Chaves das definições transcritas; os textos vêm exclusivamente do PDF. */
export const DEFINICOES_POSICOES = Object.freeze(Object.fromEntries(
  ['ambicao', 'personalidade', 'expressao', 'realidade', 'destino']
    .map((chave) => [chave, Object.freeze({ chave: `definicao.${chave}` })]),
));

export const METODO_ORACULO = Object.freeze({ chave: 'oraculo.metodo' });
