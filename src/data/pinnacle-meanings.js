import { registro } from './provenance.js';

const p = (numero, paginaInicial, interpretacao) =>
  registro({ chave: `pinaculo.${numero}`, capitulo: 6, paginaInicial, categoria: 'pinaculo', numero, interpretacao });

/** "Pequena explanação sobre o significado dos Pináculos", p. 57–58. */
export const PINACULOS_SIGNIFICADOS = Object.freeze({
  1: p(1, 57, 'Oportunidades de independência e originalidade, à frente das coisas; período ativo, de manter-se sobre os próprios pés, com possíveis mudanças imprevistas.'),
  2: p(2, 57, 'Trabalho dividido com outros: não ficar só, buscar cooperação e diplomacia.'),
  3: p(3, 57, 'Tempo excelente para viagens e aptidões criadoras, literárias ou sociais; amizades e prazeres importam, sem esbanjar amor ou dinheiro.'),
  4: p(4, 57, 'Período prático, em que pouco se pode além de permanecer no trabalho, cumprir deveres e compromissos e construir para o futuro.'),
  5: p(5, 57, 'Fase de liberdade e movimento: mudanças, viagens e pessoas novas, com incerteza e experiências que valem a pena.'),
  6: p(6, 57, 'Em geral, oportunidade de casar, construir um lar e ter filhos; família e responsabilidades marcam o período.'),
  7: p(7, 57, 'Período tranquilo de crescimento espiritual e mental; pode trazer solidão e dificuldades de saúde; favorece a especialização.'),
  8: p(8, 57, 'Bom tempo para as finanças, com esforço e boas escolhas; boa posição e responsabilidade, em geral em uma organização.'),
  9: p(9, 57, 'Grande conhecimento e compreensão da vida, com decepções pessoais no amor, no dinheiro ou na amizade; dura lição de viver para os outros, sem egoísmo.'),
  11: p(11, 57, 'Tempo de êxito na realização de ideais e na defesa dos próprios interesses e dos da infância.'),
  22: p(22, 58, 'Fase propícia para planejar e fazer crescer, possivelmente com alcance internacional.'),
});

export const NOTA_CICLOS_DESAFIOS = registro({
  chave: 'ciclos-desafios.nota',
  capitulo: 6,
  paginaInicial: 58,
  categoria: 'ciclos-e-desafios',
  numero: null,
  interpretacao:
    'O livro não traz uma lista própria para ciclos e desafios: diz apenas que o significado deles é semelhante e dá dois exemplos. O aplicativo mostra o texto dos pináculos como referência, e o ciclo descreve o ambiente e o pano de fundo do período (p. 54).',
});

const explicacao = (chave, paginaInicial, paginaFinal, interpretacao) =>
  registro({ chave, capitulo: 6, paginaInicial, paginaFinal, categoria: 'explicacao', numero: null, interpretacao });

/** O que o livro diz sobre a utilidade de cada parte do futuro (p. 54–58). */
export const EXPLICACOES_FUTURO = Object.freeze({
  pinaculos: explicacao('pinaculos.o-que-sao', 54, 54, 'Os pináculos dividem a vida em quatro grandes fases. Cada um indica a postura e as vivências que marcam aquele período.'),
  pinaculosDuracao: explicacao('pinaculos.duracao', 56, 56, 'O primeiro e o último pináculo são os mais longos, e os do meio duram nove anos. Os longos apontam o ambiente e as vivências que farão parte da vida.'),
  ciclos: explicacao('ciclos.o-que-sao', 54, 54, 'Os ciclos vêm do dia, do mês e do ano de nascimento e refinam a leitura: revelam o ambiente e a situação, como um pano de fundo de cada pináculo.'),
  ciclosDuracao: explicacao('ciclos.duracao', 54, 54, 'O primeiro ciclo acompanha o primeiro pináculo. O segundo, do dia de nascimento, atravessa o segundo e o terceiro pináculos e mais nove anos do quarto; costuma ser a fase mais ativa e produtiva da vida.'),
  desafios: explicacao('desafios.o-que-sao', 54, 54, 'Os desafios são os pontos fracos da personalidade, armadilhas capazes de afastar a pessoa do sucesso e da felicidade. Saem da subtração dos números de ciclo e correm junto com os pináculos.'),
  ano: explicacao('ano.o-que-e', 58, 58, 'A vibração da pessoa varia a cada dia. Para achar o número pessoal do ano, soma-se o dia e o mês de nascimento ao número universal do ano. Lido junto com o nascimento, os pináculos, os ciclos e os desafios, mostra o que esperar daquele ano. No exemplo de 5 de maio, 1971 dá 1: começo de um novo ciclo, com organização e decisões que pesam nos nove anos seguintes.'),
  mes: explicacao('mes.o-que-e', 58, 58, 'Também dá para olhar um mês específico: o número pessoal do mês é o Ano Pessoal somado ao mês do calendário.'),
});

/** Únicos exemplos específicos que o livro dá (p. 58). */
export const EXEMPLOS_ESPECIFICOS = Object.freeze({
  desafio3: registro({
    chave: 'desafio.3',
    capitulo: 6,
    paginaInicial: 58,
    categoria: 'desafio',
    numero: 3,
    interpretacao: 'Desafio 3: desenvolver o lado criador e alegre e manifestar-se de forma criativa; do contrário, não se encontra a felicidade.',
  }),
  ciclo4NoPrimeiroPinaculo: registro({
    chave: 'ciclo.4-primeiro',
    capitulo: 6,
    paginaInicial: 58,
    categoria: 'ciclo',
    numero: 4,
    interpretacao: 'Ciclo 4 em um primeiro pináculo: trabalho árduo, estudos e dificuldades em relação a eles, na escola e na universidade.',
    observacaoEditorial: 'O PDF traz "em relação aos últimos", que parece erro de digitalização por "estudos". A leitura é uma inferência.',
  }),
});

export const SEM_TEXTO_ZERO =
  'Resultado 0. O livro não fornece interpretação para desafio zero; o aplicativo preserva o número e não inventa uma leitura.';
