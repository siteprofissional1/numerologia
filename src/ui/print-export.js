/**
 * Monta o relatório completo reaproveitando componentes das telas individuais.
 * A impressão usa window.print e print.css, portanto o PDF mantém o mesmo conteúdo
 * exibido pelo navegador sem precisar de um servidor ou biblioteca de exportação.
 */
import { DIAS_NASCIMENTO } from '../data/birth-days.js';
import { ELEMENTOS_TEXTO } from '../data/elements.js';
import { FUTURO_POR_NUMERO } from '../data/general-meanings.js';
import { APTIDOES, FALTAS } from '../data/intensification.js';
import { EXPLICACOES_FUTURO, NOTA_CICLOS_DESAFIOS, PINACULOS_SIGNIFICADOS } from '../data/pinnacle-meanings.js';
import { NOTA_REALIDADE } from '../data/relationships.js';
import { DEFINICOES_POSICOES } from '../data/position-definitions.js';
import { NOTAS_PLANOS, PLANOS } from '../data/expression-planes.js';
import {
  blocoTexto, definicoes, etapas, listaNumeros, secao, tabela,
} from './components.js';
import { h } from './dom.js';
import {
  blocoVigentes, cabecalhoMapa, explicacaoQuadro, graficoFrequencias, registrosDaPosicao, textoCiclo, textoDesafio,
} from './render.js';
import { barraDoTempo } from './timeline.js';

export function secaoRelatorio(ctx) {
  const m = ctx.estado.mapa;
  const texto = (registro, opcoes = {}) => blocoTexto(registro, ctx, opcoes);
  const f = m.frequencias;
  // A numeração acompanha a ordem das seções.
  let numero = 0;
  // Cada chamada cria uma seção numerada; não é necessário manter números escritos à mão.
  const parte = (titulo, ...filhos) => {
    numero += 1;
    return h('section', { class: 'secao-relatorio bloco' }, h('h3', {}, `${numero}. ${titulo}`), filhos);
  };

  // A ordem abaixo também define a ordem de leitura e impressão do mapa completo.
  return secao('Mapa completo', null,
    cabecalhoMapa(ctx, h('div', { class: 'acoes sem-impressao' },
      h('button', { type: 'button', class: 'botao', onClick: () => window.print() }, 'Imprimir / Salvar como PDF'))),

    parte('Dados utilizados', definicoes([
      ['Nome recebido ao nascer', m.pessoa.nome],
      ['Data de nascimento', m.pessoa.data],
      ['Ano de consulta', String(m.anoConsulta)],
      m.analise.transformacoes.length > 0 && ['Convenção de acentos', m.analise.transformacoes.map((t) => `${t.de}→${t.para}`).join(', ')],
    ])),
    parte('Conversão do nome em números',
      tabela(['Palavra', 'Vogais', 'Consoantes'], m.analise.palavras.map((p) => {
        const letras = (tipo) =>
          p.letras.filter((l) => l.tipo === tipo).map((l) => `${l.normalizada} = ${l.valor}`).join(', ') || '—';
        return [p.original, letras('vogal'), letras('consoante')];
      }))),
    [m.ambicao, m.personalidade, m.expressao].map((p) =>
      parte(`${p.rotulo}: ${p.exibicao}`,
        texto(DEFINICOES_POSICOES[p.chave]),
        etapas(p.passos),
        registrosDaPosicao(p, m).map((r) => texto(r, { titulo: `Número ${r.numero}` })))),
    parte('Frequência numérica', graficoFrequencias(m),
      definicoes([['Presentes', listaNumeros(f.presentes)], ['Ausentes', listaNumeros(f.ausentes)], ['Mais frequentes', listaNumeros(f.maisFrequentes)]])),
    parte('Aptidões e ausências',
      f.maisFrequentes.map((n) => texto(APTIDOES[n], { titulo: `Aptidão do número ${n}` })),
      f.presentes.filter((n) => !f.maisFrequentes.includes(n)).map((n) =>
        texto(APTIDOES[n], { titulo: `Outro número presente: ${n}` })),
      m.suprimentos.map((s) => [
        texto(FALTAS[s.numero], { titulo: `Falta do número ${s.numero}` }),
        s.suprido && h('p', { class: 'ajuda' }, `Suprido por: ${s.supridoPor.join(', ')}.`),
      ])),
    parte('Planos de expressão',
      tabela(['Plano', 'Números', 'Quantidade de letras'], Object.entries(PLANOS).map(([chave, plano]) =>
        [plano.nome, plano.numero.join(', '), String(m.planos[chave])])),
      Object.entries(PLANOS).map(([chave, plano]) => texto(plano, { titulo: `${plano.nome}: ${m.planos[chave]}` })),
      texto(NOTAS_PLANOS.numeroAlto),
      m.frequencias.contagem[7] <= 1 && texto(NOTAS_PLANOS.emocoesReprimidas, { titulo: 'Observação do livro sobre o número 7' })),
    parte(`Dia de nascimento: ${m.dia.dia}`, texto(DIAS_NASCIMENTO[m.data.dia], { titulo: DIAS_NASCIMENTO[m.data.dia].titulo })),
    parte(`Elemento harmônico: ${m.dia.elemento.nome}`, texto(ELEMENTOS_TEXTO[m.dia.chaveElemento])),
    parte(`Caminho do Destino: ${m.destino.exibicao}`,
      texto(DEFINICOES_POSICOES.destino),
      etapas(m.destino.passos),
      registrosDaPosicao(m.destino, m).map((r) => texto(r, { titulo: `Destino ${r.numero}: ${r.tema}` }))),
    parte(`Realidade: ${m.realidade.exibicao}`,
      texto(DEFINICOES_POSICOES.realidade),
      etapas(m.realidade.passos),
      texto(NOTA_REALIDADE),
      registrosDaPosicao(m.realidade, m).map((r) => texto(r, { titulo: `Número ${r.numero}` }))),
    parte('Quadro 3×3', explicacaoQuadro(m, ctx)),
    parte('Quatro pináculos',
      texto(EXPLICACOES_FUTURO.pinaculos),
      texto(EXPLICACOES_FUTURO.pinaculosDuracao),
      barraDoTempo(m.pinaculos.itens, m),
      faseAtual(m, 'pinaculo', 'pináculo'),
      m.pinaculos.itens.map((p, i, todos) => {
        const titulo = `${p.ordem}º pináculo: ${p.exibicao}, ${p.faixaTexto}. ${p.conta}`;
        return repetido(p, i, todos, 'pináculo', titulo) ?? texto(PINACULOS_SIGNIFICADOS[p.valor], { titulo });
      })),
    parte('Quatro desafios',
      texto(EXPLICACOES_FUTURO.desafios),
      barraDoTempo(m.desafios.itens, m),
      faseAtual(m, 'desafio', 'desafio'),
      texto(NOTA_CICLOS_DESAFIOS),
      m.desafios.itens.map((d, i, todos) => {
        const titulo = `${d.ordem}º desafio: ${d.exibicao}, ${d.faixaTexto}. ${d.conta}`;
        return repetido(d, i, todos, 'desafio', titulo) ?? textoDesafio(d, ctx, titulo);
      })),
    parte('Três ciclos',
      texto(EXPLICACOES_FUTURO.ciclos),
      texto(EXPLICACOES_FUTURO.ciclosDuracao),
      barraDoTempo(m.ciclos.itens, m),
      faseAtual(m, 'ciclo', 'ciclo'),
      m.ciclos.itens.map((c, i, todos) => {
        const titulo = `${c.ordem}º ciclo: ${c.exibicao}, ${c.faixaTexto}. ${c.fonte}`;
        return repetido(c, i, todos, 'ciclo', titulo) ?? textoCiclo(c, ctx, titulo);
      })),
    parte(`Ano Pessoal em ${m.anoConsulta}: ${m.anoPessoal.exibicao}`,
      texto(EXPLICACOES_FUTURO.ano),
      definicoes([['Ano Universal', m.anoPessoal.universal.conta], ['Ano Pessoal', m.anoPessoal.conta]]),
      m.anoPessoal.mestre && h('p', { class: 'ajuda' },
        `A soma deu ${m.anoPessoal.mestre}, que se reduz a ${m.anoPessoal.valor}. Por isso o resultado aparece como ${m.anoPessoal.exibicao}, e os dois textos abaixo valem.`),
      texto(FUTURO_POR_NUMERO[m.anoPessoal.valor], { titulo: `Número ${m.anoPessoal.valor}` }),
      m.anoPessoal.mestre && texto(FUTURO_POR_NUMERO[m.anoPessoal.mestre], { titulo: `Número ${m.anoPessoal.mestre}` }),
      h('h4', {}, `Em ${m.anoConsulta}, leia o ano junto com estas fases`),
      blocoVigentes(m)),
    parte('Meses Pessoais',
      texto(EXPLICACOES_FUTURO.mes),
      tabela(['Mês', 'Ano Pessoal + mês', 'Número'], m.mesesPessoais.map((p) => [p.nomeMes, p.conta, p.exibicao])),
      h('h4', {}, 'O que cada número indica no mês'),
      m.mesesPessoais.some((p) => p.mestre) && h('p', { class: 'ajuda' }, 'Um mês marcado como 11/2 ou 22/4 aparece nos dois números.'),
      gruposDeMeses(m.mesesPessoais).map(([numero, meses]) =>
        texto(FUTURO_POR_NUMERO[numero], { titulo: `Número ${numero}: ${LISTA.format(meses)}` }))),
  );
}

