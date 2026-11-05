/**
 * Fábrica comum de descritores: mantém as chaves e os metadados dos catálogos consistentes.
 * Metadados de procedência servem à auditoria; não são citações exibidas no relatório.
 */
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
 * Registro rastreável. O campo `interpretacao` conserva os resumos dos descritores
 * para documentação interna. A interface exige a transcrição literal pela `chave`
 * do registro em ui/components.js; esses resumos não são usados como fallback.
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
