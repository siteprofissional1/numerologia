import { h } from './dom.js';

// O último ciclo tem fim aberto. Os 15 anos extras só fecham a escala do desenho;
// não alteram o período calculado nem representam uma previsão de duração da vida.
const fimDaEscala = (mapa) => mapa.ciclos.itens[2].inicio + 15;

/** Usa a duração inclusiva de cada intervalo como peso flex para dimensionar os segmentos. */
function faixa(itens, mapa) {
  const fimEscala = fimDaEscala(mapa);
  const idade = mapa.vigentes?.idade ?? null;
  return h('div', { class: 'tempo-faixa' },
    itens.map((item) => {
      const fim = item.fim ?? fimEscala;
      // Para destacar a fase, confere os limites reais, inclusive o fim aberto.
      const vigente = idade !== null && idade >= item.inicio && (item.fim === null || idade <= item.fim);
      return h('div', {
        class: `tempo-seg${vigente ? ' vigente' : ''}`,
        style: { flex: `${fim - item.inicio + 1} 1 0` },
        title: item.faixaTexto,
      },
      h('span', { class: 'tempo-num' }, item.exibicao),
      h('span', { class: 'tempo-idade' }, item.faixaTexto));
    }));
}

/** Uma só barra, para vir logo acima da explicação dela. A fase atual fica destacada. */
export const barraDoTempo = (itens, mapa) => h('div', { class: 'tempo tempo-unica' }, faixa(itens, mapa));

/** Linha do tempo proporcional, com pináculos, desafios e ciclos na mesma escala. */
export function linhaDoTempo(mapa) {
  const pinaculos = mapa.pinaculos.itens;
  const ciclos = mapa.ciclos.itens;
  const fimEscala = fimDaEscala(mapa);
  const idade = mapa.vigentes?.idade ?? null;

  return h('div', { class: 'tempo' },
    h('div', { class: 'tempo-rotulo' }, 'Pináculos'), faixa(pinaculos, mapa),
    h('div', { class: 'tempo-rotulo' }, 'Desafios'), faixa(mapa.desafios.itens, mapa),
    h('div', { class: 'tempo-rotulo' }, 'Ciclos'), faixa(ciclos, mapa),
    idade !== null && idade <= fimEscala && h('div', { class: 'tempo-regua' },
      h('span', {
        class: 'tempo-marca',
        // Mantém a legenda afastada das extremidades para que o texto caiba na tela.
        style: { left: `${Math.min(92, Math.max(8, (idade / (fimEscala + 1)) * 100))}%` },
      }, `▲ ${idade} anos em ${mapa.anoConsulta}`)),
  );
}
