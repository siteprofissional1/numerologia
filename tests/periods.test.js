import { describe, expect, it } from 'vitest';
import { calcularAnoUniversal, calcularMesPessoal } from '../src/domain/personal-periods.js';
import { gerarMapa } from '../src/domain/numerology-map.js';
import { consultarOraculo } from '../src/domain/love-money-success.js';

const mapa = (anoConsulta, data = '05/05/1950') => gerarMapa({ nome: 'Teste', data, anoConsulta });

describe('TESTE H: Ano e Mês Pessoal (p. 58)', () => {
  it('1971: 1 + 9 + 7 + 1 = 18 → 9', () => {
    const u = calcularAnoUniversal(1971);
    expect(u.reducao.caminho).toEqual([1971, 18, 9]);
    expect(u.valor).toBe(9);
    expect(u.conta).toBe('1 + 9 + 7 + 1 = 18 → 9');
  });
  it('05/05 em 1971: 5 + 5 + 9 = 19 → 10 → 1', () => {
    const a = mapa(1971).anoPessoal;
    expect(a.soma).toBe(19);
    expect(a.reducao.caminho).toEqual([19, 10, 1]);
    expect(a.valor).toBe(1);
  });
  it('janeiro: 1 + 1 = 2; dezembro: 1 + 12 = 13 → 4', () => {
    const meses = mapa(1971).mesesPessoais;
    expect(meses[0].valor).toBe(2);
    expect(meses[11].reducao.caminho).toEqual([13, 4]);
    expect(meses[11].valor).toBe(4);
    expect(meses).toHaveLength(12);
  });
  it('outubro no Ano Pessoal 1: 1 + 10 = 11, leitura 11/2', () => {
    const outubro = mapa(1971).mesesPessoais[9];
    expect(outubro.exibicao).toBe('11/2');
    expect(outubro.valor).toBe(2);
  });
  it('reduzir o mês antes muda só o registro do mestre, nunca o dígito final', () => {
    for (let ap = 1; ap <= 9; ap += 1) {
      for (let mes = 1; mes <= 12; mes += 1) {
        const r = calcularMesPessoal({ valor: ap }, mes);
        const digitoAlternativo = ((ap + (((mes - 1) % 9) + 1) - 1) % 9) + 1;
        expect(r.valor).toBe(digitoAlternativo);
      }
    }
  });
  it('alterar o ano altera o resultado, sem depender do ano atual', () => {
    expect(mapa(1971).anoPessoal.valor).toBe(1);
    expect(mapa(1972).anoPessoal.valor).toBe(2);
    expect(mapa(1500).anoPessoal.ano).toBe(1500);
  });
  it('recusa ano e mês inválidos', () => {
    expect(() => calcularAnoUniversal(0)).toThrow(RangeError);
    expect(() => calcularMesPessoal({ valor: 1 }, 13)).toThrow(RangeError);
  });
  it('indica pináculo, ciclo e desafio vigentes', () => {
    const m = gerarMapa({ nome: 'Teste', data: '21/04/1942', anoConsulta: 1975 });
    expect(m.vigentes.idade).toBe(33);
    expect(m.vigentes.pinaculo.ordem).toBe(2);
    expect(m.vigentes.ciclo.ordem).toBe(2);
    expect(m.vigentes.desafio.ordem).toBe(2);
    expect(gerarMapa({ nome: 'Teste', data: '21/04/1942', anoConsulta: 1900 }).vigentes).toBeNull();
    const fim = gerarMapa({ nome: 'Teste', data: '21/04/1942', anoConsulta: 2010 }).vigentes;
    expect(fim.pinaculo.ordem).toBe(4);
    expect(fim.ciclo.ordem).toBe(3);
  });
});

describe('Amor, Dinheiro e Sucesso (p. 59)', () => {
  it('reduz a soma comum', () => {
    expect(consultarOraculo('amor', [7, 8, 9])).toMatchObject({ valor: 6, conta: '7 + 8 + 9 = 24 → 6' });
  });
  it('conserva 11 e 22 finais', () => {
    expect(consultarOraculo('sucesso', [1, 1, 9]).valor).toBe(11);
    expect(consultarOraculo('dinheiro', [5, 9, 8]).valor).toBe(22);
    expect(consultarOraculo('amor', [11, 9, 9]).valor).toBe(11);
  });
  it('aceita 11 e 22 como escolha e repetições', () => {
    expect(consultarOraculo('amor', [22, 22, 22]).reducao.caminho).toEqual([66, 12, 3]);
  });
  it('valida a entrada', () => {
    expect(() => consultarOraculo('sorte', [1, 2, 3])).toThrow(RangeError);
    expect(() => consultarOraculo('amor', [1, 2])).toThrow(RangeError);
    expect(() => consultarOraculo('amor', [1, 2, 10])).toThrow(RangeError);
    expect(() => consultarOraculo('constructor', [1, 2, 3])).toThrow(RangeError);
  });
});
