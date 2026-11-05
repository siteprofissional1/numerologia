/** Limpa referências somente nas notas técnicas; nunca altera o texto do livro ou os dados pessoais. */
export function semCitacoesDePagina(texto) {
  // O padrão aceita números únicos e intervalos. String.raw preserva as barras
  // das expressões regulares construídas dinamicamente nas substituições abaixo.
  const numeros = String.raw`\d+(?:\s*[–—-]\s*\d+)?(?:\s*(?:,|e)\s*(?:p\.\s*)?\d+(?:\s*[–—-]\s*\d+)?)*`;
  // Remove primeiro a referência entre parênteses; nos demais casos ajusta a expressão
  // para manter uma frase legível. Esta função recebe notas, nunca a transcrição original.
  return String(texto)
    .replace(new RegExp(String.raw`\s*\(p\.\s*${numeros}\)`, 'gi'), '')
    .replace(new RegExp(String.raw`\bda p\.\s*${numeros}`, 'gi'), 'do livro')
    .replace(new RegExp(String.raw`\bna p\.\s*${numeros}`, 'gi'), 'no livro')
    .replace(new RegExp(String.raw`\bpela p\.\s*${numeros}`, 'gi'), 'pelo livro')
    .replace(new RegExp(String.raw`\ba p\.\s*${numeros}`, 'gi'), 'o livro')
    .replace(new RegExp(String.raw`\bp\.\s*${numeros}`, 'gi'), 'no livro');
}
