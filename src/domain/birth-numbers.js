/** Validação do calendário e posições derivadas da data de nascimento. */
import { exibicao, reduzirComMestres, reduzirSimples, somar, textoCaminho } from './reduce.js';

/** Regra gregoriana: séculos só são bissextos se também forem divisíveis por 400. */
export function ehBissexto(ano) {
  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}

/** Devolve o limite usado para recusar datas como 31/04 ou 29/02 em ano comum. */
export function diasNoMes(mes, ano) {
  if (mes === 2) return ehBissexto(ano) ? 29 : 28;
  return [4, 6, 9, 11].includes(mes) ? 30 : 31;
}

/**
 * Interpreta DD/MM/AAAA só com aritmética de inteiros. Não usa o objeto Date,
 * portanto datas antigas não sofrem efeito de fuso horário.
 */
export function interpretarData(texto) {
  const entrada = String(texto ?? '').trim();
  if (entrada === '') return { ok: false, erros: ['Informe a data de nascimento.'] };
  // A expressão verifica o formato; a validade do dia é conferida depois pelo calendário.
  const partes = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(entrada);
  if (!partes) return { ok: false, erros: ['Use o formato DD/MM/AAAA, por exemplo 15/03/1985.'] };

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);
  if (ano < 1) return { ok: false, erros: ['O ano precisa ser maior que zero.'] };
  if (mes < 1 || mes > 12) return { ok: false, erros: ['O mês precisa estar entre 1 e 12.'] };
  const limite = diasNoMes(mes, ano);
  if (dia < 1 || dia > limite) {
    const mensagem =
      mes === 2 && dia === 29
        ? `${ano} não é ano bissexto: 29/02 não existe.`
        : `O dia ${dia} não existe no mês ${mes} de ${ano}: o último dia é ${limite}.`;
    return { ok: false, erros: [mensagem] };
  }
  return { ok: true, dia, mes, ano };
}

/** Normaliza a apresentação com zeros à esquerda, sem transformar a data em horário. */
export function formatarData({ dia, mes, ano }) {
  const p = (n, t = 2) => String(n).padStart(t, '0');
  return `${p(dia)}/${p(mes)}/${p(ano, 4)}`;
}

/** Guarda as duas reduções de cada parte da data para poder explicar as alternativas. */
function componente(rotulo, bruto, politica) {
  const comMestres = reduzirComMestres(bruto);
  const simples = reduzirSimples(bruto);
  return {
    rotulo,
    bruto,
    reducao: comMestres,
    caminhoSimples: simples.caminho,
    simples: simples.valor,
    mestre: comMestres.mestre,
    /** Valor usado nas somas, conforme a política escolhida. */
    usado: politica === 'preservar' ? comMestres.valor : simples.valor,
    exibicao: exibicao(comMestres),
  };
}

/** D, M e A reduzidos, como em 21.4.1942 = 3 + 4 + 7 (p. 55). */
export function calcularComponentes(data, regras) {
  const politica = regras.componentesMestres;
  return {
    politica,
    dia: componente('Dia', data.dia, politica),
    mes: componente('Mês', data.mes, politica),
    ano: componente('Ano', data.ano, politica),
  };
}

/** A chave seleciona qual leitura de dia, mês e ano será somada para obter o Destino. */
function destinoPorPolitica(componentes, chaveValor) {
  const parcelas = ['dia', 'mes', 'ano'].map((c) => componentes[c][chaveValor]);
  return { parcelas, reducao: reduzirComMestres(somar(parcelas)) };
}

