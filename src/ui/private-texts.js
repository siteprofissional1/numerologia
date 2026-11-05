/** O Vite embute este JSON no HTML final; a consulta não depende de baixar outro arquivo. */
import transcricoes from '../data/private/transcricoes.json';

export function carregarTextosPrivados() {
  // Esta é uma checagem mínima na abertura. A cobertura detalhada ocorre antes do build,
  // no script verificar-textos.mjs; blocoTexto também recusa uma chave ausente.
  if (!transcricoes.textos || Object.keys(transcricoes.textos).length < 140) {
    throw new Error('A transcrição do livro está incompleta. Execute npm run importar-textos.');
  }
  return transcricoes.textos;
}
