import { describe, expect, it } from 'vitest';
import { gerarMapa } from '../src/domain/numerology-map.js';
import { calcularIdadeEncerramento, dataNaIdade } from '../src/domain/pinnacles.js';
import { REGRAS_PADRAO } from '../src/config/rules.js';

const mapa = (modo = 'nove', data = '21/04/1942', extras = {}) =>
  gerarMapa({ nome: 'Teste Exemplo', data, anoConsulta: 1971, regras: { modoPinaculos: modo, ...extras } });

describe('TESTE G: pináculos, ciclos e desafios (p. 55–56)', () => {
  const m = mapa();
  it('componentes D = 3, M = 4, A = 7, Destino = 5', () => {
    expect(m.componentes.dia.usado).toBe(3);
    expect(m.componentes.mes.usado).toBe(4);
    expect(m.componentes.ano.usado).toBe(7);
    expect(m.destino.valor).toBe(5);
  });
  it('primeiro limite: 36 − 5 = 31', () => {
    expect(m.pinaculos.encerramento.idade).toBe(31);
    expect(m.pinaculos.encerramento.formula).toBe('36 − 5 = 31');
  });
  it('pináculos 7, 1, 8, 11', () => {
    expect(m.pinaculos.itens.map((p) => p.valor)).toEqual([7, 1, 8, 11]);
    expect(m.pinaculos.itens[1].reducao.caminho).toEqual([10, 1]);
  });
  it('desafios 1, 4, 3, 3', () => {
    expect(m.desafios.itens.map((d) => d.valor)).toEqual([1, 4, 3, 3]);
  });
  it('ciclos 4, 3, 7', () => {
    expect(m.ciclos.itens.map((c) => c.valor)).toEqual([4, 3, 7]);
  });
});

describe('Dois modos de intervalo (p. 53 × p. 56)', () => {
  it('Modo 1: regra textual de nove anos', () => {
    expect(mapa('nove').pinaculos.itens.map((p) => [p.inicio, p.fim])).toEqual([
      [0, 31], [32, 40], [41, 49], [50, null],
    ]);
  });
  it('Modo 2: tabela literal do livro', () => {
    expect(mapa('tabela').pinaculos.itens.map((p) => [p.inicio, p.fim])).toEqual([
      [0, 31], [32, 41], [42, 51], [52, null],
    ]);
  });
  it('as duas leituras ficam sempre disponíveis', () => {
    const p = mapa().pinaculos;
    expect(p.faixasNove[1]).toBe('32 a 40 anos');
    expect(p.faixasTabela[1]).toBe('32 a 41 anos');
  });
  it('o ciclo do dia ocupa os nove primeiros anos do quarto pináculo', () => {
    for (const modo of ['nove', 'tabela']) {
      const m = mapa(modo);
      const quarto = m.pinaculos.itens[3];
      const [, segundo, terceiro] = m.ciclos.itens;
      expect(segundo.fim - quarto.inicio + 1).toBe(9);
      expect(terceiro.inicio).toBe(segundo.fim + 1);
      expect(terceiro.fim).toBeNull();
    }
    expect(mapa('nove').ciclos.itens[2].inicio).toBe(59);
    expect(mapa('tabela').ciclos.itens[2].inicio).toBe(61);
  });
  it('ciclos e desafios acompanham os pináculos sem lacunas', () => {
    const m = mapa();
    for (const lista of [m.pinaculos.itens, m.ciclos.itens, m.desafios.itens]) {
      for (let i = 1; i < lista.length; i += 1) expect(lista[i].inicio).toBe(lista[i - 1].fim + 1);
    }
  });
});

describe('Casos especiais', () => {
  it('Destino 11: documenta as duas contas de 36 − N', () => {
    const destino = { valor: 11, reduzido: 2, mestre: 11 };
    const literal = calcularIdadeEncerramento(destino, REGRAS_PADRAO);
    expect(literal.ambiguo).toBe(true);
    expect(literal.idade).toBe(25);
    expect(literal.alternativas.reduzido.idade).toBe(34);
    const reduzido = calcularIdadeEncerramento(destino, { ...REGRAS_PADRAO, idadeDestinoMestre: 'reduzido' });
    expect(reduzido.idade).toBe(34);
  });
  it('Destino 22: 14 literal ou 32 reduzido', () => {
    const r = calcularIdadeEncerramento({ valor: 22, reduzido: 4, mestre: 22 }, REGRAS_PADRAO);
    expect(r.alternativas.literal.idade).toBe(14);
    expect(r.alternativas.reduzido.idade).toBe(32);
  });
  it('desafio zero é preservado', () => {
    const m = mapa('nove', '04/04/1993');
    expect(m.desafios.itens[0]).toMatchObject({ valor: 0, zero: true, exibicao: '0' });
  });
  it('terceiro pináculo soma dois mestres', () => {
    const m = gerarMapa({ nome: 'Ana', data: '09/02/2009', regras: {} });
    expect(m.pinaculos.itens[0].valor).toBe(11);
    expect(m.pinaculos.itens[1].valor).toBe(11);
    expect(m.pinaculos.itens[2].valor).toBe(22);
  });
  it('datas correspondentes, inclusive 29/02 em ano comum', () => {
    expect(dataNaIdade({ dia: 21, mes: 4, ano: 1942 }, 32)).toBe('21/04/1974');
    expect(dataNaIdade({ dia: 29, mes: 2, ano: 2000 }, 1)).toBe('28/02/2001');
    expect(dataNaIdade({ dia: 29, mes: 2, ano: 2000 }, 4)).toBe('29/02/2004');
  });
});
