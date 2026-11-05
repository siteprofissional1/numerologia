import transcricoes from '../data/private/transcricoes.json';

export function carregarTextosPrivados() {
  if (!transcricoes.textos || Object.keys(transcricoes.textos).length < 140) {
    throw new Error('A transcrição do livro está incompleta. Execute npm run importar-textos.');
  }
  return transcricoes.textos;
}
