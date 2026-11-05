import { DIAS_NASCIMENTO } from '../data/birth-days.js';
import { CAMINHOS_DESTINO } from '../data/destiny-meanings.js';
import { ELEMENTOS_TEXTO, NOTA_ELEMENTO_VOCACAO } from '../data/elements.js';
import { NOTAS_PLANOS, PLANOS } from '../data/expression-planes.js';
import { FUTURO_POR_NUMERO, SIGNIFICADOS_GERAIS } from '../data/general-meanings.js';
import { LEITURAS_QUADRO } from '../data/grid-notes.js';
import { APTIDOES, FALTAS } from '../data/intensification.js';
import {
  EXEMPLOS_ESPECIFICOS,
  NOTA_CICLOS_DESAFIOS,
  PINACULOS_SIGNIFICADOS,
  SEM_TEXTO_ZERO,
  EXPLICACOES_FUTURO,
} from '../data/pinnacle-meanings.js';
import { NOTA_REALIDADE, RELACIONAMENTOS } from '../data/relationships.js';
import { exibicao } from '../domain/reduce.js';
import { barras } from './chart.js';
import {
  aviso, blocoTexto, cartao, definicoes, etapas, listaNumeros, secao, tabela,
} from './components.js';
import { h } from './dom.js';
import { abrirDetalhe } from './explanations.js';
import { linhaDoTempo } from './timeline.js';

/** Registros que explicam cada posição: gerais, exceto Destino e Dia, com textos próprios. */
export function registrosDaPosicao(posicao, mapa) {
  if (posicao.indeterminado) return [];
  switch (posicao.chave) {
    case 'destino': {
      const lista = [CAMINHOS_DESTINO[posicao.valor]];
      if (posicao.mestre) lista.push(CAMINHOS_DESTINO[posicao.reduzido]);
      return lista;
    }
    case 'dia':
      return [DIAS_NASCIMENTO[mapa.data.dia]];
    default: {
      const lista = [SIGNIFICADOS_GERAIS[posicao.valor]];
      if (posicao.mestre) lista.push(SIGNIFICADOS_GERAIS[posicao.mestre]);
      return lista;
    }
  }
}

const notaLeitura = (posicao) => {
  if (posicao.indeterminado) return 'Indeterminado';
  if (posicao.chave === 'destino' && posicao.mestre) return `Número principal; leitura ${posicao.exibicao}`;
  if (posicao.mestre) return `Intermediário ${posicao.mestre}`;
  return posicao.apelidos ?? '';
};

function cartaoNumero(posicao, ctx, { valor, nota } = {}) {
  return h('button', {
    type: 'button',
    class: 'numero',
    'data-numero': posicao.chave,
    'aria-haspopup': 'dialog',
    onClick: () => abrirDetalhe(posicao, ctx),
  },
  h('span', { class: 'numero-rotulo' }, posicao.rotulo),
  h('span', { class: `numero-valor${String(valor ?? posicao.exibicao).length > 5 ? ' texto' : ''}` }, valor ?? posicao.exibicao),
  h('span', { class: 'numero-nota' }, nota ?? notaLeitura(posicao)));
}

