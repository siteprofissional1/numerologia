/**
 * Significados por número, afinidades e recortes sobre períodos futuros.
 * As afinidades são consultadas pelo domínio; as interpretações da tela vêm da transcrição
 * identificada por chave. Uma mesma posição pode mostrar o dígito e seu mestre intermediário.
 */
import { registro } from './provenance.js';

/** Listas de "Afinidades" exatamente como aparecem em cada número (cap. 1). */
export const AFINIDADES = Object.freeze({
  1: [2, 4, 7],
  2: [1, 7],
  3: [6, 9],
  4: [2, 8],
  5: 'todos',
  6: [6, 3, 9],
  7: [1, 2, 4],
  8: [2, 4, 11, 22],
  9: [3, 6],
  11: [2, 4, 8, 22],
  22: [2, 11, 8],
});

const g = (numero, paginaInicial, paginaFinal, campos) =>
  registro({
    chave: `geral.${numero}`,
    capitulo: 1,
    paginaInicial,
    paginaFinal,
    categoria: 'significado-geral',
    numero,
    afinidades: AFINIDADES[numero],
    ...campos,
  });

/** Significados gerais, p. 6–15. `futuro` serve à leitura de ano e mês pessoais (p. 54). */
export const SIGNIFICADOS_GERAIS = Object.freeze({
  1: g(1, 6, 6, {
    regente: 'Sol',
    interpretacao:
      'Perfil dinâmico, independente, original e criativo, que gosta de realizar e de orientar outras pessoas; associado a coragem, liderança e decisão. O risco está tanto na indecisão e na falta de confiança quanto no excesso: dominação, egocentrismo e intolerância.',
    futuro: 'Indica novidades e início de projetos; o êxito pede deixar o passado para trás e agir com determinação e coragem.',
    cores: 'amarelo, ouro, bronze',
    dias: 'domingo e segunda-feira',
  }),
  2: g(2, 6, 7, {
    regente: 'Lua',
    interpretacao:
      'Gentileza, tato, adaptabilidade e compreensão; valoriza lar, família e harmonia, e obtém as coisas por diplomacia e não por luta. O risco é a passividade, o excesso de tolerância ou de preocupação com detalhes, o mau humor e a oscilação entre contenção e emoção excessiva; precisa de equilíbrio.',
    futuro: 'Pede prevenção e cautela: é hora de esperar, pois o tempo das decisões ainda não chegou.',
    cores: 'todos os tons pastéis',
    dias: 'domingo e segunda-feira',
  }),
  3: g(3, 7, 8, {
    regente: 'Júpiter',
    interpretacao:
      'Número da autoexpressão, com talento para falar e escrever; natureza feliz e otimista, que estimula e entretém, precisa de amigos e vida social e busca o sucesso em teatro, música, canto e outras formas criativas. O risco é reprimir esse potencial, dispersar-se sem objetivo ou cair na presunção, no esnobismo e no cinismo.',
    futuro: 'Não há obstáculos no caminho, e a felicidade está por perto.',
    cores: 'todos os tons de violeta e púrpura',
    dias: 'quinta-feira',
  }),
  4: g(4, 8, 9, {
    regente: 'Urano, em sua órbita mais próxima de Saturno',
    interpretacao:
      'Número da determinação: pessoas sérias, construtivas e afeitas ao trabalho, à rotina e aos detalhes, confiáveis e persistentes, que encaram limites como estímulo. O risco é usar a força de vontade de modo destrutivo, obstinar-se no erro ou tornar-se negligente e incapaz de concentração.',
    futuro: 'Convém diminuir o ritmo e trabalhar para conseguir mudanças.',
    cores: 'cinzenta',
    dias: 'sábado, domingo e segunda-feira',
  }),
  5: g(5, 9, 10, {
    regente: 'Mercúrio',
    interpretacao:
      'Pensa e age depressa, preza a liberdade e a variação e detesta a rotina; afinidade com viagens, vendas, artes criativas e comunicação, além de magnetismo e atração sexual. O risco é usar a facilidade de expressão para enganar, fugir de responsabilidades e tornar-se pessimista ou destrutivo.',
    futuro: 'Convém avançar e mudar, buscar contato com os outros, apostar no próprio talento e agarrar as chances que surgirem.',
    cores: 'todas as cores claras e brilhantes',
    dias: 'quarta-feira',
  }),
  6: g(6, 10, 11, {
    regente: 'Vênus',
    interpretacao:
      'O idealista romântico: afetuoso, atraente, voltado ao amor, à família e ao lar, com senso de beleza, perfeccionismo, ideias conservadoras e capacidade prática de assumir responsabilidades. O sucesso vem do equilíbrio diplomático; o fracasso, de impor ideais, de possessividade, ciúme e interferência na vida alheia.',
    futuro: 'Há ajustes a fazer no lar e, talvez, entre parceiros; governa tanto o casamento quanto o divórcio, e o conselho é não adiar.',
    cores: 'azul e rosa',
    dias: 'sexta-feira',
  }),
  7: g(7, 11, 12, {
    regente: 'Netuno',
    interpretacao:
      'Introvertido, reservado e solitário: o pensador, o místico, o filósofo. Busca paz e crescimento espiritual e pode ser criador e artístico quando usa bem essas características. O lado baixo é ilusório: fuga da realidade, que pode levar a drogas, bebida, promiscuidade e doença.',
    futuro: 'Uma aura de autodecepção pode dificultar a vida; amizades e compromissos tendem a não se firmar por autocrítica e fuga da realidade.',
    cores: 'tons pastéis, branco e cinza claro',
    dias: 'domingo e segunda-feira',
  }),
  8: g(8, 12, 13, {
    regente: 'Saturno',
    interpretacao:
      'Realista, boa organização, energia e ambição, com atração por grandes negócios e olho para o valor real das coisas. Sem ideais e sem atenção ao lado espiritual e emocional, a busca de poder material leva a grandes erros. Precisa de afeto, mas tem dificuldade de expressá-lo; o casamento liga-se à segurança e ao dinheiro.',
    futuro: 'Não é tempo de ficar parado: o progresso pede trabalho e responsabilidades assumidas. O casamento é assunto sério, com base financeira.',
    cores: 'todos os tons escuros, do marrom ao preto',
    dias: 'sábado',
  }),
  9: g(9, 13, 14, {
    regente: 'Marte',
    interpretacao:
      'Fecha o círculo de 1 a 9: energia, impulso, otimismo e generosidade com compaixão, voltados a grandes causas e ao amor por todos. Intuitivo e líder, realiza-se servindo aos outros, com viagens, comunicação e negócios no exterior. Só fracassa se o egoísmo e a estreiteza entrarem em seus pensamentos.',
    futuro: 'Nada deve ser iniciado: é o fim de um ciclo, e o que vier depois será novo. Encerra relacionamentos em todas as esferas.',
    cores: 'todos os tons do rosa ao vermelho',
    dias: 'terça-feira',
  }),
  11: g(11, 14, 15, {
    regente: 'Urano',
    interpretacao:
      'Com o 22, é o de maior vibração: força espiritual, idealismo e visão à frente do tempo, mente inventiva e intuitiva, busca da verdade sem ortodoxia; muitas vezes em solidão. Como a vibração é forte, o fracasso é frequente em quem não a absorve, tornando-se excêntrico, ingênuo e presa de charlatães.',
    futuro: 'Tempo tanto de aprender quanto de ensinar e apresentar ideias, mesmo as consideradas progressistas e radicais.',
    cores: 'todos os tons vivos',
    dias: 'domingo e segunda-feira',
  }),
  22: g(22, 15, 15, {
    regente: 'oitava mais alta do número 4',
    interpretacao:
      'Altíssima vibração: idealismo intelectualizado com enorme potencial de concretização, graças à visão de conjunto; favorece planejar, construir e criar. As dificuldades surgem ao perder-se em detalhes, ao deixar-se dirigir por visões mais estreitas ou ao temer destruir e fracassar.',
    futuro: 'Mensagem de avançar sem receio e sem se deixar deter: às vezes é preciso destruir para construir, e o resultado será bom.',
    cores: 'amarelo, ouro e azul vivo',
    dias: 'segunda-feira',
  }),
});

/** Trecho "quanto ao futuro" de cada número, lido em Ano e Mês Pessoal (p. 54). */
export const FUTURO_POR_NUMERO = Object.freeze(
  Object.fromEntries(
    Object.values(SIGNIFICADOS_GERAIS).map((g) => [
      g.numero,
      registro({
        chave: `futuro.${g.numero}`,
        capitulo: 1,
        paginaInicial: g.paginaInicial,
        paginaFinal: g.paginaFinal,
        categoria: 'futuro',
        numero: g.numero,
        interpretacao: g.futuro,
      }),
    ]),
  ),
);
