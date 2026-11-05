import { exibicao, reduzirSimples, somaDigitos, textoCaminho } from './reduce.js';

export const NOMES_MESES = Object.freeze([
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]);

export function exigirAno(ano) {
  if (!Number.isInteger(ano) || ano < 1 || ano > 9999) {
    throw new RangeError('O ano consultado precisa ser um inteiro entre 1 e 9999.');
  }
}

/** Ano Universal: soma dos algarismos do ano. 1971 → 18 → 9 (p. 54, 58). */
export function calcularAnoUniversal(ano) {
  exigirAno(ano);
  const reducao = reduzirSimples(ano);
  return {
    ano,
    reducao,
    valor: reducao.valor,
    mestre: reducao.mestre,
    exibicao: exibicao(reducao),
    conta: `${String(ano).split('').join(' + ')} = ${reducao.caminho.slice(1).join(' → ') || ano}`,
  };
}

/** Ano Pessoal: dia + mês + Ano Universal. 5 + 5 + 9 = 19 → 10 → 1 (p. 54, 58). */
export function calcularAnoPessoal(componentes, ano) {
  const universal = calcularAnoUniversal(ano);
  const D = componentes.dia.simples;
  const M = componentes.mes.simples;
  const soma = D + M + universal.valor;
  const reducao = reduzirSimples(soma);
  return {
    ano,
    universal,
    dia: D,
    mes: M,
    soma,
    reducao,
    valor: reducao.valor,
    mestre: reducao.mestre,
    exibicao: exibicao(reducao),
    conta: `${D} + ${M} + ${universal.valor} = ${textoCaminho(reducao)}`,
    regra: 'R-ANO-PESSOAL',
    paginas: 'p. 54, 58',
  };
}

/** Mês Pessoal: Ano Pessoal + número literal do mês do calendário (p. 58). */
export function calcularMesPessoal(anoPessoal, mes) {
  if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
    throw new RangeError('O mês precisa estar entre 1 e 12.');
  }
  const soma = anoPessoal.valor + mes;
  const reducao = reduzirSimples(soma);
  const alternativa = reduzirSimples(anoPessoal.valor + reduzirSimples(somaDigitos(mes)).valor);
  return {
    mes,
    nomeMes: NOMES_MESES[mes - 1],
    anoPessoal: anoPessoal.valor,
    soma,
    reducao,
    valor: reducao.valor,
    mestre: reducao.mestre,
    exibicao: exibicao(reducao),
    conta: `${anoPessoal.valor} + ${mes} = ${textoCaminho(reducao)}`,
    /** Reduzir o mês antes de somar só muda o registro de 11/22, nunca o dígito final. */
    mestreComMesReduzido: alternativa.mestre,
    regra: 'R-MES-PESSOAL',
    paginas: 'p. 58',
  };
}

export function calcularMesesPessoais(anoPessoal) {
  return NOMES_MESES.map((_, i) => calcularMesPessoal(anoPessoal, i + 1));
}

/** Pináculo, ciclo e desafio da idade completada no ano consultado. */
export function vigentesNaIdade(mapa, idade) {
  if (idade < 0) return null;
  const naFaixa = (item) => idade >= item.inicio && (item.fim === null || idade <= item.fim);
  return {
    idade,
    pinaculo: mapa.pinaculos.itens.find(naFaixa),
    ciclo: mapa.ciclos.itens.find(naFaixa),
    desafio: mapa.desafios.itens.find(naFaixa),
  };
}
