import { registro } from './provenance.js';

const r = (chave, paginaInicial, paginaFinal, interpretacao, extras = {}) =>
  registro({
    chave: `relacao.${chave}`,
    capitulo: 8,
    paginaInicial,
    paginaFinal,
    categoria: 'relacionamento',
    numero: null,
    interpretacao,
    ...extras,
  });

/** Regras e interpretações do cap. 8 (p. 68–72). */
export const RELACIONAMENTOS = Object.freeze({
  similares: r('similares', 68, 68, 'Números do mesmo grupo harmônico trazem harmonia aos relacionamentos íntimos.', {
    observacaoEditorial: 'O texto diz que isso ocorre quando os números de Ambição e de Destino são "iguais"; o quadro fala em grupos. O aplicativo adota o grupo e indica igualdade exata à parte.',
  }),
  complementares: r('complementares', 68, 68, 'Dois números pares ou dois ímpares: vibrações diferentes, em que cada pessoa contribui com o que falta à outra e ambas se ajustam.'),
  opostos: r('opostos', 68, 69, 'Um número par e outro ímpar, de harmônicos diferentes: dificuldade de compreensão e de conciliar ideais; há grande atração pelo diferente e choque de personalidades.'),
  somaExpressao: r('soma-expressao', 69, 69, 'Somar as duas Expressões mostra em que direção seguir com a pessoa. O livro exemplifica só dois resultados: 1 (trabalhar, estudar, organizar e iniciar um projeto em conjunto) e 2 (se as circunstâncias forem favoráveis, apaixonar-se, casar e ter filhos).'),
  somaDestino: r('soma-destino', 69, 69, 'O mesmo princípio vale para as datas. No exemplo, Destinos 6 e 9 somam 15 → 6, ambos do Ar: compreensão mútua, da qual pode nascer amizade, sociedade, casamento ou colaboração.'),
  analiseCompleta: r('analise-completa', 69, 69, 'Havendo interesse sério, comparar os dois mapas e analisar os pináculos e os ciclos; o restante cabe a um perito em numerologia.'),
  paridade: r('paridade', 70, 70, 'Os pares são os "realizadores": positivos, objetivos e extrovertidos. Os ímpares são os "pensadores": negativos, subjetivos, intuitivos e introvertidos. Ninguém é totalmente um ou outro; há apenas tendências.', {
    observacaoEditorial: 'A p. 70 se contradiz: logo depois afirma que o predomínio de pares indica um tipo "mais negativo, subjetivo e imaginativo". O aplicativo adota a conclusão final do parágrafo.',
  }),
  casamento: r('casamento', 70, 71, 'O 6 é o número do casamento, sobretudo como Expressão ou Destino. Os anos pessoais citados são 3, 5 e 6 (o 6 é o mais promissor; o 5 traz atração e ciúme). Pináculo ou Realidade 6 ou 2 indicam companhia nos últimos anos. Com Realidade 6, o amor duradouro surgiria tarde na vida.', {
    observacaoEditorial: 'Indicações simbólicas da autora. O aplicativo não calcula probabilidade de casamento.',
  }),
  mudancaNome: r('mudanca-nome', 71, 72, 'Mudar de nome é possível e pode acrescentar qualidades, sem apagar a vibração do nome original. Para a literatura, a autora cita 3, 6 e 9; para os negócios, o 8. Aconselha levar em conta Destino e nascimento e consultar um perito.'),
});

export const NOTA_REALIDADE = registro({
  chave: 'realidade.objetivo',
  capitulo: 5,
  paginaInicial: 46,
  categoria: 'realidade',
  numero: null,
  interpretacao:
    'A soma de Expressão e Destino mostra em que direção a pessoa trabalha; faz parte da personalidade, intensifica-se com o tempo e pesa mais na segunda metade da vida.',
});
