/**
 * Descritores dos quatro planos de expressão e das observações associadas.
 * numero é a lista de valores do grupo; sua contagem é feita em domain/name-numbers.js.
 */
import { registro } from './provenance.js';

const p = (chave, nome, numeros, interpretacao, observacaoEditorial = null) =>
  registro({
    chave: `plano.${chave}`,
    capitulo: 5,
    paginaInicial: 47,
    paginaFinal: 51,
    categoria: 'plano-de-expressao',
    numero: numeros,
    nome,
    interpretacao,
    observacaoEditorial,
  });

/**
 * O livro não dá um texto próprio por plano: define os grupos e interpreta tudo
 * pelo exemplo de Anne. Os resumos abaixo não vão além disso.
 */
export const PLANOS = Object.freeze({
  materiais: p('materiais', 'Materiais', [4, 5], 'Grupo dos números 4 e 5 (p. 47). O 5 é a exceção entre os números altos: está sempre mudando, e sua falta de equilíbrio indica muitos caminhos sem domínio de nenhum (p. 48).'),
  emocionais: p('emocionais', 'Emocionais', [2, 3, 6], 'Grupo dos números 2, 3 e 6 (p. 47). No exemplo de Anne, o 6 aparece ligado a responsabilidade, voz e capacidade de atrair amor e amizade (p. 50–51).'),
  mentais: p('mentais', 'Mentais', [1, 8], 'Grupo dos números 1 e 8 (p. 47). O 8 é descrito como número mental e extrovertido, associado à conquista de sucesso material (p. 50).'),
  intuitivos: p('intuitivos', 'Intuitivos', [7, 9], 'Grupo dos números 7 e 9 (p. 47). A autora só desenvolve aqui o 7: encontrá-lo ou notar sua falta nos planos indica emoções reprimidas (p. 49).'),
});

export const NOTAS_PLANOS = Object.freeze({
  oito: registro({
    chave: 'plano.oito',
    capitulo: 5,
    paginaInicial: 50,
    categoria: 'plano-de-expressao',
    numero: 8,
    interpretacao: 'O 8 é número mental e extrovertido, ligado ao sucesso material. No exemplo, isso não facilita a vida de Anne, cuja Expressão é introvertida.',
  }),
  numeroAlto: registro({
    chave: 'plano.numero-alto',
    capitulo: 5,
    paginaInicial: 48,
    categoria: 'plano-de-expressao',
    numero: null,
    interpretacao:
      'Agimos com facilidade, às vezes excessiva, nos planos em que há muitos números; um número alto em qualquer plano oferece possibilidade de êxito e mostra talento na linha desse número. O livro não fixa a partir de que contagem um número é "alto".',
  }),
  emocoesReprimidas: registro({
    chave: 'plano.emocoes-reprimidas',
    capitulo: 5,
    paginaInicial: 49,
    categoria: 'plano-de-expressao',
    numero: 7,
    interpretacao:
      'Encontrar um 7 nos planos, ou notar sua falta, indica alguém que reprime as emoções por medo de ser repelido; isso prejudica nervos, saúde e relacionamentos. O conselho é não levar os próprios sentimentos demasiado a sério.',
  }),
});
