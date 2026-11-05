/**
 * Coordena as funções matemáticas e devolve um objeto único para todas as telas.
 * Recebe nome, data em DD/MM/AAAA, ano de consulta e opções de regras.
 * Uma entrada inválida devolve { ok: false, erros }; uma válida inclui os resultados.
 * Não monta HTML nem salva perfis: o mesmo motor pode ser usado nos testes sem navegador.
 */
import { OBRA, resolverRegras } from '../config/rules.js';
import { calcularQuadro } from './birth-grid.js';
import {
  calcularComponentes,
  calcularDestino,
  calcularDiaNascimento,
  formatarData,
  interpretarData,
} from './birth-numbers.js';
import { calcularDesafios } from './challenges.js';
import { calcularCiclos } from './cycles.js';
import {
  analisarNome,
  calcularAmbicao,
  calcularExpressao,
  calcularFrequencias,
  calcularParidade,
  calcularPersonalidade,
  calcularPlanos,
  calcularRealidade,
  calcularSuprimentos,
} from './name-numbers.js';
import { calcularAnoPessoal, calcularMesesPessoais, exigirAno, vigentesNaIdade } from './personal-periods.js';
import { calcularPinaculos } from './pinnacles.js';

/** Calcula os números que dependem só do nome. */
export function calcularNumerosDoNome(nome, regras) {
  const analise = analisarNome(nome, { modo: regras.normalizacao });
  if (!analise.ok) return analise;
  // Expressão depende das duas posições anteriores; frequências contam todas as letras.
  const ambicao = calcularAmbicao(analise);
  const personalidade = calcularPersonalidade(analise);
  const expressao = calcularExpressao(analise, ambicao, personalidade);
  const frequencias = calcularFrequencias(analise);
  return {
    ok: true,
    analise,
    ambicao,
    personalidade,
    expressao,
    frequencias,
    planos: calcularPlanos(frequencias),
  };
}

/** Monta o mapa completo. Função pura: sem DOM, sem relógio e sem rede. */
export function gerarMapa({ nome, data, anoConsulta, regras: parciais } = {}) {
  const regras = resolverRegras(parciais);
  const erros = [];
  // Reúne os erros de nome e data para o usuário corrigir ambos na mesma tentativa.
  const numerosNome = calcularNumerosDoNome(nome, regras);
  if (!numerosNome.ok) erros.push(...numerosNome.erros);
  const dataInterpretada = interpretarData(data);
  if (!dataInterpretada.ok) erros.push(...dataInterpretada.erros);
  if (erros.length > 0) return { ok: false, erros };

  // Daqui em diante a data já foi validada; cada parte é um inteiro.
  const dataPura = { dia: dataInterpretada.dia, mes: dataInterpretada.mes, ano: dataInterpretada.ano };
  const ano = anoConsulta ?? dataPura.ano;
  exigirAno(ano);

  const { analise, ambicao, personalidade, expressao, frequencias, planos } = numerosNome;
  // A ordem importa: Realidade depende do Destino; os períodos usam os pináculos.
  const componentes = calcularComponentes(dataPura, regras);
  const destino = calcularDestino(componentes);
  const realidade = calcularRealidade(expressao, destino);
  const dia = calcularDiaNascimento(dataPura);
  const quadro = calcularQuadro(dataPura);
  const pinaculos = calcularPinaculos(componentes, destino, dataPura, regras);
  const ciclos = calcularCiclos(componentes, pinaculos, dataPura);
  const desafios = calcularDesafios(componentes, pinaculos);
  const anoPessoal = calcularAnoPessoal(componentes, ano);

  // Uma ausência nas letras pode ser suprida por uma posição principal.
  // null distingue posição indeterminada de um resultado numérico válido.
  const posicoesPrincipais = [ambicao, personalidade, expressao, destino, realidade, dia].map((p) => ({
    rotulo: p.rotulo,
    valor: p.indeterminado ? null : p.valor,
    reduzido: p.indeterminado ? null : (p.reduzido ?? p.valor),
  }));

  // Além do valor final, cada posição mantém passos e subtotais para explicar a conta.
  const mapa = {
    ok: true,
    fonte: { ...OBRA, aviso: 'Interpretações simbólicas da autora; não são fatos científicos nem previsões garantidas.' },
    regras,
    pessoa: { nome: analise.original, data: formatarData(dataPura) },
    data: dataPura,
    analise,
    ambicao,
    personalidade,
    expressao,
    destino,
    realidade,
    dia,
    frequencias,
    suprimentos: calcularSuprimentos(frequencias, posicoesPrincipais),
    planos,
    paridade: calcularParidade(frequencias, quadro.digitos),
    componentes,
    quadro,
    pinaculos,
    ciclos,
    desafios,
    anoConsulta: ano,
    anoPessoal,
    mesesPessoais: calcularMesesPessoais(anoPessoal),
  };
  // Considera a idade completada no ano, sem depender de o aniversário já ter ocorrido.
  mapa.vigentes = vigentesNaIdade(mapa, ano - dataPura.ano);
  return mapa;
}