/** Topo do mapa: identificação, números clicáveis e avisos sobre este mapa. */
export function cabecalhoMapa(ctx, acoes) {
  const m = ctx.estado.mapa;
  const elemento = {
    chave: 'elemento',
    rotulo: 'Elemento harmônico',
    exibicao: m.dia.elemento.nome,
    formula: 'Lista de dias de cada elemento harmônico',
    regra: 'R-ELEMENTOS',
    paginas: 'p. 31–32',
    passos: [`Dia ${m.dia.dia} → ${m.dia.elemento.nome}, ${m.dia.elemento.titulo}`],
    registros: [ELEMENTOS_TEXTO[m.dia.chaveElemento]],
  };
  return [
    h('div', {},
      h('p', { class: 'nome-pessoa', 'data-testid': 'nome-mapa' }, m.pessoa.nome),
      h('p', { class: 'secao-intro' }, `Nascimento: ${m.pessoa.data}`)),
    acoes,
    h('div', { class: 'numeros' },
      cartaoNumero(m.ambicao, ctx),
      cartaoNumero(m.personalidade, ctx),
      cartaoNumero(m.expressao, ctx),
      cartaoNumero(m.destino, ctx, { valor: String(m.destino.valor) }),
      cartaoNumero(m.realidade, ctx),
      cartaoNumero(m.dia, ctx, { nota: `Número associado: ${exibicao(m.dia.reducao)}` }),
      cartaoNumero(elemento, ctx, { nota: m.dia.elemento.titulo })),
    h('p', { class: 'ajuda sem-impressao' }, 'Toque em um número para ver o texto do livro e o cálculo.'),
    m.analise.transformacoes.length > 0 && aviso('Convenção técnica do aplicativo:',
      `${m.analise.transformacoes.map((t) => `${t.de}→${t.para}`).join(', ')}. A tabela do livro traz apenas A–Z e não trata de acentos.`),
    m.analise.yEhVogal && aviso('Regra do Y:', 'como o nome não tem A, E, I, O ou U, o Y foi considerado vogal.'),
    m.ambicao.indeterminado && aviso('Ambição indeterminada:', m.ambicao.passos[0]),
    m.personalidade.indeterminado && aviso('Personalidade indeterminada:', m.personalidade.passos[0]),
    m.destino.alternativa && aviso('Componente mestre:',
      `dia, mês ou ano resultam em 11 ou 22. Conservando esses números na soma, o Destino seria ${m.destino.alternativa.exibicao} (${m.destino.alternativa.caminho}). O livro não dá exemplo.`),
  ];
}

function palavraVisual(palavra) {
  return h('div', { class: 'bloco' },
    h('h4', {}, palavra.original),
    h('ul', { class: 'palavra' },
      palavra.letras.map((l) =>
        h('li', {
          class: `letra ${l.tipo}`,
          title: `${l.original}: valor ${l.valor}, ${l.tipo}`,
        },
        h('span', { class: 'letra-original' }, l.original),
        h('span', { class: 'letra-norm' }, l.transformada ? `→ ${l.normalizada}` : ' '),
        h('span', { class: 'letra-valor' }, l.valor),
        h('span', { class: 'letra-tipo' }, l.tipo === 'vogal' ? 'vogal' : 'cons.')))));
}

function cartaoPosicaoNome(p) {
  return cartao(`${p.rotulo}: ${p.exibicao}`,
    h('p', { class: 'ajuda' }, p.formula),
    etapas(p.passos));
}

export function secaoNome(ctx) {
  const m = ctx.estado.mapa;
  return secao('Análise do nome',
    'Cada letra recebe o valor da tabela do livro. As vogais estão destacadas e identificadas.',
    cartao('Conversão letra a letra', m.analise.palavras.map(palavraVisual)),
    cartaoPosicaoNome(m.ambicao),
    cartaoPosicaoNome(m.personalidade),
    cartaoPosicaoNome(m.expressao),
    m.expressao.confere === true && h('p', { class: 'ajuda' }, 'Controle matemático: a soma de todas as letras confere com Ambição + Personalidade.'),
  );
}

export function graficoFrequencias(m) {
  return barras(
    Object.entries(m.frequencias.contagem).map(([n, v]) => ({ rotulo: n, valor: v })),
    { titulo: 'Frequência de cada número nas letras do nome' },
  );
}

export function secaoFrequencias(ctx) {
  const m = ctx.estado.mapa;
  const f = m.frequencias;
  return secao('Frequência dos números',
    'Contagem de quantas letras do nome têm cada valor, de 1 a 9.',
    cartao(`Total de ${f.total} letras`, graficoFrequencias(m)),
    cartao(null, definicoes([
      ['Presentes', listaNumeros(f.presentes)],
      ['Ausentes', listaNumeros(f.ausentes)],
      ['Mais frequentes', `${listaNumeros(f.maisFrequentes)} (${f.maiorFrequencia} vezes)`],
    ])),
    h('p', { class: 'ajuda' }, 'O livro não define quantas repetições tornam um número predominante; o aplicativo só aponta os mais frequentes.'),
  );
}

