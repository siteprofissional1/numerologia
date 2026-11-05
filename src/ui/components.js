import { h } from './dom.js';
import { semCitacoesDePagina } from './editorial.js';

let temporizador = null;
export function notificar(mensagem) {
  const status = document.getElementById('status');
  status.textContent = mensagem;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => { status.textContent = ''; }, 3500);
}

export const secao = (titulo, intro, ...filhos) =>
  h('section', { class: 'secao' },
    h('h2', { tabindex: '-1' }, titulo),
    intro && h('p', { class: 'secao-intro' }, intro),
    filhos);

export const cartao = (titulo, ...filhos) => h('div', { class: 'cartao' }, titulo && h('h3', {}, titulo), filhos);

export const aviso = (titulo, ...filhos) =>
  h('div', { class: 'aviso' }, h('p', {}, titulo && h('strong', {}, `${titulo} `), filhos));

export const etapas = (passos) =>
  h('ol', { class: 'etapas' }, passos.map((p) => h('li', {}, p)));

/** As interpretações vêm exclusivamente da transcrição do PDF fornecido. */
export function blocoTexto(registro, ctx, { titulo } = {}) {
  const literal = ctx.estado.textos?.[registro.chave];
  if (!literal) throw new Error(`Texto do livro ausente: ${registro.chave}. Execute npm run importar-textos.`);
  return h('div', { class: 'interp literal', 'data-texto': registro.chave },
    titulo && h('h4', {}, titulo),
    literal.split('\n\n').map((p) => h('p', { class: 'texto-original' }, p)),
    registro.observacaoEditorial && h('p', { class: 'nota-editorial' },
      `Nota do aplicativo, fora do livro: ${semCitacoesDePagina(registro.observacaoEditorial)}`),
  );
}

export const definicoes = (pares) =>
  h('dl', { class: 'definicao' }, pares.filter(Boolean).map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)]));

export function tabela(cabecalho, linhas) {
  return h('div', { class: 'tabela-rolagem', tabindex: '0', role: 'region', 'aria-label': 'Tabela' },
    h('table', {},
      h('thead', {}, h('tr', {}, cabecalho.map((c) => h('th', { scope: 'col' }, c)))),
      h('tbody', {}, linhas.map((l) => h('tr', {}, l.map((c) => h('td', {}, c))))),
    ));
}

export const listaNumeros = (lista) => (lista.length ? lista.join(', ') : 'nenhum');
