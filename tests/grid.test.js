/**
 * Testes do quadro: conferem algarismos usados, células, repetições e linhas completas.
 * O resultado esperado usa a disposição própria do mapa, não a ordem numérica comum.
 */
import { describe, expect, it } from 'vitest';
import { calcularQuadro, digitosDaData, LAYOUT_QUADRO } from '../src/domain/birth-grid.js';

describe('TESTE F: quadro 3×3 (p. 52–53)', () => {
  const q = calcularQuadro({ dia: 6, mes: 2, ano: 1950 });

  it('disposição exata do livro', () => {
    expect(LAYOUT_QUADRO).toEqual([[3, 6, 9], [2, 5, 8], [1, 4, 7]]);
  });
  it('06/02/1950 usa 6, 2, 1, 9, 5 e ignora o zero', () => {
    expect(q.digitos).toEqual([6, 2, 1, 9, 5]);
    expect(q.presentes).toEqual([1, 2, 5, 6, 9]);
  });
  it('não preenche 3, 4, 7 e 8', () => {
    expect(q.ausentes).toEqual([3, 4, 7, 8]);
    const celula = (n) => q.celulas.flat().find((c) => c.numero === n);
    [3, 4, 7, 8].forEach((n) => expect(celula(n).vezes).toBe(0));
  });
  it('posiciona cada número na célula certa', () => {
    expect(q.celulas[0][1]).toEqual({ numero: 6, vezes: 1 });
    expect(q.celulas[1][0]).toEqual({ numero: 2, vezes: 1 });
    expect(q.celulas[2][0]).toEqual({ numero: 1, vezes: 1 });
    expect(q.celulas[0][2]).toEqual({ numero: 9, vezes: 1 });
    expect(q.celulas[1][1]).toEqual({ numero: 5, vezes: 1 });
  });
  it('soma da data: 23 → 5 (p. 53)', () => {
    expect(q.soma).toBe(23);
    expect(q.reducaoSoma.valor).toBe(5);
  });
  it('identifica a diagonal 1-5-9 do exemplo', () => {
    expect(q.linhasCompletas.map((l) => l.tipo)).toEqual(['diagonal']);
  });
  it('registra repetições', () => {
    const r = calcularQuadro({ dia: 11, mes: 11, ano: 1991 });
    expect(r.contagem[1]).toBe(6);
    expect(r.contagem[9]).toBe(2);
    expect(r.repetidos).toEqual([1, 9]);
  });
  it('não interpreta a diagonal 3-5-7, ausente do livro', () => {
    const r = calcularQuadro({ dia: 3, mes: 5, ano: 7777 });
    expect(r.linhasCompletas).toEqual([]);
  });
  it('dia e mês de dois algarismos', () => {
    expect(digitosDaData({ dia: 10, mes: 12, ano: 2001 })).toEqual([1, 1, 2, 2, 1]);
  });
});
