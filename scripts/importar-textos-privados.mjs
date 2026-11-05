#!/usr/bin/env node
/**
 * Gera src/data/private/transcricoes.json a partir do PDF do próprio usuário.
 * A transcrição é incluída no sistema para funcionamento local e no GitHub Pages.
 *
 * Uso: npm run importar-textos -- [caminho/do/livro.pdf]
 * Requer o programa `pdftotext` (pacote poppler-utils).
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PDF_PADRAO = resolve(RAIZ, '..', 'numerologia-mary-anderson-fratermarcos.pdf');
const SAIDA = resolve(RAIZ, 'src/data/private/transcricoes.json');

const POR_EXTENSO = {
  Um: 1, Dois: 2, 'Três': 3, Quatro: 4, Cinco: 5, Seis: 6,
  Sete: 7, Oito: 8, Nove: 9, Onze: 11, 'Vinte e Dois': 22,
};
const PULAR = Symbol('pular linha de título');
const RE_NUMERO = /^Número (Um|Dois|Três|Quatro|Cinco|Seis|Sete|Oito|Nove|Onze|Vinte e Dois)$/;

/** Divide o texto do PDF em linhas com sua página, removendo o número impresso no rodapé. */
export function linhasPorPagina(textoPdf) {
  const linhas = [];
  textoPdf.split('\f').forEach((pagina, indice) => {
    const numero = indice + 1;
    for (const bruta of pagina.split('\n')) {
      const linha = bruta.trim();
      if (linha === '' || linha === String(numero)) continue;
      linhas.push({ pagina: numero, texto: linha, recuo: bruta.length - bruta.trimStart().length });
    }
  });
  return linhas;
}

