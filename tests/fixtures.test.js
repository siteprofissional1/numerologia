/**
 * Exemplos completos com resultados conhecidos, usados como referência independente.
 * Se uma alteração trocar a ordem das somas ou a política de mestres, estes casos a detectam.
 */
import { describe, expect, it } from 'vitest';
import { gerarMapa, calcularNumerosDoNome } from '../src/domain/numerology-map.js';
import { REGRAS_PADRAO } from '../src/config/rules.js';
import { reduzirComMestres, reduzirSimples, somaDigitos } from '../src/domain/reduce.js';
import { calcularSuprimentos } from '../src/domain/name-numbers.js';

const nome = (n) => calcularNumerosDoNome(n, REGRAS_PADRAO);
const subtotais = (posicao) => posicao.palavras.map((p) => p.reducao.valor);

describe('Motor de redução', () => {
  it('soma algarismos', () => expect(somaDigitos(1947)).toBe(21));
  it('redução simples registra o mestre do caminho', () => {
    expect(reduzirSimples(29)).toMatchObject({ caminho: [29, 11, 2], valor: 2, mestre: 11 });
    expect(reduzirSimples(40)).toMatchObject({ caminho: [40, 4], valor: 4, mestre: null });
  });
  it('redução com mestres para em 11 e 22', () => {
    expect(reduzirComMestres(29)).toMatchObject({ valor: 11, reduzido: 2, mestre: 11 });
    expect(reduzirComMestres(22)).toMatchObject({ caminho: [22], valor: 22, reduzido: 4 });
    expect(reduzirComMestres(28)).toMatchObject({ caminho: [28, 10, 1], valor: 1, mestre: null });
  });
  it('recusa negativos e não inteiros', () => {
    expect(() => reduzirSimples(-1)).toThrow(RangeError);
    expect(() => reduzirComMestres(1.5)).toThrow(RangeError);
  });
});

describe('TESTE B: JEAN HARVEY (p. 17)', () => {
  const r = nome('Jean Harvey');
  it('vogais por palavra: 6 e 6 → 12 → 3', () => {
    expect(subtotais(r.ambicao)).toEqual([6, 6]);
    expect(r.ambicao.reducao.caminho).toEqual([12, 3]);
    expect(r.ambicao.valor).toBe(3);
  });
  it('consoantes: 6 e 28 → 10 → 1; total 7', () => {
    expect(r.personalidade.palavras[1].soma).toBe(28);
    expect(r.personalidade.palavras[1].reducao.caminho).toEqual([28, 10, 1]);
    expect(r.personalidade.valor).toBe(7);
  });
  it('o Y de HARVEY é consoante e entra na grafia integral', () => {
    const letras = r.personalidade.palavras[1].letras.map((l) => l.letra).join('');
    expect(letras).toBe('HRVY');
  });
  it('expressão: 3 + 7 = 10 → 1, com controle', () => {
    expect(r.expressao.reducao.caminho).toEqual([10, 1]);
    expect(r.expressao.valor).toBe(1);
    expect(r.expressao.confere).toBe(true);
  });
});

describe('TESTE C: DAVID WEIR (p. 18–21)', () => {
  const r = nome('David Weir');
  it('ambição 24 → 6, impressão 26 → 8, expressão 5', () => {
    expect(r.ambicao.bruto).toBe(24);
    expect(r.ambicao.valor).toBe(6);
    expect(r.personalidade.bruto).toBe(26);
    expect(r.personalidade.valor).toBe(8);
    expect(r.expressao.bruto).toBe(50);
    expect(r.expressao.valor).toBe(5);
  });
  it('subtotais por palavra da p. 18', () => {
    expect(r.ambicao.palavras.map((p) => p.soma)).toEqual([10, 14]);
    expect(subtotais(r.ambicao)).toEqual([1, 5]);
    expect(r.personalidade.palavras.map((p) => p.soma)).toEqual([12, 14]);
  });
  it('frequências da p. 20', () => {
    expect(r.frequencias.contagem).toEqual({ 1: 1, 2: 0, 3: 0, 4: 3, 5: 2, 6: 0, 7: 0, 8: 0, 9: 3 });
    expect(r.frequencias.ausentes).toEqual([2, 3, 6, 7, 8]);
    expect(r.frequencias.maisFrequentes).toEqual([4, 9]);
  });
  it('faltas não supridas por posições principais: 2, 3 e 7 (p. 20)', () => {
    const posicoes = [r.ambicao, r.personalidade, r.expressao].map((p) => ({
      rotulo: p.rotulo, valor: p.valor, reduzido: p.valor,
    }));
    const naoSupridos = calcularSuprimentos(r.frequencias, posicoes)
      .filter((s) => !s.suprido)
      .map((s) => s.numero);
    expect(naoSupridos).toEqual([2, 3, 7]);
  });
});

