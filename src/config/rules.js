/**
 * Decisões configuráveis para os pontos em que o livro é ambíguo ou contraditório.
 * Cada opção está justificada em docs/DECISOES_DE_IMPLEMENTACAO.md.
 */
export const OBRA = Object.freeze({
  titulo: 'Numerologia: O poder secreto dos números',
  editora: 'Hemus',
  paginas: 74,
});

export const OPCOES_REGRAS = Object.freeze({
  normalizacao: {
    rotulo: 'Letras acentuadas',
    opcoes: {
      convencao: 'Converter para A–Z (convenção técnica do aplicativo; Á→A, Ç→C)',
      estrito: 'Modo estrito A–Z (recusar letras acentuadas)',
    },
  },
  componentesMestres: {
    rotulo: 'Dia, mês ou ano que resultam em 11 ou 22',
    opcoes: {
      reduzir: 'Reduzir a um dígito antes de somar (como em todos os exemplos do livro)',
      preservar: 'Conservar 11 e 22 nos componentes (o livro não dá exemplo)',
    },
  },
  modoPinaculos: {
    rotulo: 'Duração dos pináculos intermediários',
    opcoes: {
      nove: 'Modo 1: regra textual de nove anos (p. 53 e 56)',
      tabela: 'Modo 2: intervalos da tabela do exemplo, com dez idades (p. 56)',
    },
  },
  idadeDestinoMestre: {
    rotulo: 'Fórmula 36 − N quando o Destino é 11 ou 22',
    opcoes: {
      literal: 'Usar o número literal (36 − 11 ou 36 − 22)',
      reduzido: 'Usar o número reduzido (36 − 2 ou 36 − 4)',
    },
  },
});

// Estes valores determinam o comportamento normal. As funções do domínio também
// aceitam alternativas explícitas, usadas para explicar ambiguidades e nos testes.
export const REGRAS_PADRAO = Object.freeze({
  normalizacao: 'convencao',
  componentesMestres: 'reduzir',
  modoPinaculos: 'nove',
  idadeDestinoMestre: 'literal',
});

/** Cria uma cópia dos padrões e aplica apenas opções conhecidas, sem modificar o catálogo. */
export function resolverRegras(parciais = {}) {
  const regras = { ...REGRAS_PADRAO };
  for (const [chave, valor] of Object.entries(parciais ?? {})) {
    if (valor === undefined) continue;
    if (!OPCOES_REGRAS[chave]) throw new RangeError(`Regra desconhecida: ${chave}`);
    if (!OPCOES_REGRAS[chave].opcoes[valor]) {
      throw new RangeError(`Valor inválido para ${chave}: ${valor}`);
    }
    regras[chave] = valor;
  }
  return regras;
}