/** A extração só quebra linha em hífens reais ("auto-/expressão"): eles são mantidos. */
export function juntar(linhas) {
  return linhas
    .reduce((acc, l) => (acc === '' ? l : acc.endsWith('-') ? acc + l : `${acc} ${l}`), '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Reconstrói os parágrafos do livro: há quebra quando a linha anterior termina
 * uma frase e esta tem recuo de primeira linha ou a anterior ficou curta.
 */
export function paragrafos(linhas) {
  const blocos = [[]];
  linhas.forEach((linha, i) => {
    const anterior = linhas[i - 1];
    const seguinte = linhas[i + 1];
    if (anterior) {
      const fimDeFrase = /[.!?:"”)]$/.test(anterior.texto);
      const recuada = linha.recuo > anterior.recuo || (seguinte && linha.recuo > seguinte.recuo);
      if (fimDeFrase && (recuada || anterior.texto.length < 50)) blocos.push([]);
    }
    blocos.at(-1).push(linha.texto);
  });
  return blocos.map(juntar).join('\n\n');
}

function secoes(linhas, paginaIni, paginaFim, detectar) {
  const resultado = {};
  let atual = null;
  for (const linha of linhas) {
    const { pagina, texto } = linha;
    if (pagina < paginaIni || pagina > paginaFim) continue;
    const chave = detectar(texto);
    if (chave === PULAR) continue;
    if (chave === false) {
      atual = null;
    } else if (chave) {
      atual = chave;
      resultado[atual] = [];
    } else if (atual) {
      resultado[atual].push(linha);
    }
  }
  return Object.fromEntries(Object.entries(resultado).map(([k, v]) => [k, paragrafos(v)]));
}

/** Trecho contíguo entre duas frases. */
function trecho(linhas, inicio, fim) {
  const ini = linhas.findIndex((l) => inicio.test(l.texto));
  if (ini < 0) throw new Error(`Trecho não localizado: ${inicio}`);
  const fimRel = linhas.slice(ini + 1).findIndex((l) => fim.test(l.texto));
  if (fimRel < 0) throw new Error(`Fim não localizado: ${fim}`);
  return paragrafos(linhas.slice(ini, ini + 1 + fimRel));
}

/** Parte de uma passagem já extraída; falha se o livro não trouxer o texto esperado. */
function parte(texto, padrao, chave) {
  const achado = padrao.exec(texto);
  if (!achado) throw new Error(`Trecho não localizado: ${chave}`);
  return achado[0].trim();
}

const RE_FUTURO = /(?:Quando aplicado a acontecimentos futuros|Em relação a(?:os acontecimentos futuros|o futuro)|Quanto ao futuro|Com relação ao futuro|Quando o 7 é predominante em relação ao futuro)[\s\S]*?(?=\n\n|$)/;

export function extrairTranscricoes(textoPdf) {
  const linhas = linhasPorPagina(textoPdf);
  const textos = {};

  // Significados gerais, p. 6–15
  Object.assign(textos, secoes(linhas, 6, 15, (t) => {
    const m = RE_NUMERO.exec(t);
    return m ? `geral.${POR_EXTENSO[m[1]]}` : null;
  }));

  // Caminhos do Destino, p. 24–30 (títulos 6 e 8 ocupam duas linhas)
  Object.assign(textos, secoes(linhas, 24, 30, (t) => {
    if (t === 'Responsabilidade/Serviço' || t === 'Comercial') return PULAR;
    if (t === 'OS NÚMEROS PRINCIPAIS') return false;
    const m = /^(?:Caminho|Número) do Destino\s*[-—]+\s*(\d+)/.exec(t);
    return m ? `destino.${m[1]}` : null;
  }));

  // Dias de nascimento, p. 32–44, com a correção editorial do dia 18
  let ultimoDia = 0;
  const dias = secoes(linhas, 32, 44, (t) => {
    const m = /^Nascido no dia (\d+)º?$/.exec(t);
    if (!m) return null;
    const lido = Number(m[1]);
    // Segundo título "dia 15" entre 17 e 19: o correto é 18 (p. 38).
    const numero = lido === 15 && ultimoDia === 17 ? 18 : lido;
    ultimoDia = numero;
    return `dia.${numero}`;
  });
  // Remove o número de página "38" que invadiu o corpo do texto do dia 18.
  dias['dia.18'] = dias['dia.18']?.replace(/\bcomo 38\s+ensaísta\b/, 'como ensaísta');
  Object.assign(textos, dias);

  // Aptidões e faltas, p. 21–22 ("l" é o algarismo 1 lido errado no PDF)
  let bloco = null;
  let atualTabela = null;
  for (const { pagina, texto } of linhas) {
    if (pagina < 21 || pagina > 22) continue;
    if (texto === 'Aptidões') { bloco = 'aptidao'; atualTabela = null; continue; }
    if (texto === 'Falta') { bloco = 'falta'; atualTabela = null; continue; }
    if (!bloco || /^(Muitos|Alguns) dest/.test(texto)) continue;
    const m = /^([1-9l])\s+(.*)$/.exec(texto);
    if (m) {
      atualTabela = `${bloco}.${m[1] === 'l' ? 1 : m[1]}`;
      textos[atualTabela] = m[2];
    } else if (atualTabela) {
      textos[atualTabela] = juntar([textos[atualTabela], texto]);
    }
  }

  // Pináculos, p. 57–58
  let ativo = false;
  let atualPin = null;
  for (const { pagina, texto } of linhas) {
    if (pagina < 57 || pagina > 58) continue;
    if (/^Pináculos$/.test(texto)) { ativo = true; continue; }
    if (/^O significado dos ciclos/.test(texto)) break;
    if (!ativo) continue;
    const m = /^(\d{1,2})\.\s+(.*)$/.exec(texto);
    if (m) {
      atualPin = `pinaculo.${m[1]}`;
      textos[atualPin] = m[2];
    } else if (atualPin) {
      textos[atualPin] = juntar([textos[atualPin], texto]);
    }
  }

  // Amor, dinheiro e sucesso, p. 59–67
  let categoria = null;
  Object.assign(textos, secoes(linhas, 59, 67, (t) => {
    if (t === 'AMOR' || t === 'DINHEIRO' || t === 'SUCESSO') {
      categoria = t.toLowerCase();
      return false;
    }
    const m = RE_NUMERO.exec(t);
    return m && categoria ? `oraculo.${categoria}.${POR_EXTENSO[m[1]]}` : null;
  }));

  // Passagens contínuas
  const TRECHOS = {
    'definicao.ambicao': [/^1\.\s+A soma das vogais dá/, /^2\.\s+A soma das consoantes indica/],
    'definicao.personalidade': [/^2\.\s+A soma das consoantes indica/, /^3\.\s+A soma das vogais e das consoantes/],
    'definicao.expressao': [/^3\.\s+A soma das vogais e das consoantes/, /^4\.\s+A soma dos números de expressão/],
    'definicao.realidade': [/^4\.\s+A soma dos números de expressão/, /^O Y é considerado vogal/],
    'definicao.destino': [/^Obtém-se o caminho do destino/, /^Tomemos alguém que nasceu/],
    'oraculo.metodo': [/^Concentre-se na palavra que você escolheu/, /^AMOR$/],
    'elemento.agua': [/^A Água ou Elemento Científico/, /^O Fogo ou Elemento dos Negócios/],
    'elemento.fogo': [/^O Fogo ou Elemento dos Negócios/, /^O Ar ou Elemento Artístico/],
    'elemento.ar': [/^O Ar ou Elemento Artístico/, /^As vibrações de uma data/],
    'elemento.vocacao': [/^As vibrações de uma data/, /^Nascido no dia 1º/],
    'plano.numero-alto': [/^A vida nos dá meios de suprir/, /^A Interpretação do Mapa/],
    'plano.emocoes-reprimidas': [/^Se, nos planos de expressão/, /^Passaremos agora/],
    'quadro.horizontal': [/^Você pode observar que/, /^Ao longo das colunas verticais/],
    'quadro.vertical': [/^Ao longo das colunas verticais/, /^Na coluna diagonal/],
    'quadro.diagonal': [/^Na coluna diagonal/, /^Numa rápida análise/],
    'relacao.similares': [/^Similares:\s+Os/, /^Complementares:\s+Se/],
    'relacao.complementares': [/^Complementares:\s+Se/, /^Opostos:\s+Se/],
    'relacao.opostos': [/^Opostos:\s+Se/, /^Se você compreende/],
    'relacao.soma-expressao': [/^Nada mais fácil/, /^O mesmo princípio/],
    'relacao.soma-destino': [/^O mesmo princípio/, /^Quando você estiver seriamente/],
    'relacao.analise-completa': [/^Quando você estiver seriamente/, /^Outro fator/],
    'relacao.paridade': [/^Os números estão divididos/, /^Muitas pessoas se preocupam/],
    'relacao.casamento': [/^O 6 é o número do casamento/, /^Vemos, assim, que a Numerologia/],
    'relacao.mudanca-nome': [/^Surge, finalmente/, /^Finalmente, espero/],
    'ciclos-desafios.nota': [/^O significado dos ciclos/, /^A vibração do número/],
    'realidade.objetivo': [/^A soma desses dois números mostra/, /^A descoberta do número/],
    'quadro.exemplo': [/^Como se pode perceber a um simples olhar/, /^Indicações Sobre o Seu Futuro/],
    'plano.materiais': [/^1\. O 4 e o 5 são números materiais/, /^2\. O 2, o 3 e o 6/],
    'plano.emocionais': [/^2\. O 2, o 3 e o 6/, /^3\. O 1 e o 8/],
    'plano.mentais': [/^3\. O 1 e o 8/, /^4\. O 7 e o 9/],
    'plano.intuitivos': [/^4\. O 7 e o 9/, /^O nome deve ser disposto/],
    'plano.oito': [/^Já dissemos que o 8 é um número/, /^Entretanto, Arme poderá entrar/],
    'pinaculos.o-que-sao': [/^Cada pináculo mostra/, /^Naturalmente, em qualquer caso/],
    'pinaculos.duracao': [/^Vemos, pois, que o primeiro/, /^Pequena explanação/],
    'ciclos.duracao': [/^O primeiro ciclo é o número/, /^Além dos ciclos/],
    'desafios.o-que-sao': [/^Além dos ciclos/, /^A partir dessas indicações/],
    'ano.o-que-e': [/^A vibração do número de uma pessoa/, /^Podemos também nos voltar/],
    'mes.o-que-e': [/^Podemos também nos voltar/, /^7\. Amor, dinheiro/],
  };
  for (const [chave, [inicio, fim]] of Object.entries(TRECHOS)) {
    textos[chave] = trecho(linhas, inicio, fim);
  }

  // Preserva inclusive a grafia "affnadilhas" do PDF, sem reescrever a autora.
  textos['quadro.uso'] = parte(
    trecho(linhas, /^Se você já organizou/, /^Na linha superior/), /Se você já organizou[\s\S]*?crianças\./, 'quadro.uso');
  textos['ciclos.o-que-sao'] = parte(
    trecho(linhas, /^Naturalmente, em qualquer caso/, /^O primeiro ciclo é o número/), /O maior requinte[\s\S]*pináculos\./, 'ciclos.o-que-sao');

  // Trechos "quanto ao futuro" do cap. 1, usados em Ano e Mês Pessoal (p. 54)
  for (const numero of Object.values(POR_EXTENSO)) {
    const texto = textos[`geral.${numero}`];
    if (!texto) throw new Error(`Trecho não localizado: geral.${numero}`);
    textos[`futuro.${numero}`] = parte(texto, RE_FUTURO, `futuro.${numero}`);
  }
  const nota = textos['ciclos-desafios.nota'];
  textos['desafio.3'] = parte(nota, /No caso dos desafios[\s\S]*?felicidade\./, 'desafio.3');
  textos['ciclo.4-primeiro'] = parte(nota, /O mesmo é válido[\s\S]*?universidade\./, 'ciclo.4-primeiro');
  return textos;
}

async function principal() {
  const caminho = resolve(process.argv[2] ?? PDF_PADRAO);
  if (!process.argv[2] && !existsSync(caminho) && existsSync(SAIDA)) {
    const copia = JSON.parse(readFileSync(SAIDA, 'utf8'));
    const hash = createHash('sha256').update(JSON.stringify(copia.textos)).digest('hex');
    if (hash !== copia.integridade || !copia.fonte?.sha256) {
      throw new Error('A transcrição foi alterada ou não tem conferência de origem. Importe novamente o PDF.');
    }
    console.log('PDF ausente: usando a transcrição já conferida, incluída no projeto.');
    return;
  }
  const { stdout: textoPdf } = await promisify(execFile)('pdftotext', ['-layout', caminho, '-'], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  const textos = extrairTranscricoes(textoPdf);
  mkdirSync(dirname(SAIDA), { recursive: true });
  writeFileSync(
    SAIDA,
    JSON.stringify(
      {
        fonte: {
          arquivo: 'numerologia-mary-anderson-fratermarcos.pdf',
          sha256: createHash('sha256').update(readFileSync(caminho)).digest('hex'),
        },
        integridade: createHash('sha256').update(JSON.stringify(textos)).digest('hex'),
        textos,
      },
      null,
      1,
    ),
  );
  console.log(`${Object.keys(textos).length} passagens gravadas em ${SAIDA}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await principal();
