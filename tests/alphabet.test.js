import { describe, expect, it } from 'vitest';
import { TABELA_LETRAS, valorLetra } from '../src/domain/alphabet.js';

describe('TESTE A: tabela de letras (p. 16)', () => {
  const esperado = {
    1: 'AJS', 2: 'BKT', 3: 'CLU', 4: 'DMV', 5: 'ENW', 6: 'FOX', 7: 'GPY', 8: 'HQZ', 9: 'IR',
  };

  it.each(Object.entries(esperado))('número %s corresponde a %s', (numero, letras) => {
    for (const letra of letras) expect(valorLetra(letra)).toBe(Number(numero));
  });

  it('cobre as 26 letras exatamente uma vez', () => {
    const todas = Object.values(TABELA_LETRAS).join('');
    expect(todas).toHaveLength(26);
    expect(new Set(todas).size).toBe(26);
  });

  it.each(['Á', '1', '-', ' ', 'constructor', '__proto__', ''])('não atribui número a %j', (s) => {
    expect(valorLetra(s)).toBeNull();
  });
});
