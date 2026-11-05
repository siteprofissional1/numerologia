/**
 * Cálculos derivados do nome. analisarNome converte a entrada em palavras e letras
 * classificadas; as demais funções trabalham sobre essa estrutura já validada.
 * A interface recebe tanto o resultado quanto as etapas usadas para chegar a ele.
 */
import { ehVogalBase, valorLetra } from './alphabet.js';
import { validarNome } from './normalize-name.js';
import { exibicao, reduzirComMestres, reduzirSimples, somar, textoCaminho } from './reduce.js';

/**
 * Classifica as letras. Regra do Y (p. 16 e 45): só é vogal quando o nome
 * inteiro não tem A, E, I, O ou U. Nenhuma regra silábica externa é usada.
 */
export function analisarNome(nome, opcoes = {}) {
  const validacao = validarNome(nome, opcoes);
  if (!validacao.ok) return { ok: false, erros: validacao.erros };

  const { decomposto } = validacao;
  const todas = decomposto.palavras.flatMap((p) => p.letras);
  const temVogalBase = todas.some((l) => ehVogalBase(l.normalizada));
  // A regra de Y olha o nome inteiro, não apenas a palavra que contém essa letra.
  const yEhVogal = !temVogalBase && todas.some((l) => l.normalizada === 'Y');

  const palavras = decomposto.palavras.map((palavra) => ({
    original: palavra.original,
    letras: palavra.letras.map((letra) => ({
      ...letra,
      valor: valorLetra(letra.normalizada),
      tipo:
        ehVogalBase(letra.normalizada) || (yEhVogal && letra.normalizada === 'Y')
          ? 'vogal'
          : 'consoante',
    })),
  }));

  return {
    ok: true,
    original: decomposto.exibicao,
    modo: decomposto.modo,
    transformacoes: decomposto.transformacoes,
    yEhVogal,
    palavras,
    totalLetras: todas.length,
  };
}

/** Subtotais por palavra: 23 → 5 e 28 → 10 → 1, mas 11 e 22 ficam (Jones = 11, p. 46). */
function subtotaisPorTipo(analise, tipo) {
  // Filtra vogais ou consoantes dentro de cada palavra antes de somar os subtotais.
  // Reduzir tudo de uma vez preservaria o dígito final, mas poderia perder um 22/4.
  return analise.palavras
    .map((palavra) => {
      const letras = palavra.letras.filter((l) => l.tipo === tipo);
      const soma = somar(letras.map((l) => l.valor));
      return {
        palavra: palavra.original,
        letras: letras.map((l) => ({ letra: l.normalizada, valor: l.valor })),
        soma,
        reducao: reduzirComMestres(soma),
      };
    })
    .filter((p) => p.letras.length > 0);
}

/** Rotina compartilhada por Ambição e Personalidade; meta fornece seus nomes e fórmulas. */
function calcularPosicaoDoNome(analise, tipo, meta) {
  const subtotais = subtotaisPorTipo(analise, tipo);
  if (subtotais.length === 0) {
    // Ausência de um tipo de letra não é tratada como número zero interpretável.
    return {
      ...meta,
      indeterminado: true,
      valor: null,
      mestre: null,
      exibicao: '—',
      palavras: [],
      passos: [meta.avisoIndeterminado],
    };
  }
  const somaSubtotais = somar(subtotais.map((p) => p.reducao.valor));
  const reducao = reduzirSimples(somaSubtotais);
  // A soma bruta é uma conferência; o resultado principal segue o caminho por palavra.
  const bruto = somar(subtotais.map((p) => p.soma));
  const reducaoBruta = reduzirSimples(bruto);
  return {
    ...meta,
    indeterminado: false,
    palavras: subtotais,
    somaSubtotais,
    reducao,
    valor: reducao.valor,
    mestre: reducao.mestre,
    exibicao: exibicao(reducao),
    bruto,
    reducaoBruta,
    mestreSomaBruta: reducaoBruta.mestre,
    passos: [
      ...subtotais.map(
        (p) =>
          `${p.palavra}: ${p.letras.map((l) => l.valor).join(' + ')} = ${textoCaminho(p.reducao)}`,
      ),
      `Soma dos subtotais: ${subtotais.map((p) => p.reducao.valor).join(' + ')} = ${textoCaminho(reducao)}`,
      `Conferência pela soma bruta: ${textoCaminho(reducaoBruta)}`,
    ],
  };
}

/** Soma somente as vogais, reaproveitando a rotina de subtotais por palavra. */
export function calcularAmbicao(analise) {
  return calcularPosicaoDoNome(analise, 'vogal', {
    chave: 'ambicao',
    rotulo: 'Ambição',
    apelidos: 'estímulo interno, impulso, idealismo',
    formula: 'Soma das vogais, por palavra e depois no total',
    regra: 'R-AMBICAO',
    paginas: 'p. 16–18, 45–47',
    avisoIndeterminado:
      'O nome não tem vogais nem Y: pelo método descrito, a Ambição não pode ser determinada com segurança.',
  });
}

/** Soma somente as consoantes; a estrutura de retorno é a mesma da Ambição. */
export function calcularPersonalidade(analise) {
  return calcularPosicaoDoNome(analise, 'consoante', {
    chave: 'personalidade',
    rotulo: 'Personalidade',
    apelidos: 'impressão, aparência, eu exterior',
    formula: 'Soma das consoantes, por palavra e depois no total',
    regra: 'R-PERSONALIDADE',
    paginas: 'p. 16–18, 45–47',
    avisoIndeterminado:
      'O nome não tem consoantes: pelo método descrito, a Personalidade não pode ser determinada com segurança.',
  });
}

