/** Compara dois mapas já calculados; não precisa ler formulários nem executar acesso à rede. */
import { AFINIDADES } from '../data/general-meanings.js';
import { ELEMENTOS, elementoDoNumero } from './birth-numbers.js';
import { exibicao, reduzirComMestres, textoCaminho } from './reduce.js';

const ROTULOS = {
  similares: 'Similares',
  complementares: 'Complementares',
  opostos: 'Opostos',
};

/** Código de p. 68. `tabela68` retira o 8 do grupo Fogo, como faz o quadro daquela página. */
function classificarUmaVez(a, b, { tabela68 = false } = {}) {
  const grupo = (n) => (tabela68 && n === 8 ? null : elementoDoNumero(n));
  const ga = grupo(a);
  const gb = grupo(b);
  if (ga !== null && ga === gb) return 'similares';
  return a % 2 === b % 2 ? 'complementares' : 'opostos';
}

/**
 * Classifica um par (Ambição ou Destino). Quando o livro permite duas leituras,
 * as duas são devolvidas e nenhuma é imposta:
 *  - 11 é ímpar, mas se reduz a 2, que é par (22 e 4 são pares);
 *  - o 8 está no Fogo na p. 31, mas não no quadro da p. 68.
 */
export function classificarPar(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    return { classe: null, rotulo: 'Não classificável', ambiguo: false, leituras: [] };
  }
  const reduzir = (n) => (n > 9 ? reduzirComMestres(n).reduzido : n);
  const candidatas = [
    { descricao: 'Números como estão, incluindo o 8 no elemento Fogo', classe: classificarUmaVez(a, b) },
  ];
  if (a > 9 || b > 9) {
    candidatas.push({
      descricao: `Com 11 e 22 lidos como ${reduzir(a)} e ${reduzir(b)}`,
      classe: classificarUmaVez(reduzir(a), reduzir(b)),
    });
  }
  if (a === 8 || b === 8) {
    candidatas.push({
      descricao: 'Sem o 8 no Fogo, como no quadro de relacionamentos',
      classe: classificarUmaVez(a, b, { tabela68: true }),
    });
  }
  // Leituras diferentes podem chegar à mesma classe. Set remove as repetições antes
  // de decidir se existe ambiguidade de fato, em vez de contar apenas as alternativas.
  const classes = [...new Set(candidatas.map((c) => c.classe))];
  const ambiguo = classes.length > 1;
  return {
    classe: ambiguo ? null : classes[0],
    rotulo: ambiguo ? classes.map((c) => ROTULOS[c]).join(' ou ') : ROTULOS[classes[0]],
    ambiguo,
    iguais: a === b,
    leituras: ambiguo
      ? candidatas.map((c) => ({ descricao: c.descricao, rotulo: ROTULOS[c.classe] }))
      : [],
  };
}

/** Soma de dois números e redução (p. 69): Expressão 1 + 9 → 1; Destino 6 + 9 → 6. */
export function combinarNumeros(a, b) {
  const reducao = reduzirComMestres(a + b);
  return {
    a,
    b,
    reducao,
    valor: reducao.valor,
    exibicao: exibicao(reducao),
    conta: `${a} + ${b} = ${textoCaminho(reducao)}`,
  };
}

/** Confere os dois sentidos: a lista de A incluir B não garante que a de B inclua A. */
function afinidadeEntre(a, b) {
  const lista = (n) => AFINIDADES[n] ?? [];
  const inclui = (de, para) => lista(de) === 'todos' || lista(de).includes(para);
  return { aListaB: inclui(a, b), bListaA: inclui(b, a) };
}

/** Normaliza uma posição dos dois mapas para a tabela; null preserva resultados indeterminados. */
function linhaPosicao(rotulo, posA, posB, paginas, { classificar = false } = {}) {
  const a = posA.indeterminado ? null : posA.valor;
  const b = posB.indeterminado ? null : posB.valor;
  return {
    rotulo,
    a: posA.exibicao,
    b: posB.exibicao,
    valorA: a,
    valorB: b,
    iguais: a !== null && a === b,
    classificacao: classificar ? classificarPar(a, b) : null,
    afinidade: a !== null && b !== null ? afinidadeEntre(a, b) : null,
    paginas,
  };
}

/** Comparação simbólica de dois mapas. Não produz percentuais nem probabilidades. */
export function compararMapas(mapaA, mapaB) {
  const posicoes = [
    linhaPosicao('Ambição', mapaA.ambicao, mapaB.ambicao, 'p. 68–69', { classificar: true }),
    linhaPosicao('Personalidade', mapaA.personalidade, mapaB.personalidade, 'p. 16'),
    linhaPosicao('Expressão', mapaA.expressao, mapaB.expressao, 'p. 69'),
    linhaPosicao('Caminho do Destino', mapaA.destino, mapaB.destino, 'p. 68–69', { classificar: true }),
    linhaPosicao('Realidade', mapaA.realidade, mapaB.realidade, 'p. 71'),
  ];
  const elementoA = mapaA.dia.chaveElemento;
  const elementoB = mapaB.dia.chaveElemento;
  return {
    posicoes,
    expressoes: combinarNumeros(mapaA.expressao.valor, mapaB.expressao.valor),
    destinos: combinarNumeros(mapaA.destino.valor, mapaB.destino.valor),
    elemento: {
      a: ELEMENTOS[elementoA].nome,
      b: ELEMENTOS[elementoB].nome,
      mesmo: elementoA === elementoB,
    },
    paridade: { a: mapaA.paridade, b: mapaB.paridade },
    pinaculos: mapaA.pinaculos.itens.map((p, i) => ({
      ordem: p.ordem,
      a: { valor: p.exibicao, faixa: p.faixaTexto },
      b: { valor: mapaB.pinaculos.itens[i].exibicao, faixa: mapaB.pinaculos.itens[i].faixaTexto },
    })),
    ciclos: mapaA.ciclos.itens.map((c, i) => ({
      ordem: c.ordem,
      a: { valor: c.exibicao, faixa: c.faixaTexto },
      b: { valor: mapaB.ciclos.itens[i].exibicao, faixa: mapaB.ciclos.itens[i].faixaTexto },
    })),
  };
}