describe('TESTE D: ANNE LOUISE JONES (p. 46–50)', () => {
  const m = gerarMapa({ nome: 'Anne Louise Jones', data: '02/04/1946', anoConsulta: 1971 });
  it('cinco números centrais', () => {
    expect(m.ambicao.valor).toBe(4);
    expect(m.personalidade.valor).toBe(3);
    expect(m.expressao.valor).toBe(7);
    expect(m.destino.valor).toBe(8);
    expect(m.realidade.valor).toBe(6);
  });
  it('subtotais das vogais: 6, 23 → 5, 11; registra 22/4', () => {
    expect(m.ambicao.palavras.map((p) => p.soma)).toEqual([6, 23, 11]);
    expect(subtotais(m.ambicao)).toEqual([6, 5, 11]);
    expect(m.ambicao.somaSubtotais).toBe(22);
    expect(m.ambicao.mestre).toBe(22);
    expect(m.ambicao.exibicao).toBe('22/4');
  });
  it('somas brutas: vogais 40 → 4, consoantes 21 → 3, todas 61 → 7', () => {
    expect(m.ambicao.bruto).toBe(40);
    expect(m.ambicao.reducaoBruta.valor).toBe(4);
    expect(m.personalidade.bruto).toBe(21);
    expect(m.personalidade.reducaoBruta.valor).toBe(3);
    expect(m.expressao.bruto).toBe(61);
    expect(m.expressao.controle.valor).toBe(7);
  });
  it('frequências corrigem o erro da p. 48: há dois números 6', () => {
    expect(m.frequencias.contagem).toEqual({ 1: 4, 2: 0, 3: 2, 4: 0, 5: 6, 6: 2, 7: 0, 8: 0, 9: 1 });
  });
  it('planos de expressão: 6, 4, 4, 1', () => {
    expect(m.planos).toMatchObject({ materiais: 6, emocionais: 4, mentais: 4, intuitivos: 1 });
    expect(m.planos.maiores).toEqual(['materiais']);
  });
  it('destino: 2 + 4 + 2 = 8', () => {
    expect(m.destino.parcelas).toEqual([2, 4, 2]);
  });
  it('realidade: 7 + 8 = 15 → 6', () => {
    expect(m.realidade.reducao.caminho).toEqual([15, 6]);
  });
});

describe('Mapa completo', () => {
  it('reúne erros de nome e data', () => {
    const r = gerarMapa({ nome: '', data: '31/04/2000' });
    expect(r.ok).toBe(false);
    expect(r.erros).toHaveLength(2);
  });
  it('é determinístico e calcula valores diferentes para entradas diferentes', () => {
    const a = gerarMapa({ nome: 'Ana', data: '01/01/2000' });
    const b = gerarMapa({ nome: 'Ana', data: '01/01/2000' });
    const c = gerarMapa({ nome: 'Bruno Lima', data: '20/07/1985' });
    expect(a).toEqual(b);
    expect(c.destino.valor).not.toBe(a.destino.valor);
  });
  it('Expressão por posições sempre confere com a soma de todas as letras', () => {
    for (const n of ['Maria da Silva', 'João Pedro', 'Ana', 'Xavier Quintana', 'Zé']) {
      expect(nome(n).expressao.confere).toBe(true);
    }
  });
});
