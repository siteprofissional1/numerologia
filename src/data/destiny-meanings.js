import { registro } from './provenance.js';

const d = (numero, tema, paginaInicial, paginaFinal, interpretacao, observacaoEditorial = null) =>
  registro({
    chave: `destino.${numero}`,
    capitulo: 3,
    paginaInicial,
    paginaFinal,
    categoria: 'caminho-do-destino',
    numero,
    tema,
    interpretacao,
    observacaoEditorial,
  });

/** Caminhos do Destino, p. 24–30: textos próprios, distintos dos significados gerais. */
export const CAMINHOS_DESTINO = Object.freeze({
  1: d(1, 'O Pioneiro', 24, 24, 'Caminho original e independente, com as próprias decisões no comando; percepção aguda, concentração e ideias criadoras abrem perspectivas de sucesso. Evitar tanto a preguiça e a indecisão quanto a dominação e o egoísmo.'),
  2: d(2, 'Cooperação', 24, 24, 'A vida pede tato e diplomacia: ajudando e cooperando se obtém o que se deseja, e o próprio sucesso depende do sucesso dos outros. Paciência, atenção aos detalhes e cuidado com mudanças; evitar mau humor, emotividade excessiva e indiscrição.'),
  3: d(3, 'Auto-expressão', 25, 25, 'Oportunidades de se expressar, por escrita, fala ou outro meio criativo; a missão é transmitir alegria, cultivar amizades e desenvolver os poderes de criação. Evitar autoritarismo, presunção, pessimismo, sarcasmo e cinismo.'),
  4: d(4, 'Organização Prática', 25, 25, 'Vida de trabalho constante: mesmo a riqueza só vem pelo esforço, e pode haver períodos de economia e deveres, às vezes por causa da saúde. O número é um alicerce: as coisas chegam devagar e exigem paciência, responsabilidade e eficiência.'),
  5: d(5, 'Experiência e Mudança', 25, 26, 'Caminho de liberdade, variedade, viagens e adaptação; nada se mostra permanente, mas não se deve mudar só pelo prazer de mudar. Aprender línguas, acompanhar o mundo e progredir sem negligenciar as raízes; evitar a fantasia e a autoindulgência, cuidar das finanças.'),
  6: d(6, 'Responsabilidade/Serviço', 26, 27, 'Nasceu para confortar, conciliar e ajustar o que está em desarmonia, servindo com amor no lar e na comunidade; o destino sempre traz responsabilidades e angústias alheias. Pode falhar ao recusá-las ou ao ser dominador, possessivo e tornar os outros dependentes.'),
  7: d(7, 'Análise/Sabedoria', 27, 27, 'Caminho do pensador e filósofo: descobrir a verdade sob as aparências, trabalhar nos bastidores e aprender a ficar só, pois as respostas vêm do silêncio e do próprio íntimo. O medo do fracasso e da solidão complica as coisas; o sucesso vem da especialização.'),
  8: d(8, 'Dinheiro/Poder Comercial', 27, 28, 'Atenção a valores comerciais e ideias financeiras práticas; número de força, organização e independência material, destinado a cargos de direção. Exige muito trabalho e discernimento; o grande sucesso vem ao aceitar outros valores além dos comerciais e agir pelo bem da comunidade.'),
  9: d(9, 'Amor Universal/Serviço', 28, 29, 'Exige atitude aberta, compaixão, compreensão e vontade de servir, com objetivos amplos, inclusive em entidades humanitárias e movimentos internacionais. Sucesso e felicidade vêm de vencer preconceitos e tratar os outros como gostaria de ser tratado, vivendo conforme os ideais.'),
  11: d(11, 'Número principal', 29, 29, 'Quem não quer viver sob sua forte influência pode reduzi-lo a 2 e ler esse caminho. Quem quer explorá-lo deve confiar na intuição e levar a inteligência inventiva a terrenos práticos; encontrará oposição e correntes místicas, e vencerá passando de sonhador excêntrico a lutador crítico, com atitude filosófica.', 'Leitura 11/2 autorizada pela p. 23 e p. 29.'),
  22: d(22, 'Número principal', 29, 30, 'Pode ser reduzido a 4 e lido por esse caminho. Para viver todo o potencial, unir ideais e aptidões práticas em um esquema amplo, ligado a bem-estar social, saúde e movimentos espirituais. O sucesso vem de ver as ideias como um todo, deixar os detalhes a outros e construir superando obstáculos.', 'Leitura 22/4 autorizada pela p. 29.'),
});
