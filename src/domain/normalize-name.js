/**
 * Decompõe o nome em palavras e letras. A conversão de acentos é uma CONVENÇÃO
 * TÉCNICA do aplicativo: o livro só apresenta A–Z e não trata de diacríticos.
 */
const HIFENS = new Set(['-', '‐', '‑']);
const APOSTROFOS = new Set(["'", '’', 'ʼ']);

/** Agrupa cada caractere com as marcas combinantes que o acompanham. */
function grafemas(texto) {
  return texto.normalize('NFC').match(/\P{M}\p{M}*|\p{M}+/gu) ?? [];
}

/** ß, ø e ı são recusados: não decompõem para A–Z, e o livro não os define. */
function letraBase(grafema) {
  const base = grafema.normalize('NFD').replace(/\p{M}/gu, '');
  return /^[A-Za-z]$/.test(base) ? base.toUpperCase() : null;
}

export function decomporNome(nome, { modo = 'convencao' } = {}) {
  const texto = String(nome ?? '');
  const palavras = [];
  const invalidos = [];
  const transformacoes = [];
  let atual = null;

  const fecharPalavra = () => {
    if (atual && atual.letras.length > 0) palavras.push(atual);
    atual = null;
  };

  for (const grafema of grafemas(texto)) {
    if (/^\s+$/u.test(grafema) || HIFENS.has(grafema)) {
      fecharPalavra();
      continue;
    }
    if (APOSTROFOS.has(grafema)) {
      if (atual) atual.original += grafema;
      continue;
    }
    const base = letraBase(grafema);
    const acentuada = base !== null && grafema.toUpperCase() !== base;
    if (base === null || (acentuada && modo === 'estrito')) {
      if (!invalidos.includes(grafema)) invalidos.push(grafema);
      continue;
    }
    atual ??= { original: '', letras: [] };
    atual.original += grafema;
    atual.letras.push({ original: grafema, normalizada: base, transformada: acentuada });
    if (acentuada && !transformacoes.some((t) => t.de === grafema)) {
      transformacoes.push({ de: grafema, para: base });
    }
  }
  fecharPalavra();

  return {
    original: texto,
    exibicao: texto.trim().replace(/\s+/gu, ' '),
    modo,
    palavras,
    invalidos,
    transformacoes,
  };
}

export function validarNome(nome, opcoes) {
  const decomposto = decomporNome(nome, opcoes);
  const erros = [];
  if (decomposto.exibicao === '') {
    erros.push('Informe o nome completo recebido ao nascer.');
  } else {
    if (decomposto.invalidos.length > 0) {
      const lista = decomposto.invalidos.join(' ');
      erros.push(
        decomposto.modo === 'estrito'
          ? `Caracteres fora de A–Z no modo estrito: ${lista}`
          : `Caracteres sem valor na tabela do livro: ${lista}`,
      );
    }
    if (decomposto.palavras.length === 0 && decomposto.invalidos.length === 0) {
      erros.push('O nome precisa conter ao menos uma letra.');
    }
  }
  return { ok: erros.length === 0, erros, decomposto };
}
