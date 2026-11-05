/** Peças visuais reutilizadas pelas telas: cartões, mensagens, textos e tabelas. */
import { h } from './dom.js';
import { semCitacoesDePagina } from './editorial.js';

let temporizador = null;
export function notificar(mensagem) {
  const status = document.getElementById('status');
  status.textContent = mensagem;
  // Uma nova notificação ganha seu próprio prazo; a anterior não pode apagar a mensagem nova.
  clearTimeout(temporizador);
  temporizador = setTimeout(() => { status.textContent = ''; }, 3500);
}

/** Padroniza o título e a introdução; filhos podem incluir listas de outros componentes. */
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
  // A chave liga o descritor de src/data ao texto transcrito carregado na inicialização.
  const literal = ctx.estado.textos?.[registro.chave];
  // Falhar explicitamente evita trocar silenciosamente uma interpretação por um resumo.
  if (!literal) throw new Error(`Texto do livro ausente: ${registro.chave}. Execute npm run importar-textos.`);
  return h('div', { class: 'interp literal', 'data-texto': registro.chave },
    titulo && h('h4', {}, titulo),
    // A linha em branco delimita os parágrafos; h() insere cada um como texto seguro.
    literal.split('\n\n').map((p) => h('p', { class: 'texto-original' }, p)),
    registro.observacaoEditorial && h('p', { class: 'nota-editorial' },
      `Nota do aplicativo, fora do livro: ${semCitacoesDePagina(registro.observacaoEditorial)}`),
  );
}

/** Converte pares [rótulo, valor] em dl/dt/dd, preservando a associação semântica. */
export const definicoes = (pares) =>
  h('dl', { class: 'definicao' }, pares.filter(Boolean).map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)]));

/** A rolagem fica no contêiner para tabelas largas não alargarem a página no celular. */
export function tabela(cabecalho, linhas) {
  return h('div', { class: 'tabela-rolagem', tabindex: '0', role: 'region', 'aria-label': 'Tabela' },
    h('table', {},
      h('thead', {}, h('tr', {}, cabecalho.map((c) => h('th', { scope: 'col' }, c)))),
      h('tbody', {}, linhas.map((l) => h('tr', {}, l.map((c) => h('td', {}, c))))),
    ));
}

export const listaNumeros = (lista) => (lista.length ? lista.join(', ') : 'nenhum');