const LISTA = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });

/** Agrupa os meses por número, para não repetir o mesmo texto várias vezes. */
function gruposDeMeses(meses) {
  const grupos = new Map();
  const incluir = (numero, nome) => grupos.set(numero, [...(grupos.get(numero) ?? []), nome.toLowerCase()]);
  // Um mês com registro 11/2 ou 22/4 participa das leituras do dígito e do mestre.
  for (const mes of meses) {
    incluir(mes.valor, mes.nomeMes);
    if (mes.mestre) incluir(mes.mestre, mes.nomeMes);
  }
  return [...grupos].sort(([a], [b]) => a - b);
}

/** Destaca, abaixo da barra, a fase em que a pessoa está no ano consultado. */
function faseAtual(m, chave, nome) {
  const atual = m.vigentes?.[chave];
  return atual && h('p', { class: 'fase-atual' }, `Em ${m.anoConsulta}, aos ${m.vigentes.idade} anos: ${atual.ordem}º ${nome}, número ${atual.exibicao}.`);
}

/** Fases com o mesmo número não repetem o texto: apontam para a primeira. */
function repetido(item, indice, todos, nome, titulo) {
  const primeiro = todos.slice(0, indice).find((x) => x.valor === item.valor);
  return primeiro ? [h('h4', {}, titulo), h('p', {}, `Mesmo significado do ${primeiro.ordem}º ${nome}.`)] : null;
}
