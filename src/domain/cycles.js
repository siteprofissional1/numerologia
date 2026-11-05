import { dataNaIdade, textoFaixa } from './pinnacles.js';

/**
 * Três ciclos (p. 54–56): 1º = mês, até o fim do 1º pináculo; 2º = dia, pelo 2º
 * e 3º pináculos e nove primeiros anos do 4º; 3º = ano, pelo restante da vida.
 */
export function calcularCiclos(componentes, pinaculos, data) {
  const [p1, , , p4] = pinaculos.itens;
  // Conta nove idades inclusivas: se o quarto pináculo começa aos 50, o ciclo vai até 58.
  const fimSegundo = p4.inicio + 8;
  const faixas = [
    { inicio: 0, fim: p1.fim },
    { inicio: p1.fim + 1, fim: fimSegundo },
    { inicio: fimSegundo + 1, fim: null },
  ];
  // A ordem dos componentes é mês → dia → ano, diferente da ordem escrita de uma data.
  const origem = [
    ['Número do mês', componentes.mes],
    ['Número do dia', componentes.dia],
    ['Número do ano', componentes.ano],
  ];
  return {
    itens: origem.map(([fonte, comp], i) => ({
      ordem: i + 1,
      fonte,
      bruto: comp.bruto,
      valor: comp.usado,
      exibicao: comp.mestre ? comp.exibicao : String(comp.usado),
      mestre: comp.mestre,
      ...faixas[i],
      faixaTexto: textoFaixa(faixas[i]),
      dataInicio: faixas[i].inicio === 0 ? null : dataNaIdade(data, faixas[i].inicio),
    })),
    regra: 'R-CICLOS',
    paginas: 'p. 54–56, 58',
  };
}