export function secaoAptidoes(ctx) {
  const m = ctx.estado.mapa;
  const f = m.frequencias;
  const outros = f.presentes.filter((n) => !f.maisFrequentes.includes(n));
  return secao('Aptidões e ausências',
    'Tabela de intensificação do livro. A autora afirma que cada falta pode ser suprida por posições principais; nesses casos, a posição é indicada.',
    cartao('Mais frequentes',
      f.maisFrequentes.map((n) => blocoTexto(APTIDOES[n], ctx, { titulo: `Número ${n}: ${f.contagem[n]} vezes` }))),
    outros.length > 0 && cartao('Outros números presentes',
      outros.map((n) => blocoTexto(APTIDOES[n], ctx, { titulo: `Número ${n}: ${f.contagem[n]} ${f.contagem[n] === 1 ? 'vez' : 'vezes'}` }))),
    m.suprimentos.length > 0
      ? cartao('Números ausentes',
        m.suprimentos.map((s) =>
          h('div', {},
            blocoTexto(FALTAS[s.numero], ctx, { titulo: `Falta do número ${s.numero}` }),
            h('p', { class: 'ajuda' }, s.suprido ? `Suprido por: ${s.supridoPor.join(', ')} (regra inferida do exemplo do livro).` : 'Não suprido por posição principal.'))))
      : cartao('Números ausentes', h('p', {}, 'Nenhum: todos os números de 1 a 9 aparecem no nome.')),
  );
}

export function secaoPlanos(ctx) {
  const m = ctx.estado.mapa;
  const ordem = ['materiais', 'emocionais', 'mentais', 'intuitivos'];
  return secao('Planos de expressão',
    'Soma da quantidade de letras de cada grupo, conforme o método do livro.',
    cartao(`Maior contagem: ${m.planos.maiores.map((p) => PLANOS[p].nome).join(', ')}`,
      barras(ordem.map((p) => ({ rotulo: PLANOS[p].nome, valor: m.planos[p] })), { rotulo: '96px', titulo: 'Total de letras por plano' })),
    h('div', { class: 'grade grade-2' },
      ordem.map((p) => cartao(`${PLANOS[p].nome}: ${m.planos[p]}`,
        h('p', { class: 'ajuda' }, `Números ${PLANOS[p].numero.join(', ')}`),
        blocoTexto(PLANOS[p], ctx)))),
    cartao('O que o livro acrescenta',
      blocoTexto(NOTAS_PLANOS.numeroAlto, ctx),
      blocoTexto(NOTAS_PLANOS.oito, ctx, { titulo: '8, um número extrovertido' }),
      m.frequencias.contagem[7] <= 1 && blocoTexto(NOTAS_PLANOS.emocoesReprimidas, ctx, { titulo: `Emoções reprimidas (contagem do 7: ${m.frequencias.contagem[7]})` })),
  );
}

export function secaoNascimento(ctx) {
  const m = ctx.estado.mapa;
  const el = ELEMENTOS_TEXTO[m.dia.chaveElemento];
  return secao('Interpretação do nascimento', null,
    cartao(DIAS_NASCIMENTO[m.data.dia].titulo, blocoTexto(DIAS_NASCIMENTO[m.data.dia], ctx)),
    cartao(`${m.dia.elemento.nome}: ${m.dia.elemento.titulo}`,
      definicoes([
        ['Número associado', String(m.dia.numeroAssociado)],
        ['Números do grupo', m.dia.elemento.numeros.join(', ')],
        ['Dias do grupo', m.dia.elemento.dias.join(', ')],
      ]),
      blocoTexto(el, ctx),
      blocoTexto(NOTA_ELEMENTO_VOCACAO, ctx)),
    cartao(`Caminho do Destino: ${m.destino.valor}`,
      etapas(m.destino.passos),
      registrosDaPosicao(m.destino, m).map((r) =>
        blocoTexto(r, ctx, { titulo: `Destino ${r.numero}: ${r.tema}` }))),
    cartao(`Realidade: ${m.realidade.exibicao}`,
      etapas(m.realidade.passos),
      blocoTexto(NOTA_REALIDADE, ctx),
      registrosDaPosicao(m.realidade, m).map((r) => blocoTexto(r, ctx, { titulo: `Número ${r.numero}` }))),
  );
}