/** Destino = D + M + A; 11 e 22 finais não são reduzidos (p. 23). */
export function calcularDestino(componentes) {
  const chave = componentes.politica === 'preservar' ? 'usado' : 'simples';
  const { parcelas, reducao } = destinoPorPolitica(componentes, chave);
  const temMestreNoComponente = ['dia', 'mes', 'ano'].some((c) => componentes[c].mestre);

  let alternativa = null;
  if (temMestreNoComponente) {
    // Só mostra uma alternativa quando conservar um componente mestre muda o Destino.
    const outra = componentes.politica === 'preservar'
      ? destinoPorPolitica(componentes, 'simples').reducao
      : reduzirComMestres(
          somar(['dia', 'mes', 'ano'].map((c) => componentes[c].reducao.valor)),
        );
    if (outra.valor !== reducao.valor) {
      alternativa = { valor: outra.valor, caminho: textoCaminho(outra), exibicao: exibicao(outra) };
    }
  }

  return {
    chave: 'destino',
    rotulo: 'Caminho do Destino',
    apelidos: 'padrão do destino',
    formula: 'Dia + Mês + Ano, reduzidos; 11 e 22 finais são conservados',
    regra: 'R-DESTINO',
    paginas: 'p. 23–30, 45–46',
    indeterminado: false,
    parcelas,
    soma: reducao.entrada,
    reducao,
    valor: reducao.valor,
    reduzido: reducao.reduzido,
    mestre: reducao.mestre,
    exibicao: exibicao(reducao),
    alternativa,
    passos: [
      `Dia ${componentes.dia.bruto} = ${textoCaminho(componentes.dia.reducao)}`,
      `Mês ${componentes.mes.bruto} = ${textoCaminho(componentes.mes.reducao)}`,
      `Ano ${componentes.ano.bruto} = ${textoCaminho(componentes.ano.reducao)}`,
      `${parcelas.join(' + ')} = ${textoCaminho(reducao)}`,
    ],
  };
}

/** Elementos harmônicos do nascimento (p. 31–32). */
export const ELEMENTOS = Object.freeze({
  agua: Object.freeze({
    nome: 'Água',
    titulo: 'Elemento Científico',
    numeros: Object.freeze([1, 5, 7]),
    dias: Object.freeze([1, 5, 7, 10, 14, 16, 19, 23, 25, 28]),
  }),
  fogo: Object.freeze({
    nome: 'Fogo',
    titulo: 'Elemento dos Negócios',
    numeros: Object.freeze([2, 4, 8, 11, 22]),
    dias: Object.freeze([2, 4, 8, 11, 13, 17, 20, 22, 26, 29, 31]),
  }),
  ar: Object.freeze({
    nome: 'Ar',
    titulo: 'Elemento Artístico',
    numeros: Object.freeze([3, 6, 9]),
    dias: Object.freeze([3, 6, 9, 12, 15, 18, 21, 24, 27, 30]),
  }),
});

/** Procura o dia original na tabela; não deduz o grupo pela soma da data completa. */
export function elementoDoDia(dia) {
  return Object.keys(ELEMENTOS).find((k) => ELEMENTOS[k].dias.includes(dia)) ?? null;
}

/** Consulta por número, usada na comparação de posições entre duas pessoas. */
export function elementoDoNumero(numero) {
  return Object.keys(ELEMENTOS).find((k) => ELEMENTOS[k].numeros.includes(numero)) ?? null;
}

/** Reúne dia original, redução auxiliar e elemento sem trocar a leitura específica do dia. */
export function calcularDiaNascimento(data) {
  const reducao = reduzirComMestres(data.dia);
  const chaveElemento = elementoDoDia(data.dia);
  return {
    chave: 'dia',
    rotulo: 'Dia de nascimento',
    formula: 'A interpretação é a do dia original (1 a 31), nunca a do número reduzido',
    regra: 'R-DIA',
    paginas: 'p. 31–44',
    dia: data.dia,
    reducao,
    valor: reducao.valor,
    reduzido: reducao.reduzido,
    exibicao: String(data.dia),
    chaveElemento,
    elemento: ELEMENTOS[chaveElemento],
    numeroAssociado: reducao.valor,
    passos: [`Dia ${data.dia}: ${textoCaminho(reducao)}`, `Elemento: ${ELEMENTOS[chaveElemento].nome}`],
  };
}
