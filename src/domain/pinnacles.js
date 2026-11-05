/** Valores dos quatro pináculos e faixas de idade compartilhadas com os desafios. */
import { ehBissexto } from './birth-numbers.js';
import { exibicao, reduzirComMestres, textoCaminho } from './reduce.js';

/** Idade de encerramento do 1º pináculo: 36 − N (p. 53, 55). */
export function calcularIdadeEncerramento(destino, regras) {
  const literal = 36 - destino.valor;
  const reduzido = 36 - destino.reduzido;
  const ambiguo = destino.mestre !== null;
  // A escolha só tem efeito quando o Destino conserva 11 ou 22; nos demais casos coincide.
  const usaReduzido = ambiguo && regras.idadeDestinoMestre === 'reduzido';
  const n = usaReduzido ? destino.reduzido : destino.valor;
  return {
    idade: 36 - n,
    formula: `36 − ${n} = ${36 - n}`,
    ambiguo,
    alternativas: ambiguo
      ? {
          literal: { formula: `36 − ${destino.valor} = ${literal}`, idade: literal },
          reduzido: { formula: `36 − ${destino.reduzido} = ${reduzido}`, idade: reduzido },
        }
      : null,
  };
}

/**
 * Faixas de idade. O livro afirma nove anos para os pináculos intermediários,
 * mas a tabela do exemplo mostra dez idades inteiras: os dois modos existem.
 */
export function calcularFaixas(idadeFim, modo) {
  const duracao = modo === 'tabela' ? 10 : 9;
  // Os limites são inclusivos: depois de terminar aos 31, a fase seguinte começa aos 32.
  const inicio2 = idadeFim + 1;
  const inicio3 = inicio2 + duracao;
  const inicio4 = inicio3 + duracao;
  return [
    { inicio: 0, fim: idadeFim },
    { inicio: inicio2, fim: inicio3 - 1 },
    { inicio: inicio3, fim: inicio4 - 1 },
    { inicio: inicio4, fim: null },
  ];
}

/** Formata faixas finitas ou abertas; fim=null representa uma fase sem término calculado. */
export function textoFaixa({ inicio, fim }) {
  if (inicio === 0) return `até ${fim} anos`;
  if (fim === null) return `${inicio} anos em diante`;
  return `${inicio} a ${fim} anos`;
}

/** Data em que a pessoa completa a idade. 29/02 em ano comum é mostrado como 28/02. */
export function dataNaIdade(data, idade) {
  const ano = data.ano + idade;
  const dia = data.mes === 2 && data.dia === 29 && !ehBissexto(ano) ? 28 : data.dia;
  const p = (n, t = 2) => String(n).padStart(t, '0');
  return `${p(dia)}/${p(data.mes)}/${p(ano, 4)}`;
}

/** Monta um item completo: valor, conta explicada, intervalo e data de início. */
function pinaculo(ordem, formula, parcelas, faixa, data) {
  const reducao = reduzirComMestres(parcelas[0] + parcelas[1]);
  return {
    ordem,
    formula,
    parcelas,
    reducao,
    valor: reducao.valor,
    exibicao: exibicao(reducao),
    conta: `${parcelas[0]} + ${parcelas[1]} = ${textoCaminho(reducao)}`,
    ...faixa,
    faixaTexto: textoFaixa(faixa),
    dataInicio: faixa.inicio === 0 ? null : dataNaIdade(data, faixa.inicio),
  };
}

/** Usa os componentes já reduzidos; o terceiro pináculo depende dos dois primeiros. */
export function calcularPinaculos(componentes, destino, data, regras) {
  const D = componentes.dia.usado;
  const M = componentes.mes.usado;
  const A = componentes.ano.usado;
  const encerramento = calcularIdadeEncerramento(destino, regras);
  const faixas = calcularFaixas(encerramento.idade, regras.modoPinaculos);

  // Mantém números e intervalos juntos para a tabela, a barra e o relatório concordarem.
  const p1 = pinaculo(1, 'Dia + Mês', [D, M], faixas[0], data);
  const p2 = pinaculo(2, 'Dia + Ano', [D, A], faixas[1], data);
  const p3 = pinaculo(3, '1º pináculo + 2º pináculo', [p1.valor, p2.valor], faixas[2], data);
  const p4 = pinaculo(4, 'Mês + Ano', [M, A], faixas[3], data);

  return {
    encerramento,
    modo: regras.modoPinaculos,
    itens: [p1, p2, p3, p4],
    faixasNove: calcularFaixas(encerramento.idade, 'nove').map(textoFaixa),
    faixasTabela: calcularFaixas(encerramento.idade, 'tabela').map(textoFaixa),
    regra: 'R-PINACULOS',
    paginas: 'p. 53–58',
  };
}
