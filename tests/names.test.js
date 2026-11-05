import { describe, expect, it } from 'vitest';
import { decomporNome, validarNome } from '../src/domain/normalize-name.js';
import { calcularNumerosDoNome } from '../src/domain/numerology-map.js';
import { REGRAS_PADRAO } from '../src/config/rules.js';

const calcular = (n, modo = 'convencao') =>
  calcularNumerosDoNome(n, { ...REGRAS_PADRAO, normalizacao: modo });

describe('TESTE J: nomes', () => {
  it('nomes acentuados equivalem à forma sem acento, preservando a grafia', () => {
    const a = calcular('José Conceição');
    const b = calcular('Jose Conceicao');
    expect(a.ambicao.valor).toBe(b.ambicao.valor);
    expect(a.personalidade.valor).toBe(b.personalidade.valor);
    expect(a.analise.original).toBe('José Conceição');
    expect(a.analise.transformacoes).toEqual(
      expect.arrayContaining([{ de: 'é', para: 'E' }, { de: 'ç', para: 'C' }, { de: 'ã', para: 'A' }]),
    );
  });

  it('aceita acentos em forma decomposta (NFD)', () => {
    expect(calcular('José').analise.palavras[0].letras[3]).toMatchObject({ normalizada: 'E', transformada: true });
  });

  it('modo estrito recusa acentos, mas aceita A–Z', () => {
    expect(validarNome('José', { modo: 'estrito' }).ok).toBe(false);
    expect(validarNome('Jose', { modo: 'estrito' }).ok).toBe(true);
  });

  it('espaços múltiplos são colapsados na exibição e não mudam o cálculo', () => {
    const r = calcular('  Ana    Maria  ');
    expect(r.analise.original).toBe('Ana Maria');
    expect(r.analise.palavras).toHaveLength(2);
    expect(r.ambicao.valor).toBe(calcular('Ana Maria').ambicao.valor);
  });

  it('hífen separa palavras; apóstrofo fica na grafia, sem valor', () => {
    expect(decomporNome('Jean-Pierre').palavras.map((p) => p.original)).toEqual(['Jean', 'Pierre']);
    const r = decomporNome("D'Ávila");
    expect(r.palavras).toHaveLength(1);
    expect(r.palavras[0].original).toBe("D'Ávila");
    expect(r.palavras[0].letras.map((l) => l.normalizada).join('')).toBe('DAVILA');
  });

  it.each(['Ana3', 'Ana@', 'João_Silva', '<script>', 'Ана', 'Straße', 'Søren', 'ı', '😀'])(
    'recusa caracteres sem valor: %s',
    (n) => {
      const v = validarNome(n);
      expect(v.ok).toBe(false);
      expect(v.erros[0]).toContain('Caracteres');
    },
  );

  it('recusa nome vazio e nome sem letras', () => {
    expect(validarNome('   ').ok).toBe(false);
    expect(validarNome("-'-").ok).toBe(false);
  });
});

describe('TESTE J: regra do Y (p. 16, 45)', () => {
  it('é consoante quando há outra vogal no nome completo', () => {
    const r = calcular('Lynn Ana');
    const y = r.analise.palavras[0].letras[1];
    expect(y.tipo).toBe('consoante');
  });
  it('é vogal quando não há A, E, I, O, U no nome inteiro', () => {
    const r = calcular('Lynn Myrr');
    expect(r.analise.yEhVogal).toBe(true);
    expect(r.ambicao.bruto).toBe(14);
    expect(r.ambicao.indeterminado).toBe(false);
  });
});

describe('TESTE J: nomes sem vogais ou sem consoantes', () => {
  it('sem vogal nem Y, a Ambição é indeterminada, com aviso', () => {
    const r = calcular('Brr Krt');
    expect(r.ambicao.indeterminado).toBe(true);
    expect(r.ambicao.valor).toBeNull();
    expect(r.ambicao.passos[0]).toContain('não pode ser determinada');
    expect(r.personalidade.indeterminado).toBe(false);
    expect(r.expressao.parcial).toBe(true);
    expect(r.expressao.valor).toBe(r.personalidade.valor);
  });
  it('sem consoantes, a Personalidade é indeterminada', () => {
    const r = calcular('Aia Eu');
    expect(r.personalidade.indeterminado).toBe(true);
    expect(r.expressao.valor).toBe(r.ambicao.valor);
  });
});
