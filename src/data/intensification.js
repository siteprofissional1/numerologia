import { registro } from './provenance.js';

const a = (numero, pagina, interpretacao) =>
  registro({ chave: `aptidao.${numero}`, capitulo: 2, paginaInicial: pagina, categoria: 'aptidao', numero, interpretacao });
const f = (numero, pagina, interpretacao) =>
  registro({ chave: `falta.${numero}`, capitulo: 2, paginaInicial: pagina, categoria: 'falta', numero, interpretacao });

/** Tabela de intensificação, "Muitos desses números dão" (p. 21–22). */
export const APTIDOES = Object.freeze({
  1: a(1, 21, 'Espírito de líder e de pioneiro; ideias originais, autonomia, firmeza nas decisões e muita energia.'),
  2: a(2, 21, 'Tato e colaboração; sensibilidade que pode pender para a melancolia; hesitação e reflexão antes de agir.'),
  3: a(3, 21, 'Sociabilidade, autoexpressão, otimismo, imaginação, facilidade para falar e escrever.'),
  4: a(4, 22, 'Praticidade, empenho no trabalho e economia; limites e questões de saúde; pode tender à teimosia.'),
  5: a(5, 22, 'Gosto por liberdade e variação, facilidade de adaptação e desembaraço; atrai o sexo oposto e pode dissimular.'),
  6: a(6, 22, 'Afeto e ideais, vida doméstica e casamento; cuidado e proteção com os outros; equilíbrio, adaptação e inclinação às artes.'),
  7: a(7, 22, 'Mente analítica e voltada para dentro; reserva, fé e sabedoria; busca de paz e sossego.'),
  8: a(8, 22, 'Sabe executar e discernir; ambição, conquista material e sucesso.'),
  9: a(9, 22, 'Afeto pela humanidade e senso fraterno; compaixão, cuidado e compreensão; talento para arte e literatura.'),
});

/** Tabela de intensificação, "Alguns destes números indicam" (p. 22). */
export const FALTAS = Object.freeze({
  1: f(1, 22, 'Pouca ambição, independência e originalidade; egocentrismo e indolência.'),
  2: f(2, 22, 'Pouca cooperação e consideração pelos outros; pouco senso de ritmo e harmonia; falta de tato e diplomacia.'),
  3: f(3, 22, 'Impaciência, dificuldade de expressão, pouca imaginação, agitação e atividade em excesso; talvez complexo de inferioridade.'),
  4: f(4, 22, 'Aversão ao trabalho e preocupação com detalhes e concentração; tendência a se impacientar.'),
  5: f(5, 22, 'Aversão ou medo de mudança, pouca curiosidade, desejo de perpetuar coisas e situações.'),
  6: f(6, 22, 'Falta de ideais, negligência do dever, recusa de responsabilidades.'),
  7: f(7, 22, 'Não analisa, não é introspectivo, ignora a intuição.'),
  8: f(8, 22, 'Pouco discernimento; forte noção do valor do dinheiro; preocupa-se com ele sem motivo ou, também sem motivo, deixa as finanças em segundo plano.'),
  9: f(9, 22, 'Visão estreita, pouca compaixão e compreensão, pouco interesse pelos outros e pelo bem da humanidade.'),
});
