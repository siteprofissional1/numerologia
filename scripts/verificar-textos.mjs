import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const raiz = new URL('../', import.meta.url);
const pdf = new URL('../../numerologia-mary-anderson-fratermarcos.pdf', import.meta.url);
const { textos, fonte, integridade } = JSON.parse(readFileSync(new URL('src/data/private/transcricoes.json', raiz), 'utf8'));
assert.equal(createHash('sha256').update(JSON.stringify(textos)).digest('hex'), integridade, 'Transcrição alterada após a conferência');
assert.match(fonte.sha256, /^[a-f0-9]{64}$/);
const normalizar = (t) => t.replace(/-\s+/g, '-').replace(/\s+/g, ' ').trim();
let bruto = null;
if (existsSync(pdf)) {
  assert.equal(createHash('sha256').update(readFileSync(pdf)).digest('hex'), fonte.sha256, 'PDF diferente da origem da transcrição');
  ({ stdout: bruto } = await promisify(execFile)('pdftotext', ['-layout', fileURLToPath(pdf), '-'], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  }));
}
// Retira os rodapés; palavras e pontuação, inclusive os erros do OCR, permanecem.
const livro = bruto && normalizar(bruto.split('\f').map((pagina, i) => pagina.split('\n')
  .filter((linha) => linha.trim() !== String(i + 1)).join('\n')).join('\n'));

for (const [chave, texto] of Object.entries(textos)) {
  assert.equal(typeof texto, 'string', `Passagem inválida: ${chave}`);
  assert.ok(texto.trim(), `Passagem vazia: ${chave}`);
  let original = normalizar(texto);
  // O rodapé "38" foi incorporado à frase no próprio PDF.
  if (chave === 'dia.18') original = original.replace('como ensaísta', 'como 38 ensaísta');
  if (livro) assert.ok(livro.includes(original), `Passagem diferente do PDF: ${chave}`);
  assert.doesNotMatch(texto, /\bp\.\s*\d|\bpágina\s+\d/iu, `Citação em ${chave}`);
}

const chaves = new Set();
const visitar = (valor) => {
  if (!valor || typeof valor !== 'object') return;
  if (typeof valor.chave === 'string') chaves.add(valor.chave);
  for (const filho of Object.values(valor)) visitar(filho);
};
for (const nome of readdirSync(new URL('src/data/', raiz)).filter((n) => n.endsWith('.js'))) {
  visitar(await import(new URL(`src/data/${nome}`, raiz)));
}
for (const chave of chaves) assert.ok(textos[chave], `Falta o texto exigido pela interface: ${chave}`);

const quantidades = { 'dia.': 31, 'geral.': 11, 'destino.': 11, 'aptidao.': 9, 'falta.': 9, 'pinaculo.': 11 };
for (const [prefixo, total] of Object.entries(quantidades)) {
  assert.equal(Object.keys(textos).filter((c) => c.startsWith(prefixo)).length, total, `Cobertura: ${prefixo}`);
}
for (const categoria of ['amor', 'dinheiro', 'sucesso']) {
  assert.equal(Object.keys(textos).filter((c) => c.startsWith(`oraculo.${categoria}.`)).length, 11);
}
console.log(`${Object.keys(textos).length} passagens ${livro ? 'conferidas com o PDF' : 'com integridade verificada'}; ${chaves.size} chaves da interface cobertas. Nenhuma citação de página nos textos.`);
