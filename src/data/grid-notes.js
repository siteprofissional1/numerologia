/**
 * Chaves das leituras do quadro 3×3: uso, direções e exemplo.
 * O domínio detecta as linhas completas; ui/render.js escolhe as leituras a apresentar.
 */
import { registro } from './provenance.js';

const q = (chave, interpretacao, observacaoEditorial = null) =>
  registro({
    chave: `quadro.${chave}`,
    capitulo: 6,
    paginaInicial: 52,
    paginaFinal: 53,
    categoria: 'quadro',
    numero: null,
    interpretacao,
    observacaoEditorial,
  });

/** Únicas leituras do quadro que a autora fornece (p. 52–53). */
export const LEITURAS_QUADRO = Object.freeze({
  uso: q('uso', 'Depois de saber, em linhas gerais, se a vida tende a ser fácil ou difícil, monta-se com a data de nascimento um quadro no formato do jogo da velha, para uma análise rápida.'),
  horizontal: q('horizontal', 'Nas linhas horizontais os números guardam distância de 3 em 3: muitos problemas e trabalho árduo para atingir o sucesso.'),
  vertical: q('vertical', 'Nas colunas verticais a progressão é normal, com pequena distância: a vida não será muito difícil, nem exigirá grande esforço para o sucesso.'),
  diagonal: q('diagonal', 'Na diagonal 1, 5, 9 a distância é de quatro: os empreendimentos se concretizam com certa facilidade e pouca força de vontade, o que não é muito bom, por gerar dependência dos outros.'),
  exemplo: q('exemplo', 'No exemplo de 6/2/1950, a vida é relativamente fácil, mas nessa facilidade está o perigo de gastar inutilmente tempo e dinheiro; a soma da data dá 5, número do esbanjador.'),
});
