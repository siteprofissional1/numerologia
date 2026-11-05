import { describe, expect, it } from 'vitest';
import { classificarPar, combinarNumeros, compararMapas } from '../src/domain/compatibility.js';
import { gerarMapa } from '../src/domain/numerology-map.js';

describe('TESTE I: combinações (p. 69)', () => {
  it('Expressões 1 + 9 = 10 → 1', () => {
    expect(combinarNumeros(1, 9)).toMatchObject({ valor: 1, conta: '1 + 9 = 10 → 1' });
  });
  it('Expressões 1 + 1 = 2', () => expect(combinarNumeros(1, 1).valor).toBe(2));
  it('Destinos 6 + 9 = 15 → 6', () => {
    expect(combinarNumeros(6, 9)).toMatchObject({ valor: 6, conta: '6 + 9 = 15 → 6' });
  });
});

describe('Classificações (p. 68)', () => {
  it('mesmo grupo: similares', () => {
    expect(classificarPar(6, 9).rotulo).toBe('Similares');
    expect(classificarPar(1, 7).rotulo).toBe('Similares');
    expect(classificarPar(2, 4).rotulo).toBe('Similares');
  });
  it('mesma paridade, grupos diferentes: complementares', () => {
    expect(classificarPar(1, 3).rotulo).toBe('Complementares');
    expect(classificarPar(2, 6).rotulo).toBe('Complementares');
  });
  it('par e ímpar de grupos diferentes: opostos', () => {
    expect(classificarPar(1, 2).rotulo).toBe('Opostos');
    expect(classificarPar(3, 4).rotulo).toBe('Opostos');
  });
  it('indica números iguais à parte', () => {
    expect(classificarPar(5, 5)).toMatchObject({ rotulo: 'Similares', iguais: true });
  });
  it('não impõe classificação quando 11 e 2 divergem na paridade', () => {
    const r = classificarPar(11, 3);
    expect(r.ambiguo).toBe(true);
    expect(r.classe).toBeNull();
    expect(r.rotulo).toBe('Complementares ou Opostos');
    expect(r.leituras).toHaveLength(2);
  });
  it('não impõe classificação quando o 8 fora do Fogo (p. 68) muda o resultado', () => {
    const r = classificarPar(8, 2);
    expect(r.ambiguo).toBe(true);
    expect(r.rotulo).toBe('Similares ou Complementares');
  });
  it('não há ambiguidade quando as leituras coincidem', () => {
    expect(classificarPar(8, 1)).toMatchObject({ rotulo: 'Opostos', ambiguo: false });
    expect(classificarPar(22, 6)).toMatchObject({ rotulo: 'Complementares', ambiguo: false });
  });
  it('não classifica número indeterminado', () => {
    expect(classificarPar(null, 3).classe).toBeNull();
  });
});

describe('Comparação de dois mapas', () => {
  const a = gerarMapa({ nome: 'Anne Louise Jones', data: '02/04/1946' });
  const b = gerarMapa({ nome: 'David Weir', data: '21/04/1942' });
  const c = compararMapas(a, b);

  it('compara as cinco posições e classifica só Ambição e Destino', () => {
    expect(c.posicoes.map((p) => p.rotulo)).toEqual([
      'Ambição', 'Personalidade', 'Expressão', 'Caminho do Destino', 'Realidade',
    ]);
    expect(c.posicoes.filter((p) => p.classificacao).map((p) => p.rotulo)).toEqual(['Ambição', 'Caminho do Destino']);
  });
  it('compara elemento, pináculos e ciclos', () => {
    expect(c.elemento).toEqual({ a: 'Fogo', b: 'Ar', mesmo: false });
    expect(c.pinaculos).toHaveLength(4);
    expect(c.ciclos).toHaveLength(3);
  });
  it('mostra afinidades na direção em que o livro as lista', () => {
    // Ambição 1 (A) e Ambição 4 (Au): o 1 lista o 4, mas o 4 não lista o 1 (cap. 1).
    const ambicao = compararMapas(
      gerarMapa({ nome: 'A', data: '01/01/2000' }),
      gerarMapa({ nome: 'Au', data: '01/01/2000' }),
    ).posicoes[0];
    expect(ambicao.afinidade).toEqual({ aListaB: true, bListaA: false });
  });
  it('não produz percentual nem probabilidade', () => {
    expect(JSON.stringify(c)).not.toMatch(/percent|%|probab/i);
  });
});
