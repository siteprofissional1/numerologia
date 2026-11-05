import { OBRA } from '../config/rules.js';

export const CAPITULOS = Object.freeze({
  1: 'O sentido dos números',
  2: 'Palavras e números',
  3: 'Os padrões de seu destino',
  4: 'O significado das vibrações do seu nascimento',
  5: 'Como organizar e analisar o seu mapa numerológico',
  6: 'O que lhe reserva o futuro',
  7: 'Amor, dinheiro e sucesso',
  8: 'O amor sem lágrimas',
});

/**
 * Registro rastreável. O campo `interpretacao` é sempre um RESUMO FIEL escrito
 * para este projeto; o texto literal, quando existe, vem da cópia privada
 * gerada no computador do usuário, pela `chave` do registro.
 */
export function registro({
  chave,
  capitulo,
  paginaInicial,
  paginaFinal = paginaInicial,
  categoria,
  numero,
  interpretacao,
  observacaoEditorial = null,
  ...extras
}) {
  return Object.freeze({
    chave,
    obra: `${OBRA.titulo} (${OBRA.editora})`,
    capitulo,
    tituloCapitulo: CAPITULOS[capitulo],
    paginaInicial,
    paginaFinal,
    categoria,
    numero,
    interpretacao,
    observacaoEditorial,
    tipoTexto: 'resumo-fiel',
    ...extras,
  });
}

export function textoPaginas({ paginaInicial, paginaFinal }) {
  return paginaInicial === paginaFinal ? `p. ${paginaInicial}` : `p. ${paginaInicial}–${paginaFinal}`;
}
