/** Diálogos e páginas explicativas; os valores exibidos vêm do mapa, sem novos cálculos. */
import { CLASSIFICACOES, REGRAS } from '../data/rules-catalog.js';
import { INCONSISTENCIAS } from '../data/inconsistencies.js';
import { blocoTexto, definicoes, etapas, secao } from './components.js';
import { h, limpar, anexar } from './dom.js';
import { registrosDaPosicao } from './render.js';
import { semCitacoesDePagina } from './editorial.js';
import { DEFINICOES_POSICOES } from '../data/position-definitions.js';

const regraPorId = (id) => REGRAS.find((r) => r.id === id);

/** Diálogo de um número: significado, fórmula, intermediários e referência. */
export function abrirDetalhe(posicao, ctx) {
  const dialogo = document.getElementById('detalhe');
  const mapa = ctx.estado.mapa;
  const regra = regraPorId(posicao.regra);
  const registros = posicao.registros ?? registrosDaPosicao(posicao, mapa);
  // O mesmo dialog é reutilizado: limpa a posição anterior antes de mostrar outra.
  limpar(dialogo);
  anexar(dialogo, [
    h('div', { class: 'detalhe-topo' },
      h('h2', { id: 'detalhe-titulo' }, `${posicao.rotulo}: ${posicao.exibicao}`),
      h('button', { type: 'button', class: 'botao secundario pequeno', onClick: () => dialogo.close() }, 'Fechar')),
    posicao.apelidos && h('p', { class: 'ajuda' }, `Também chamado: ${posicao.apelidos}`),
    h('h3', {}, 'Significado'),
    DEFINICOES_POSICOES[posicao.chave] && blocoTexto(DEFINICOES_POSICOES[posicao.chave], ctx),
    registros.length > 0
      ? registros.map((r) => blocoTexto(r, ctx, { titulo: r.tema ?? r.titulo ?? (r.numero ? `Número ${r.numero}` : undefined) }))
      : h('p', {}, 'Sem interpretação: o número não pôde ser determinado.'),
    h('h3', {}, 'Fórmula e cálculo'),
    h('p', {}, posicao.formula),
    etapas(posicao.passos ?? []),
    h('h3', {}, 'Sobre o cálculo'),
    definicoes([
      regra && ['Classificação', CLASSIFICACOES[regra.classificacao]],
      regra && ['11 e 22', semCitacoesDePagina(regra.mestres)],
    ]),
  ]);
  // O dialog nativo oferece fechamento por Escape e controla o foco enquanto está aberto.
  dialogo.showModal();
}

export function secaoRegras() {
  return secao('Explicação das regras',
    'Cada operação do aplicativo, com origem no livro, fórmula e classificação da evidência.',
    h('ul', { class: 'lista-limpa' },
      REGRAS.map((r) => h('li', { class: 'cartao' },
        h('h3', {}, r.nome),
        h('p', {}, h('span', { class: 'etiqueta' }, CLASSIFICACOES[r.classificacao])),
        definicoes([
          ['Fórmula', semCitacoesDePagina(r.formula)],
          ['Exemplo', semCitacoesDePagina(r.exemplo)],
          ['Casos especiais', semCitacoesDePagina(r.casosEspeciais)],
          ['11 e 22', semCitacoesDePagina(r.mestres)],
          ['Ambiguidades', semCitacoesDePagina(r.ambiguidades)],
        ])))),
  );
}

export function secaoInconsistencias() {
  return secao('Registro de inconsistências do livro',
    `${INCONSISTENCIAS.length} pontos em que a fonte erra, se contradiz ou deixa lacunas. Texto original, erro identificado e decisão técnica ficam separados.`,
    h('ul', { class: 'lista-limpa' },
      INCONSISTENCIAS.map((i) => h('li', { class: 'cartao' },
        h('h3', {}, `${i.titulo}`),
        h('p', {}, h('span', { class: 'etiqueta' }, i.tipo)),
        definicoes([
          ['Passagem', semCitacoesDePagina(i.passagem)],
          ['Problema', semCitacoesDePagina(i.problema)],
          ['Decisão do aplicativo', semCitacoesDePagina(i.solucao)],
        ])))),
  );
}
