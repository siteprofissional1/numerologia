/**
 * Leituras indexadas primeiro pela categoria e depois pelo resultado numérico.
 * A chave inclui ambos, pois amor.5 e dinheiro.5 correspondem a interpretações diferentes.
 */
import { registro } from './provenance.js';

const o = (categoria, numero, paginaInicial, paginaFinal, interpretacao) =>
  registro({
    chave: `oraculo.${categoria}.${numero}`,
    capitulo: 7,
    paginaInicial,
    paginaFinal,
    categoria: `oraculo-${categoria}`,
    numero,
    interpretacao,
  });

/** 33 leituras do cap. 7 (p. 59–67), diferentes dos significados gerais. */
export const LEITURAS_ORACULO = Object.freeze({
  amor: Object.freeze({
    1: o('amor', 1, 59, 59, 'Sentimentos sinceros, à procura da pessoa a amar; amor romântico, longe do comum. Cuidado: um certo egoísmo pode atrapalhar a felicidade.'),
    2: o('amor', 2, 59, 59, 'Busca segurança: lar, família e filhos para amar e defender. Prefere que o amor venha até você, mas exagerar nessa espera pode fazê-lo perder.'),
    3: o('amor', 3, 60, 60, 'Atitude despreocupada; convém examinar o que é oferecido. Será um amor passageiro, porém sincero enquanto durar, e vale não fugir dele.'),
    4: o('amor', 4, 60, 60, 'Firmeza e lealdade: o amor é extensão da camaradagem. Estável nas relações, precisa de um companheiro sincero e econômico.'),
    5: o('amor', 5, 60, 60, 'Laços familiares importantes; romântico e viajante, pode encontrar parceiro no exterior. Realiza-se no amor e no casamento com quem respeite esses valores e dê estabilidade material.'),
    6: o('amor', 6, 60, 60, 'Tipo doméstico, precisa de parceiro compreensivo que aprecie isso. Verificar o lado prático antes de se comprometer; amadurecido e afetivo, possivelmente terá vida feliz.'),
    7: o('amor', 7, 60, 61, 'Exigente na escolha de amigos e amantes; por pedir perfeição, muitas vezes fica só. Não está convencido dos benefícios de uma relação estável, e o espírito crítico afasta as pessoas.'),
    8: o('amor', 8, 61, 61, 'O amor inclui dinheiro; não crê no "amor e uma cabana". Sem moderação, pode acabar casado com uma profissão, e não com uma pessoa.'),
    9: o('amor', 9, 61, 61, 'Natureza generosa, vê no amor um modo de ampliar horizontes e praticar ideais; precisa de parceiro igualmente generoso e afetivo.'),
    11: o('amor', 11, 61, 61, 'Atraído por pessoas não convencionais, crê que a pessoa certa virá por destino. Não deve ser passivo: é preciso agir em vez de esperar.'),
    22: o('amor', 22, 61, 61, 'Idealista, com dificuldade de achar o parceiro adequado, talvez por rigidez em relação ao sexo. Lutando contra as inibições, pode ser feliz.'),
  }),
  dinheiro: Object.freeze({
    1: o('dinheiro', 1, 62, 62, 'O dinheiro não é o principal, embora a compensação alegre; vem do esforço, da criatividade e de contatos que sabem lidar com ele. O amor importa mais.'),
    2: o('dinheiro', 2, 62, 62, 'Significa segurança para o lar e a família, nunca um fim em si. Prudência: ganha com a diplomacia e perde ao impor seu ponto de vista.'),
    3: o('dinheiro', 3, 62, 62, 'Vê no dinheiro toda a felicidade. Imprudente como um jogador, não leva o dinheiro a sério nem paga as contas em dia, o que cria problemas para muitas pessoas.'),
    4: o('dinheiro', 4, 62, 63, 'Encara o dinheiro com seriedade e trabalha por ele, mas fica inseguro e pessimista quanto às oportunidades. Cuidado para não se tornar avarento.'),
    5: o('dinheiro', 5, 63, 63, 'Gasta em viagens; a segurança vem de comunicação, escrita, vendas, corretagem ou publicidade, que não tolhem a liberdade. Provavelmente haverá romances e dinheiro.'),
    6: o('dinheiro', 6, 63, 63, 'O dinheiro é o antídoto contra a insegurança, e sua falta causa pânico; considerado necessário para casar e viajar. Generoso, gosta de ter para ajudar quem ama.'),
    7: o('dinheiro', 7, 63, 63, 'O dinheiro é um mistério, sem senso prático; chega por fontes imprevistas. Convém ter mais senso prático e cuidar melhor das contas.'),
    8: o('dinheiro', 8, 63, 64, 'À vontade ao aplicar e orçar; grandes ideias, mas julga pela aparência e pode se decepcionar. O desejo de ter é quase uma garantia de conseguir.'),
    9: o('dinheiro', 9, 64, 64, 'Sem dinheiro, perde a confiança em si; precisa dele para realizar planos. Sempre deseja muito e quase sempre consegue.'),
    11: o('dinheiro', 11, 64, 64, 'Gosta de ganhar de modo pouco usual, e a necessidade vem da impressão causada nos outros. Pode ganhar desenvolvendo técnicas conhecidas e, talvez, modos pouco ortodoxos na medicina.'),
    22: o('dinheiro', 22, 64, 64, 'Visão ampla: o dinheiro é meio de concretizar projetos, sobretudo no comércio. Precisa ser prático e ordenar as ideias conforme a realidade.'),
  }),
  sucesso: Object.freeze({
    1: o('sucesso', 1, 64, 64, 'Não encontra facilidades; para vencer precisa reformular as ideias e partir de algo realmente novo.'),
    2: o('sucesso', 2, 65, 65, 'Não é propriamente um lutador e aprecia o lazer; o sucesso pode vir pela cultura: música, arte, literatura.'),
    3: o('sucesso', 3, 65, 65, 'Atraído pelo sucesso, com imaginação para vários campos, mas pode exigir demais de si. Convém limitar objetivos e terminar um projeto antes de outro.'),
    4: o('sucesso', 4, 65, 65, 'Grande senso prático e realismo, disposto a lutar; pode levar o sucesso tão a sério que sobra pouco tempo para diversão.'),
    5: o('sucesso', 5, 65, 65, 'Criativo, luta com trabalho e entusiasmo; a livre comunicação é fundamental. Com sorte, fama como escritor, jornalista ou comentarista de televisão.'),
    6: o('sucesso', 6, 65, 65, 'Conter a ambição e não esperar êxitos estrondosos: a felicidade depende do lar, da família e do amor, e isso provavelmente acontecerá.'),
    7: o('sucesso', 7, 66, 66, 'O sucesso depende de um companheiro que partilhe ideais, esperanças e tristezas; é um sonho difícil, mas, realizado, traz o sucesso.'),
    8: o('sucesso', 8, 66, 66, 'Sucesso significa dinheiro e bens materiais; precisa aprender a dividir para ser feliz. Capaz de grande esforço, provavelmente conseguirá.'),
    9: o('sucesso', 9, 66, 66, 'Grandes ambições e renome internacional como objetivo; pode chegar à glória nas diversões e artes criativas ou nos ideais humanitários.'),
    11: o('sucesso', 11, 66, 66, 'Evita os caminhos já trilhados e busca campos incomuns: televisão, computadores, PES, ocultismo ou técnicas da era moderna.'),
    22: o('sucesso', 22, 66, 67, 'Confia em si, na iniciativa, na persuasão e no magnetismo; pode ter o toque de Midas em vendas, se recomeçar quantas vezes for preciso.'),
  }),
});