export function quadroVisual(q) {
  return h('div', { class: 'quadro', role: 'table', 'aria-label': 'Quadro numerológico' },
    q.celulas.map((linha) => h('div', { role: 'row', style: { display: 'contents' } },
      linha.map((c) => h('div', {
        role: 'cell',
        class: `quadro-celula ${c.vezes > 0 ? 'cheia' : 'vazia'}`,
        'data-celula': c.numero,
        'aria-label': c.vezes > 0 ? `${c.numero}, ${c.vezes} ${c.vezes === 1 ? 'vez' : 'vezes'}` : `${c.numero} ausente`,
      },
      c.vezes > 0 && h('span', { class: 'quadro-numero' }, c.numero),
      c.vezes > 1 && h('span', { class: 'quadro-vezes' }, `${c.vezes} vezes`))))));
}

const TITULOS_QUADRO = {
  horizontal: 'Linhas horizontais: 3-6-9, 2-5-8 e 1-4-7',
  vertical: 'Colunas verticais: 3-2-1, 6-5-4 e 9-8-7',
  diagonal: 'Diagonal: 1-5-9',
};

/** O quadro da data, como ler cada linha e o que vale para esta data (p. 52–53). */
export function explicacaoQuadro(m, ctx) {
  const q = m.quadro;
  const tipos = [...new Set(q.linhasCompletas.map((l) => l.tipo))];
  return [
    blocoTexto(LEITURAS_QUADRO.uso, ctx),
    quadroVisual(q),
    definicoes([
      ['Algarismos usados, sem os zeros', q.digitos.join(', ')],
      ['Presentes', listaNumeros(q.presentes)],
      ['Ausentes', listaNumeros(q.ausentes)],
      ['Repetidos', listaNumeros(q.repetidos)],
    ]),
    h('h4', {}, 'Como ler o quadro'),
    h('p', { class: 'ajuda' }, 'Observe quais linhas ficaram completas na sua data. Cada direção tem uma leitura:'),
    Object.entries(TITULOS_QUADRO).map(([tipo, titulo]) => blocoTexto(LEITURAS_QUADRO[tipo], ctx, { titulo })),
    h('h4', {}, 'Na sua data'),
    q.linhasCompletas.length > 0
      ? h('p', {}, `Linhas completas: ${q.linhasCompletas.map((l) => l.numeros.join('-')).join('; ')}. Vale a leitura de: ${tipos.map((t) => TITULOS_QUADRO[t]?.split(':')[0].toLowerCase()).filter(Boolean).join(', ')}.`)
      : h('p', {}, 'Nenhuma linha ficou completa. O livro só interpreta linhas completas, então o quadro não acrescenta uma leitura de esforço ou facilidade para esta data, e nenhuma foi criada.'),
    tipos.includes('diagonal') && blocoTexto(LEITURAS_QUADRO.exemplo, ctx, { titulo: 'Exemplo do livro, data 6/2/1950' }),
    h('h4', {}, `Soma da data: ${q.reducaoSoma.valor}`),
    h('p', {}, q.passos[0]),
    h('p', { class: 'nota-editorial' }, 'Nota do aplicativo, fora do livro: a leitura abaixo segue o exemplo do livro, em que a soma da data é lida pelo significado do número.'),
    blocoTexto(SIGNIFICADOS_GERAIS[q.reducaoSoma.valor], ctx, { titulo: `Número ${q.reducaoSoma.valor}` }),
  ];
}

export function secaoQuadro(ctx) {
  const m = ctx.estado.mapa;
  return secao('Quadro numerológico 3×3',
    'Disposição do quadro do livro, preenchida apenas com os algarismos da data de nascimento, sem os zeros.',
    cartao(`Data ${m.pessoa.data}`, explicacaoQuadro(m, ctx)),
  );
}

export function avisoEncerramento(m) {
  const e = m.pinaculos.encerramento;
  return e.ambiguo && aviso('Destino principal:',
    `o livro não esclarece a fórmula 36 − N para 11 ou 22. Literal: ${e.alternativas.literal.formula}. Reduzido: ${e.alternativas.reduzido.formula}. Em uso: ${e.formula}.`);
}