/** Combina Ambição e Personalidade e confere o dígito pela soma de todas as letras. */
export function calcularExpressao(analise, ambicao, personalidade) {
  const bruto = somar(analise.palavras.flatMap((p) => p.letras.map((l) => l.valor)));
  const controle = reduzirSimples(bruto);
  const meta = {
    chave: 'expressao',
    rotulo: 'Expressão',
    apelidos: 'habilidades, atitude, capacidade',
    formula: 'Ambição + Personalidade, conferida pela soma de todas as letras',
    regra: 'R-EXPRESSAO',
    paginas: 'p. 16–18, 45–47',
  };

  if (ambicao.indeterminado || personalidade.indeterminado) {
    // Mesmo sem uma das posições, todas as letras têm valores e permitem esta soma.
    return {
      ...meta,
      indeterminado: false,
      parcial: true,
      bruto,
      controle,
      reducao: controle,
      valor: controle.valor,
      mestre: controle.mestre,
      exibicao: exibicao(controle),
      confere: null,
      passos: [
        'Ambição ou Personalidade não foi determinada; a Expressão usa apenas a soma de todas as letras.',
        `Todas as letras: ${textoCaminho(controle)}`,
      ],
    };
  }

  const soma = ambicao.valor + personalidade.valor;
  const reducao = reduzirSimples(soma);
  return {
    ...meta,
    indeterminado: false,
    parcial: false,
    soma,
    bruto,
    controle,
    reducao,
    valor: reducao.valor,
    mestre: reducao.mestre,
    exibicao: exibicao(reducao),
    confere: reducao.valor === controle.valor,
    passos: [
      `Ambição ${ambicao.valor} + Personalidade ${personalidade.valor} = ${textoCaminho(reducao)}`,
      `Controle, soma de todas as letras: ${textoCaminho(controle)}`,
    ],
  };
}

/** Realidade = Expressão + Destino (p. 45–46). */
export function calcularRealidade(expressao, destino) {
  const meta = {
    chave: 'realidade',
    rotulo: 'Realidade',
    apelidos: 'objetivo, direção de vida',
    formula: 'Expressão + Destino',
    regra: 'R-REALIDADE',
    paginas: 'p. 45–46',
  };
  const soma = expressao.valor + destino.valor;
  const reducao = reduzirSimples(soma);
  return {
    ...meta,
    indeterminado: false,
    soma,
    reducao,
    valor: reducao.valor,
    mestre: reducao.mestre,
    exibicao: exibicao(reducao),
    passos: [`Expressão ${expressao.valor} + Destino ${destino.valor} = ${textoCaminho(reducao)}`],
  };
}

/** Quantas vezes cada número de 1 a 9 aparece nas letras (p. 19–22). */
export function calcularFrequencias(analise) {
  // Inclui todos os números de 1 a 9 desde o início, para registrar também as ausências.
  const contagem = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => [n, 0]));
  for (const palavra of analise.palavras) {
    for (const letra of palavra.letras) contagem[letra.valor] += 1;
  }
  const numeros = Object.keys(contagem).map(Number);
  const maior = Math.max(...Object.values(contagem));
  return {
    contagem,
    presentes: numeros.filter((n) => contagem[n] > 0),
    ausentes: numeros.filter((n) => contagem[n] === 0),
    maisFrequentes: maior > 0 ? numeros.filter((n) => contagem[n] === maior) : [],
    maiorFrequencia: maior,
    total: analise.totalLetras,
  };
}

/**
 * Faltas supridas pelas posições principais (p. 20). Inferida do exemplo de
 * David Weir: faltam 2, 3, 6, 7, 8; as posições são 6, 8, 5; restam 2, 3 e 7.
 */
export function calcularSuprimentos(frequencias, posicoes) {
  // Considera o valor principal e sua leitura reduzida ao procurar uma posição equivalente.
  return frequencias.ausentes.map((numero) => {
    const supridoPor = posicoes
      .filter((p) => p.valor !== null && (p.valor === numero || p.reduzido === numero))
      .map((p) => p.rotulo);
    return { numero, supridoPor, suprido: supridoPor.length > 0 };
  });
}

export const GRUPOS_PLANOS = Object.freeze({
  materiais: Object.freeze([4, 5]),
  emocionais: Object.freeze([2, 3, 6]),
  mentais: Object.freeze([1, 8]),
  intuitivos: Object.freeze([7, 9]),
});

/** Soma QUANTIDADES de letras, nunca os valores dos algarismos (p. 47–48). */
export function calcularPlanos(frequencias) {
  const planos = {};
  for (const [plano, numeros] of Object.entries(GRUPOS_PLANOS)) {
    // Ex.: duas letras de valor 4 e três de valor 5 formam cinco letras no plano material.
    planos[plano] = somar(numeros.map((n) => frequencias.contagem[n]));
  }
  const maior = Math.max(...Object.values(planos));
  return {
    ...planos,
    maiores: Object.keys(planos).filter((p) => planos[p] === maior),
  };
}

/** Pares e ímpares no nome e na data (p. 70), sem concluir a predominância "geral". */
export function calcularParidade(frequencias, digitosData) {
  // No nome, cada repetição conta uma vez; na data, usa os algarismos originais sem zeros.
  let pares = 0;
  let impares = 0;
  for (const [numero, vezes] of Object.entries(frequencias.contagem)) {
    if (Number(numero) % 2 === 0) pares += vezes;
    else impares += vezes;
  }
  for (const digito of digitosData) {
    if (digito % 2 === 0) pares += 1;
    else impares += 1;
  }
  return {
    pares,
    impares,
    predominio: pares === impares ? 'empate' : pares > impares ? 'pares' : 'impares',
  };
}
