import { h } from './dom.js';

/**
 * Barras horizontais de uma única série. Cada valor aparece na ponta, e a
 * informação é legível por leitor de tela e na impressão.
 */
export function barras(itens, { rotulo = '28px', titulo } = {}) {
  const maior = Math.max(1, ...itens.map((i) => i.valor));
  return h('ul', { class: 'barras', style: { '--rotulo': rotulo }, 'aria-label': titulo },
    itens.map((item) =>
      h('li', { class: 'barra-linha', title: `${item.rotulo}: ${item.valor}` },
        h('span', { class: 'barra-rotulo' }, item.rotulo),
        h('span', { class: 'barra-area' },
          h('span', {
            class: `barra-marca${item.valor === 0 ? ' zero' : ''}`,
            style: { width: `${(item.valor / maior) * 85}%` },
            'aria-hidden': 'true',
          }),
          h('span', { class: 'barra-valor' }, item.valor)),
      )),
  );
}
