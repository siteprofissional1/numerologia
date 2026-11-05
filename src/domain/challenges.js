/**
 * Quatro desafios (p. 54, 56): diferenças absolutas dos números de um dígito.
 * O zero é preservado e não recebe interpretação, pois o livro não a fornece.
 */
export function calcularDesafios(componentes, pinaculos) {
  const D = componentes.dia.simples;
  const M = componentes.mes.simples;
  const A = componentes.ano.simples;
  const d1 = Math.abs(D - M);
  const d2 = Math.abs(D - A);
  const definicoes = [
    { formula: '|Dia − Mês|', conta: `|${D} − ${M}| = ${d1}`, valor: d1 },
    { formula: '|Dia − Ano|', conta: `|${D} − ${A}| = ${d2}`, valor: d2 },
    { formula: '|1º desafio − 2º desafio|', conta: `|${d1} − ${d2}| = ${Math.abs(d1 - d2)}`, valor: Math.abs(d1 - d2) },
    { formula: '|Mês − Ano|', conta: `|${M} − ${A}| = ${Math.abs(M - A)}`, valor: Math.abs(M - A) },
  ];
  return {
    itens: definicoes.map((d, i) => ({
      ordem: i + 1,
      ...d,
      exibicao: String(d.valor),
      zero: d.valor === 0,
      inicio: pinaculos.itens[i].inicio,
      fim: pinaculos.itens[i].fim,
      faixaTexto: pinaculos.itens[i].faixaTexto,
    })),
    regra: 'R-DESAFIOS',
    paginas: 'p. 54, 56, 58',
  };
}
