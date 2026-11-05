/**
 * Testes dos catálogos e da importação: conferem chaves, cobertura e fidelidade das passagens.
 * Quando o PDF está disponível, a comparação verifica também as palavras da fonte original.
 */
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CORRECAO_DIA_18, DIAS_NASCIMENTO } from '../src/data/birth-days.js';
import { CAMINHOS_DESTINO } from '../src/data/destiny-meanings.js';
import { FALTAS, APTIDOES } from '../src/data/intensification.js';
import { SIGNIFICADOS_GERAIS, AFINIDADES } from '../src/data/general-meanings.js';
import { LEITURAS_ORACULO } from '../src/data/oracle-readings.js';
import { PINACULOS_SIGNIFICADOS } from '../src/data/pinnacle-meanings.js';
import { PLANOS } from '../src/data/expression-planes.js';
import { RELACIONAMENTOS } from '../src/data/relationships.js';
import { ELEMENTOS_TEXTO } from '../src/data/elements.js';
import { INCONSISTENCIAS } from '../src/data/inconsistencies.js';
import { REGRAS, CLASSIFICACOES } from '../src/data/rules-catalog.js';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { linhasPorPagina, juntar, paragrafos, extrairTranscricoes } from '../scripts/importar-textos-privados.mjs';
import { FUTURO_POR_NUMERO } from '../src/data/general-meanings.js';
import { LEITURAS_QUADRO } from '../src/data/grid-notes.js';
import { NOTAS_PLANOS } from '../src/data/expression-planes.js';
import { NOTA_CICLOS_DESAFIOS, EXEMPLOS_ESPECIFICOS, EXPLICACOES_FUTURO } from '../src/data/pinnacle-meanings.js';
import { NOTA_ELEMENTO_VOCACAO } from '../src/data/elements.js';
import { NOTA_REALIDADE } from '../src/data/relationships.js';

const DOZE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22];
const chaves = (o) => Object.keys(o).map(Number).sort((a, b) => a - b);

function validarRegistro(r) {
  expect(r.obra).toContain('O poder secreto dos números');
  expect(r.capitulo).toBeGreaterThanOrEqual(1);
  expect(r.capitulo).toBeLessThanOrEqual(8);
  expect(r.tituloCapitulo).toBeTruthy();
  expect(r.paginaInicial).toBeGreaterThanOrEqual(6);
  expect(r.paginaFinal).toBeGreaterThanOrEqual(r.paginaInicial);
  expect(r.paginaFinal).toBeLessThanOrEqual(72);
  expect(r.categoria).toBeTruthy();
  expect(r.interpretacao.length).toBeGreaterThan(20);
  expect(r.tipoTexto).toBe('resumo-fiel');
  expect(r.chave).toBeTruthy();
}

describe('TESTE K: correção do dia 18 (p. 38)', () => {
  const lista = Object.values(DIAS_NASCIMENTO);

  it('1. existem exatamente 31 registros', () => expect(lista).toHaveLength(31));
  it('2. as chaves são os inteiros de 1 a 31', () => {
    expect(chaves(DIAS_NASCIMENTO)).toEqual(Array.from({ length: 31 }, (_, i) => i + 1));
    lista.forEach((r) => expect(DIAS_NASCIMENTO[r.numero]).toBe(r));
  });
  it('3. não há registros duplicados', () => {
    expect(new Set(lista.map((r) => r.interpretacao)).size).toBe(31);
    expect(new Set(lista.map((r) => r.titulo)).size).toBe(31);
  });
  it('4. o dia 15 mantém a interpretação original, da p. 37', () => {
    expect(DIAS_NASCIMENTO[15].paginaInicial).toBe(37);
    expect(DIAS_NASCIMENTO[15].interpretacao).toMatch(/Cooperativo/);
    expect(DIAS_NASCIMENTO[15].observacaoEditorial).toBeNull();
  });
  it('5–6. a seção de título incorreto, entre 17 e 19, é o dia 18', () => {
    expect(DIAS_NASCIMENTO[18].titulo).toBe('Nascido no dia 18');
    expect(DIAS_NASCIMENTO[18].paginaInicial).toBe(38);
    expect(DIAS_NASCIMENTO[18].interpretacao).toMatch(/líder nato/);
  });
  it('7. o dia 19 permanece correto', () => {
    expect(DIAS_NASCIMENTO[19].paginaInicial).toBe(38);
    expect(DIAS_NASCIMENTO[19].paginaFinal).toBe(39);
    expect(DIAS_NASCIMENTO[19].interpretacao).toMatch(/Radical/);
  });
  it('8. a sequência 17 → 18 → 19 funciona', () => {
    expect([17, 18, 19].map((d) => DIAS_NASCIMENTO[d].numero)).toEqual([17, 18, 19]);
    expect([17, 18, 19].map((d) => DIAS_NASCIMENTO[d].paginaInicial)).toEqual([38, 38, 38]);
  });
  it('9. a correção está documentada no registro, no inventário de erros e nos docs', () => {
    expect(DIAS_NASCIMENTO[18].observacaoEditorial).toBe(CORRECAO_DIA_18);
    expect(INCONSISTENCIAS.find((i) => i.id === 'I-01').solucao).toMatch(/dia 18/);
    const doc = readFileSync(new URL('../docs/INCONSISTENCIAS_DO_LIVRO.md', import.meta.url), 'utf8');
    expect(doc).toMatch(/dia 18/);
  });
  it('10. nascidos nos dias 15 e 18 recebem interpretações diferentes', () => {
    expect(DIAS_NASCIMENTO[15].interpretacao).not.toBe(DIAS_NASCIMENTO[18].interpretacao);
  });
});

