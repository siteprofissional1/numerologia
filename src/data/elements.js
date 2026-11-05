/**
 * Descritores das leituras de Água, Fogo e Ar.
 * A seleção do elemento está em domain/birth-numbers.js; aqui ficam chaves e metadados.
 */
import { registro } from './provenance.js';

const e = (chave, paginaInicial, paginaFinal, campos) =>
  registro({
    chave: `elemento.${chave}`,
    capitulo: 4,
    paginaInicial,
    paginaFinal,
    categoria: 'elemento-harmonico',
    numero: null,
    ...campos,
  });

/** Elementos harmônicos, p. 31–32. */
export const ELEMENTOS_TEXTO = Object.freeze({
  agua: e('agua', 31, 31, {
    interpretacao: 'Elemento da mente: exige boa educação. Pessoas intuitivas; o 1 é avançado, intelectual e criador, o 5 é versátil e inquieto, o 7 é retraído, cauteloso e observador.',
    aptidoes: 'Bons escritores, engenheiros ou clínicos.',
  }),
  fogo: e('fogo', 31, 32, {
    interpretacao: 'Elemento do sentimento e da emoção: emoções profundas, mas difíceis de manifestar, e por isso frequentemente mal compreendidas. Maior êxito em negócios no campo humanitário.',
    aptidoes: 'Direção de empresas, bancos, comércio, secretariado, auditoria e política; inovação, em especial nos números 11 e 22; às vezes música e regência, pela regularidade e precisão.',
    observacaoEditorial: 'O quadro da p. 68 omite o 8 do Fogo, embora a p. 31 o inclua. O aplicativo segue a p. 31 e avisa quando isso muda uma classificação.',
  }),
  ar: e('ar', 32, 32, {
    interpretacao: 'Elemento espiritual e cheio de inspiração: temperamento artístico, capacidade literária e facilidade de se expressar criativamente, em geral lidando com o público.',
    aptidoes: 'Arte, escrita e atuação; também medicina, advocacia, aconselhamento e filantropia.',
  }),
});

export const NOTA_ELEMENTO_VOCACAO = registro({
  chave: 'elemento.vocacao',
  capitulo: 4,
  paginaInicial: 32,
  categoria: 'elemento-harmonico',
  numero: null,
  interpretacao:
    'O dia de nascimento não deve ser interpretado sozinho: associado à Ambição e à Expressão, ajuda a encontrar a vocação. As vibrações do dia são as mesmas em qualquer mês ou ano.',
});