export function secaoPinaculos(ctx) {
  const m = ctx.estado.mapa;
  const p = m.pinaculos;
  return secao('Linha do tempo dos pináculos',
    `Fim do primeiro pináculo: ${p.encerramento.formula} anos.`,
    blocoTexto(EXPLICACOES_FUTURO.pinaculos, ctx),
    blocoTexto(EXPLICACOES_FUTURO.pinaculosDuracao, ctx),
    aviso('Contradição na fonte:', 'o texto fala em nove anos para os pináculos intermediários, mas a tabela do exemplo mostra dez idades inteiras. O mapa usa nove anos.'),
    avisoEncerramento(m),
    cartao(null, linhaDoTempo(m)),
    tabela(['Pináculo', 'Fórmula', 'Conta', 'Idade'],
      p.itens.map((i) => [`${i.ordem}º`, i.formula, i.conta, i.faixaTexto])),
    p.itens.map((i) => cartao(`${i.ordem}º pináculo: ${i.exibicao}, ${i.faixaTexto}`,
      i.dataInicio && h('p', { class: 'ajuda' }, `A partir de ${i.dataInicio}`),
      blocoTexto(PINACULOS_SIGNIFICADOS[i.valor], ctx))),
  );
}

const TITULO_REFERENCIA = 'Leitura correspondente ao mesmo número';

export function textoCiclo(ciclo, ctx, titulo = TITULO_REFERENCIA) {
  return [
    ciclo.ordem === 1 && ciclo.valor === 4 && blocoTexto(EXEMPLOS_ESPECIFICOS.ciclo4NoPrimeiroPinaculo, ctx),
    blocoTexto(PINACULOS_SIGNIFICADOS[ciclo.valor], ctx, { titulo }),
  ];
}

export function textoDesafio(desafio, ctx, titulo = TITULO_REFERENCIA) {
  if (desafio.zero) return [titulo !== TITULO_REFERENCIA && h('h4', {}, titulo), h('p', {}, SEM_TEXTO_ZERO)];
  return [
    desafio.valor === 3 && blocoTexto(EXEMPLOS_ESPECIFICOS.desafio3, ctx),
    blocoTexto(PINACULOS_SIGNIFICADOS[desafio.valor], ctx, { titulo }),
  ];
}

export function secaoCiclos(ctx) {
  const m = ctx.estado.mapa;
  return secao('Ciclos e desafios',
    'Os ciclos mostram o ambiente e o pano de fundo dos pináculos. Os desafios ocorrem junto com cada pináculo.',
    cartao(null, linhaDoTempo(m)),
    blocoTexto(EXPLICACOES_FUTURO.desafios, ctx),
    blocoTexto(EXPLICACOES_FUTURO.ciclos, ctx),
    blocoTexto(EXPLICACOES_FUTURO.ciclosDuracao, ctx),
    blocoTexto(NOTA_CICLOS_DESAFIOS, ctx),
    tabela(['Ciclo', 'Número', 'Origem', 'Idade', 'Início', 'Pináculos abrangidos'],
      m.ciclos.itens.map((c, i) => [
        `${c.ordem}º`, c.exibicao, `${c.fonte} (${c.bruto})`, c.faixaTexto, c.dataInicio ?? 'Nascimento',
        ['1º', '2º, 3º e nove primeiros anos do 4º', 'restante do 4º'][i],
      ])),
    m.ciclos.itens.map((c) => cartao(`${c.ordem}º ciclo: ${c.exibicao}, ${c.faixaTexto}`, textoCiclo(c, ctx))),
    tabela(['Desafio', 'Fórmula', 'Conta', 'Com o pináculo', 'Idade'],
      m.desafios.itens.map((d, i) => [`${d.ordem}º`, d.formula, d.conta, `${d.ordem}º (${m.pinaculos.itens[i].exibicao})`, d.faixaTexto])),
    m.desafios.itens.map((d) => cartao(`${d.ordem}º desafio: ${d.exibicao}`, textoDesafio(d, ctx))),
  );
}