describe('Importador da cópia privada', () => {
  const FICTICIO = [
    'Nascido no dia 15', 'texto quinze', 'Nascido no dia 16', 'texto dezesseis',
    'Nascido no dia 17', 'texto dezessete', 'Nascido no dia 15', 'um texto como 38 ensaísta bom', '38',
  ].join('\n');

  it('remove o rodapé somente quando corresponde à página', () => {
    const l = linhasPorPagina('corpo\n1\n\fsegunda\n1\n2\n');
    expect(l.map((x) => x.texto)).toEqual(['corpo', 'segunda', '1']);
  });
  it('junta linhas e preserva hífen real', () => {
    expect(juntar(['auto-', 'expressão e', 'arte'])).toBe('auto-expressão e arte');
  });
  it('recusa um PDF que não contém as seções esperadas', () => {
    expect(() => extrairTranscricoes(FICTICIO)).toThrow(/não localizado/);
  });

  it('reconstrói parágrafos pelo recuo de primeira linha e por linha curta', () => {
    const l = (texto, recuo = 0) => ({ texto, recuo });
    expect(paragrafos([l('Primeira linha longa de um parágrafo qualquer, que ocupa', 2), l('toda a largura. Fim.'), l('Segundo', 2), l('parágrafo.')]))
      .toBe('Primeira linha longa de um parágrafo qualquer, que ocupa toda a largura. Fim.\n\nSegundo parágrafo.');
  });

  const PDF = new URL('../../numerologia-mary-anderson-fratermarcos.pdf', import.meta.url);
  it.runIf(existsSync(PDF))('cada passagem é idêntica ao PDF, palavra por palavra', async () => {
    const { stdout: bruto } = await promisify(execFile)('pdftotext', ['-layout', PDF.pathname, '-'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    const livro = juntar(linhasPorPagina(bruto).map((x) => x.texto));
    const textos = extrairTranscricoes(bruto);
    expect(Object.keys(textos).length).toBeGreaterThan(140);
    for (const [chave, texto] of Object.entries(textos)) {
      const plano = texto.replace(/\n\n/g, ' ').replace(/\s+/g, ' ');
      // Únicas alterações permitidas: o número de página no dia 18 incorporado à frase pelo PDF.
      const CORRECOES = {
        'dia.18': ['como ensaísta', 'como 38 ensaísta'],
      };
      const esperado = CORRECOES[chave] ? plano.replace(...CORRECOES[chave]) : plano;
      expect(livro.includes(esperado), chave).toBe(true);
    }
  });

  const CAMINHO = new URL('../src/data/private/transcricoes.json', import.meta.url);
  it.runIf(existsSync(CAMINHO))('a cópia gerada aplica a correção do dia 18 e cobre todas as bases', () => {
    const { textos } = JSON.parse(readFileSync(CAMINHO, 'utf8'));
    const conta = (p) => Object.keys(textos).filter((k) => k.startsWith(p)).length;
    expect(conta('dia.')).toBe(31);
    expect(conta('geral.')).toBe(11);
    expect(conta('destino.')).toBe(11);
    expect(conta('aptidao.')).toBe(9);
    expect(conta('falta.')).toBe(9);
    expect(conta('pinaculo.')).toBe(11);
    for (const categoria of ['amor', 'dinheiro', 'sucesso']) expect(conta(`oraculo.${categoria}.`)).toBe(11);
    expect(textos['dia.18']).toMatch(/líder nato/);
    expect(textos['dia.18']).not.toMatch(/como 38/);
    expect(textos['dia.15']).toMatch(/cooperar/);
    expect(textos['dia.18']).not.toBe(textos['dia.15']);
    expect(textos['dia.19']).toMatch(/radical/);
  });
});

describe('Banco de interpretações', () => {
  it('11 significados gerais, com afinidades e futuro', () => {
    expect(chaves(SIGNIFICADOS_GERAIS)).toEqual(DOZE);
    for (const r of Object.values(SIGNIFICADOS_GERAIS)) {
      validarRegistro(r);
      expect(r.capitulo).toBe(1);
      expect(r.futuro.length).toBeGreaterThan(10);
      expect(r.afinidades).toBe(AFINIDADES[r.numero]);
    }
  });
  it('11 caminhos do destino, distintos dos significados gerais', () => {
    expect(chaves(CAMINHOS_DESTINO)).toEqual(DOZE);
    for (const r of Object.values(CAMINHOS_DESTINO)) {
      validarRegistro(r);
      expect(r.capitulo).toBe(3);
      expect(r.interpretacao).not.toBe(SIGNIFICADOS_GERAIS[r.numero].interpretacao);
    }
  });
  it('dias válidos', () => Object.values(DIAS_NASCIMENTO).forEach(validarRegistro));
  it('aptidões e faltas de 1 a 9', () => {
    expect(chaves(APTIDOES)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(chaves(FALTAS)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    [...Object.values(APTIDOES), ...Object.values(FALTAS)].forEach(validarRegistro);
  });
  it('quatro planos e três elementos', () => {
    expect(Object.keys(PLANOS)).toEqual(['materiais', 'emocionais', 'mentais', 'intuitivos']);
    Object.values(PLANOS).forEach(validarRegistro);
    expect(Object.keys(ELEMENTOS_TEXTO)).toEqual(['agua', 'fogo', 'ar']);
    Object.values(ELEMENTOS_TEXTO).forEach(validarRegistro);
  });
  it('11 pináculos', () => {
    expect(chaves(PINACULOS_SIGNIFICADOS)).toEqual(DOZE);
    Object.values(PINACULOS_SIGNIFICADOS).forEach(validarRegistro);
  });
  it('33 leituras distintas em Amor, Dinheiro e Sucesso', () => {
    const todas = Object.values(LEITURAS_ORACULO).flatMap((c) => Object.values(c));
    expect(todas).toHaveLength(33);
    expect(new Set(todas.map((r) => r.interpretacao)).size).toBe(33);
    expect(new Set(todas.map((r) => r.chave)).size).toBe(33);
    for (const categoria of Object.values(LEITURAS_ORACULO)) expect(chaves(categoria)).toEqual(DOZE);
    todas.forEach(validarRegistro);
  });
  it('relacionamentos do cap. 8', () => {
    Object.values(RELACIONAMENTOS).forEach((r) => {
      validarRegistro(r);
      expect(r.capitulo).toBe(8);
    });
  });
  it('as chaves dos resumos correspondem às da cópia privada', () => {
    const caminho = new URL('../src/data/private/transcricoes.json', import.meta.url);
    if (!existsSync(caminho)) return;
    const { textos } = JSON.parse(readFileSync(caminho, 'utf8'));
    const registros = [
      ...Object.values(SIGNIFICADOS_GERAIS), ...Object.values(CAMINHOS_DESTINO),
      ...Object.values(DIAS_NASCIMENTO), ...Object.values(APTIDOES), ...Object.values(FALTAS),
      ...Object.values(PINACULOS_SIGNIFICADOS), ...Object.values(ELEMENTOS_TEXTO),
      ...Object.values(LEITURAS_ORACULO).flatMap((c) => Object.values(c)),
      ...Object.values(RELACIONAMENTOS), ...Object.values(PLANOS), ...Object.values(NOTAS_PLANOS),
      ...Object.values(FUTURO_POR_NUMERO), ...Object.values(LEITURAS_QUADRO), ...Object.values(EXEMPLOS_ESPECIFICOS),
      ...Object.values(EXPLICACOES_FUTURO), NOTA_CICLOS_DESAFIOS, NOTA_ELEMENTO_VOCACAO, NOTA_REALIDADE,
    ];
    for (const r of registros) expect(textos[r.chave], r.chave).toBeTruthy();
  });
});

describe('Documentação', () => {
  it('cada regra tem todos os campos exigidos', () => {
    for (const r of REGRAS) {
      for (const campo of ['id', 'nome', 'capitulo', 'paginas', 'formula', 'exemplo', 'casosEspeciais', 'mestres', 'ambiguidades', 'implementacao']) {
        expect(r[campo], `${r.id}.${campo}`).toBeTruthy();
      }
      expect(CLASSIFICACOES[r.classificacao]).toBeTruthy();
    }
  });
  it('registra as inconsistências da lista mínima', () => {
    expect(INCONSISTENCIAS.length).toBeGreaterThanOrEqual(13);
    expect(new Set(INCONSISTENCIAS.map((i) => i.id)).size).toBe(INCONSISTENCIAS.length);
    for (const i of INCONSISTENCIAS) {
      for (const campo of ['paginas', 'tipo', 'titulo', 'passagem', 'problema', 'solucao']) {
        expect(i[campo], `${i.id}.${campo}`).toBeTruthy();
      }
    }
  });
  it.each(['INVENTARIO_DO_LIVRO', 'REGRAS_COM_FONTES', 'INCONSISTENCIAS_DO_LIVRO', 'DECISOES_DE_IMPLEMENTACAO', 'MATRIZ_DE_COBERTURA', 'README'])(
    'existe docs/%s.md',
    (doc) => expect(existsSync(new URL(`../docs/${doc}.md`, import.meta.url))).toBe(true),
  );
});
