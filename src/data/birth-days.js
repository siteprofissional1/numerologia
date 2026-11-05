/**
 * Catálogo dos 31 dias: cada número aponta para seu título e para a chave dia.N.
 * A leitura usa o dia original, enquanto a redução numérica fica no domínio.
 */
import { registro } from './provenance.js';

const dia = (numero, paginaInicial, paginaFinal, interpretacao, observacaoEditorial = null) =>
  registro({
    chave: `dia.${numero}`,
    capitulo: 4,
    paginaInicial,
    paginaFinal,
    categoria: 'dia-de-nascimento',
    numero,
    titulo: numero === 1 ? 'Nascido no dia 1º' : `Nascido no dia ${numero}`,
    interpretacao,
    observacaoEditorial,
  });

export const CORRECAO_DIA_18 =
  'Correção editorial: na p. 38 esta seção aparece com o título "Nascido no dia 15", entre os dias 17 e 19. O título correto é "Nascido no dia 18". O dia 15 original está na p. 37 e foi mantido.';

/** Os 31 dias de nascimento, p. 32–44. */
export const DIAS_NASCIMENTO = Object.freeze({
  1: dia(1, 32, 32, 'Líder nato, de personalidade forte e independente, que abre o próprio caminho e não gosta de críticas. Bom raciocínio e organização, com necessidade de ser pioneiro e inovador; atenção ao ciúme e ao autoritarismo.'),
  2: dia(2, 33, 33, 'Diplomata nato, que rende mais em equipe; aprecia música, dança e as coisas belas da vida. Muito sensível ao ambiente e sujeito à depressão; valorizando-se mais, terá sucesso nos campos artístico e financeiro.'),
  3: dia(3, 33, 33, 'Muito bem dotado, precisa de um meio de se exteriorizar; amigos e vida social são essenciais. Inteligência arguta e imaginação favorecem conferências, escrita, ensino e jornalismo, com realização no campo intelectual e artístico.'),
  4: dia(4, 33, 33, 'Firme e por vezes obstinado, avesso a mudar de ideia ou método; prático, sistemático, leal, e fala a verdade mesmo quando desagrada. Emotivo, mas contido, e por isso pouco correspondido. Vai até o fim, com realização nos negócios.'),
  5: dia(5, 34, 34, 'Raciocínio rápido, corpo ágil e versatilidade; detesta restrições e vive intensamente, com muitas viagens. Bom promotor de vendas e adequado a atividades públicas e dinâmicas; cuidado para a independência não criar problemas com o parceiro, e cautela com o sexo oposto.'),
  6: dia(6, 34, 34, 'Apegado ao lar, precisa de companheirismo, amor e encorajamento. Voz agradável e interesse por artes e música; idealista, sai-se bem em grupos e negócios comunitários, sobretudo em beleza, saúde, música e teatro. Em más condições, o jovem pode perder a confiança na vida.'),
  7: dia(7, 34, 35, 'Introspectivo, tranquilo e analítico, busca a perfeição e é difícil de conhecer. Interesse por ciência e ocultismo, com sensibilidade e intuição; custa a encontrar parceiro por não se adaptar facilmente. Sucesso em atividades de especialização.'),
  8: dia(8, 35, 35, 'Lugar natural no mundo dos negócios: bom senso, equilíbrio e autoridade. Indica dinheiro, mas pode exigir luta se outros fatores do mapa forem desfavoráveis; gosta de poder e status e precisa de uma estrutura organizada.'),
  9: dia(9, 35, 35, 'Inteligência e criatividade abrem muitas atividades; vibração universal, com viagens ou muita comunicação. Impressionável, generoso e protetor, deve cuidar para não se dar à pessoa errada; pode alcançar fama no campo artístico ou profissional.'),
  10: dia(10, 36, 36, 'Nasceu para dirigir e ser independente: os outros é que se apoiam nele. Não deve trabalhar subordinado; pode seguir vários caminhos desde que à frente, cultivar as artes e ter sucesso em atividades individuais pela sua determinação.'),
  11: dia(11, 36, 36, 'Número fundamental, de grandes ideais. A dificuldade é deixar a razão se sobrepor à intuição, quando deveria segui-la, pois é sensitivo. Vive em alta vibração e com nervos à flor da pele, e por isso controle e meio-termo são indispensáveis.'),
  12: dia(12, 36, 37, 'Cordial e amistoso, com inteligência prática e talento literário ou artístico; em ambiente estimulante, é ótimo companheiro e perito em vendas e propaganda. Problemas no amor e na amizade o entristecem; indicado para diversões e literatura.'),
  13: dia(13, 37, 37, 'Muitas vezes começa com o pé esquerdo e parece áspero e ditatorial, por dificuldade de expressar sentimentos. Ambicioso e trabalhador, gosta de organizar; atento a detalhes, ciência e mecânica. Convém expressar-se mais e cultivar um hobby como entalhe ou escultura.'),
  14: dia(14, 37, 37, 'Versátil, de natureza dupla, lógica e imaginativa; pode construir ou destruir, com um pé na terra e outro no céu. Gosta do novo e da variedade, mas o excesso de experiências prejudica: para vencer, precisa de estabilidade na profissão.'),
  15: dia(15, 37, 37, 'Cooperativo, generoso e simpático, gosta de ajudar e de assumir responsabilidades, mas não deve ficar em meio que o reprima, pois isso afeta saúde e bem-estar. Precisa de lar harmonioso e de companheiro que o deixe ser quem é; sucesso no campo artístico e profissional.'),
  16: dia(16, 38, 38, 'Número espiritual, que dá mais importância ao espiritual do que ao terreno, embora a inteligência prática e inventiva possa render nos negócios. Perfeccionista, irrita-se e deprime-se se não atinge a perfeição; deve desenvolver aptidões literárias, artísticas e musicais.'),
  17: dia(17, 38, 38, 'Variações marcantes de humor; família e pessoa amada são muito importantes, com sensibilidade emocional na vida privada e nos negócios. Grande número para as finanças: tomar as decisões grandes e delegar as pequenas.'),
  18: dia(18, 38, 38, 'Independente, eficiente e líder nato, fascinado pelo mundo intelectual, em que sabe se expressar. Lado emocional e sensível, amante da música, porém muito contestador; a capacidade crítica serviria bem ao ensaísta ou escritor. Vida ativa e com muitas viagens.', CORRECAO_DIA_18),
  19: dia(19, 38, 39, 'Radical nas atitudes, com humor que percorre toda a escala de 1 a 9; vive à beira do precipício, mas tem imensos recursos. Com versatilidade e ideias originais não passará necessidade; deve fazer das mudanças uma constante e escolher com cuidado o companheiro, pois o casamento pode trazer muitos problemas.'),
  20: dia(20, 39, 39, 'Acima de tudo emocional, precisa de amigos, camaradagem e apoio, e de segurança no lar. Compreensão de detalhes e talentos musicais ou artísticos; não deve se deixar dominar pelas emoções, sob pena de parecer volúvel.'),
  21: dia(21, 39, 40, 'Precisa se expressar na literatura e nas artes para ser feliz; cauteloso e encantador, mas individualista. Fazer muitas coisas ao mesmo tempo dispersa suas forças. Emocionalmente instável, prefere receber a dar no amor; sucesso no mundo literário e bom anfitrião.'),
  22: dia(22, 40, 40, 'Número principal: pode sentir-se feliz ou infeliz conforme encara as coisas. Causas humanitárias e movimentos de ajuda combinam com ele; horizontes amplos pedem coragem para manter os olhos nos ideais e os pés na terra. Se não estiver preparado, pode reduzir a 4 e orientar-se por ele.'),
  23: dia(23, 40, 40, 'Independente, autossuficiente, orgulhoso e responsável, com raciocínio rápido e notável análise para diagnosticar problemas de uma organização. Mais sucesso com o sexo oposto e com pessoas mais velhas; adapta-se a mudanças e serve a negócios, diversões ou medicina.'),
  24: dia(24, 41, 41, 'Energia surpreendente e necessidade de movimento; assume responsabilidades, sobretudo na família e na comunidade. Pode ficar ansioso com o receio de não realizar o que considera certo; atingirá os objetivos com trabalho árduo, possivelmente na educação.'),
  25: dia(25, 41, 41, 'Intuitivo e inspirado, oculta pensamentos e é mal compreendido; o sucesso é indispensável à autoestima, e padrões de perfeição o deprimem. Inclinado a atividades criativas como vendas; deve desenvolver a concentração e prefere a vida simples do campo à cidade.'),
  26: dia(26, 41, 42, 'Ama acima de tudo o lar e os filhos, mas pode ir muito bem nos negócios, por ser organizador e executivo. Começa com entusiasmo e precisa de persistência para terminar. Forte orgulho de status: o casamento só é aconselhado com dinheiro; não remoer o passado.'),
  27: dia(27, 42, 42, 'Força, determinação e altos ideais fazem dele um líder natural, inadequado a posições subalternas ou sociedades meio a meio. Muito a dar em amizade e casamento; sexto sentido forte, atraído por metafísica e filosofia. Controlar a introversão quando algo dá errado; atividade literária ou artística.'),
  28: dia(28, 42, 42, 'Caráter forte, que prefere o anticonvencional dentro do convencional; dominante, independente e ambicioso, deve atuar com autonomia dentro de um grupo organizado. Sonha, luta pelos ideais e perde o interesse ao atingi-los; valoriza a liberdade e o inusitado.'),
  29: dia(29, 43, 43, 'Grande aniversário, que tende a levar ao público: intuitivo, idealista e com liderança. Inclinado à melancolia e à volubilidade, vive numa gangorra emocional e não é de convívio fácil; precisa de válvula artística ou dramática, como escrita ou música.'),
  30: dia(30, 43, 43, 'Imaginação privilegiada, caminho para a autorrealização; teatro e literatura são meios naturais, e nunca deve prender-se à rotina. Ideias arraigadas tornam inútil discutir, mas é bom amigo e popular. Atraído pelo trabalho social e pelas artes; a precipitação pode dispersar energias.'),
  31: dia(31, 44, 44, 'Construtivo, capaz de trabalho duro e continuado; leal, mas pode ser obstinado. Precisa do apoio de uma família bem constituída, aprecia viajar e deve ter ambições razoáveis. Conhecimento natural de drogas e ervas e interesse pela saúde; sucesso se construir sobre alicerces sólidos.'),
});