export function navegadorAno(ctx) {
  const ano = ctx.estado.mapa.anoConsulta;
  return h('div', { class: 'navegador-ano sem-impressao' },
    h('button', { type: 'button', class: 'botao secundario', onClick: () => ctx.acoes.definirAno(ano - 1), 'aria-label': 'Ano anterior' }, '← Anterior'),
    h('div', { class: 'campo' },
      h('label', { for: 'ano-consulta' }, 'Ano'),
      h('input', {
        id: 'ano-consulta', type: 'number', min: '1', max: '9999', value: ano,
        onChange: (e) => ctx.acoes.definirAno(Number(e.target.value)),
      })),
    h('button', { type: 'button', class: 'botao secundario', onClick: () => ctx.acoes.definirAno(ano + 1), 'aria-label': 'Ano seguinte' }, 'Seguinte →'));
}

export function blocoVigentes(m) {
  const v = m.vigentes;
  if (!v) return aviso('Antes do nascimento:', `o ano ${m.anoConsulta} é anterior ao nascimento; não há pináculo, ciclo ou desafio.`);
  return definicoes([
    ['Idade completada no ano', `${v.idade} anos`],
    ['Pináculo', `${v.pinaculo.ordem}º, número ${v.pinaculo.exibicao}`],
    ['Ciclo', `${v.ciclo.ordem}º, número ${v.ciclo.exibicao}`],
    ['Desafio', `${v.desafio.ordem}º, número ${v.desafio.exibicao}`],
  ]);
}

const blocoFuturo = (numero, titulo, ctx) => blocoTexto(FUTURO_POR_NUMERO[numero], ctx, { titulo });

export function secaoAno(ctx) {
  const m = ctx.estado.mapa;
  const a = m.anoPessoal;
  return secao('Ano Pessoal',
    'Soma do dia e do mês de nascimento ao número universal do ano. Consulte qualquer ano.',
    blocoTexto(EXPLICACOES_FUTURO.ano, ctx),
    navegadorAno(ctx),
    cartao(`Ano Pessoal ${a.exibicao} em ${a.ano}`,
      definicoes([
        ['Ano Universal', `${a.universal.conta}`],
        ['Ano Pessoal', a.conta],
      ]),
      blocoFuturo(a.valor, `O que o número ${a.valor} indica`, ctx),
      a.mestre && blocoFuturo(a.mestre, `Registro do número ${a.mestre} no caminho da soma`, ctx)),
    cartao(`Vigentes em ${m.anoConsulta}`, blocoVigentes(m)),
    [3, 5, 6].includes(a.valor) && cartao('Sobre relacionamentos', blocoTexto(RELACIONAMENTOS.casamento, ctx)),
  );
}

export function secaoMes(ctx) {
  const m = ctx.estado.mapa;
  const mesAtual = m.mesesPessoais[ctx.estado.mes - 1];
  return secao('Mês Pessoal',
    'Ano Pessoal + número do mês do calendário. O dígito final é o mesmo se o mês for reduzido antes; só o registro de 11/22 pode mudar.',
    blocoTexto(EXPLICACOES_FUTURO.mes, ctx),
    navegadorAno(ctx),
    h('div', { class: 'meses' },
      m.mesesPessoais.map((mes) =>
        h('button', {
          type: 'button',
          class: 'mes',
          'aria-pressed': String(mes.mes === mesAtual.mes),
          onClick: () => ctx.acoes.definirMes(mes.mes),
        },
        h('span', { class: 'mes-nome' }, mes.nomeMes),
        h('span', { class: 'mes-valor' }, mes.exibicao)))),
    cartao(`${mesAtual.nomeMes} de ${m.anoConsulta}: Mês Pessoal ${mesAtual.exibicao}`,
      definicoes([
        ['Ano Pessoal', `${m.anoPessoal.exibicao} em ${m.anoPessoal.ano}`],
        ['Mês do calendário', String(mesAtual.mes)],
        ['Soma', mesAtual.conta],
      ]),
      blocoFuturo(mesAtual.valor, `O que o número ${mesAtual.valor} indica`, ctx),
      mesAtual.mestre !== mesAtual.mestreComMesReduzido && h('p', { class: 'ajuda' },
        'Se o mês fosse reduzido antes da soma, o registro de 11 ou 22 mudaria, mas o dígito final seria o mesmo. O livro não define este ponto.'),
      mesAtual.mestre && blocoFuturo(mesAtual.mestre, `Registro do número ${mesAtual.mestre} no caminho da soma`, ctx)),
  );
}
