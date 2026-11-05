import { describe, expect, it } from 'vitest';
import {
  calcularComponentes,
  calcularDestino,
  calcularDiaNascimento,
  ehBissexto,
  elementoDoDia,
  elementoDoNumero,
  ELEMENTOS,
  interpretarData,
} from '../src/domain/birth-numbers.js';
import { REGRAS_PADRAO } from '../src/config/rules.js';
import { reduzirComMestres } from '../src/domain/reduce.js';
import { mascararData } from '../src/ui/forms.js';

const destino = (texto, regras = REGRAS_PADRAO) => {
  const data = interpretarData(texto);
  return calcularDestino(calcularComponentes(data, regras));
};

describe('TESTE E: Destino (p. 23)', () => {
  it('06/10/1947: 6 + 1 + 3 = 10 → 1', () => {
    const d = destino('06/10/1947');
    expect(d.parcelas).toEqual([6, 1, 3]);
    expect(d.reducao.caminho).toEqual([10, 1]);
    expect(d.valor).toBe(1);
  });
  it('04/03/1930: 4 + 3 + 4 = 11, com leitura 11/2', () => {
    const d = destino('04/03/1930');
    expect(d.parcelas).toEqual([4, 3, 4]);
    expect(d.valor).toBe(11);
    expect(d.reduzido).toBe(2);
    expect(d.exibicao).toBe('11/2');
  });
  it('21/04/1942 tem Destino 5 (p. 55)', () => expect(destino('21/04/1942').valor).toBe(5));
  it('avisa quando conservar mestres nos componentes muda o resultado', () => {
    const padrao = destino('11/09/2000');
    expect(padrao.valor).toBe(4);
    expect(padrao.alternativa).toMatchObject({ valor: 22 });
    const preservando = destino('11/09/2000', { ...REGRAS_PADRAO, componentesMestres: 'preservar' });
    expect(preservando.valor).toBe(22);
    expect(preservando.alternativa).toMatchObject({ valor: 4 });
  });
  it('sem mestre nos componentes não há alternativa', () => {
    expect(destino('06/10/1947').alternativa).toBeNull();
  });
});

describe('TESTE J: validação de datas', () => {
  it.each([
    ['31/04/2000', 'não existe'],
    ['29/02/1900', 'bissexto'],
    ['29/02/2023', 'bissexto'],
    ['00/01/2000', 'não existe'],
    ['32/01/2000', 'não existe'],
    ['10/13/2000', 'mês'],
    ['10/00/2000', 'mês'],
    ['10/01/0000', 'ano'],
    ['', 'Informe'],
    ['2000-01-10', 'formato'],
    ['10/01/20', 'formato'],
    ['aa/bb/cccc', 'formato'],
  ])('%s é recusada', (texto, trecho) => {
    const r = interpretarData(texto);
    expect(r.ok).toBe(false);
    expect(r.erros[0]).toContain(trecho);
  });

  it.each(['29/02/2000', '29/02/2024', '29/02/1600', '31/12/1899', '01/01/0100', ' 15/03/1985 ', '1/2/1950'])(
    '%s é aceita',
    (t) => expect(interpretarData(t).ok).toBe(true),
  );

  it('regra do bissexto', () => {
    expect([2000, 2024, 1600].every(ehBissexto)).toBe(true);
    expect([1900, 2023, 2100].some(ehBissexto)).toBe(false);
  });

  it('não sofre efeito de fuso em datas antigas', () => {
    expect(interpretarData('01/01/1890')).toEqual({ ok: true, dia: 1, mes: 1, ano: 1890 });
  });
});

describe('Elementos harmônicos (p. 31–32)', () => {
  it('as três listas somam 31 dias, sem repetição', () => {
    const dias = Object.values(ELEMENTOS).flatMap((e) => e.dias);
    expect(new Set(dias).size).toBe(31);
    expect(dias).toHaveLength(31);
  });
  it('a lista de dias é coerente com a redução de cada dia', () => {
    for (let dia = 1; dia <= 31; dia += 1) {
      expect(elementoDoDia(dia)).toBe(elementoDoNumero(reduzirComMestres(dia).valor));
    }
  });
  it('identifica o elemento do dia, com o 8 no Fogo (p. 31)', () => {
    expect(calcularDiaNascimento({ dia: 19, mes: 1, ano: 2000 }).chaveElemento).toBe('agua');
    expect(calcularDiaNascimento({ dia: 8, mes: 1, ano: 2000 }).chaveElemento).toBe('fogo');
    expect(calcularDiaNascimento({ dia: 30, mes: 1, ano: 2000 }).chaveElemento).toBe('ar');
  });
});

describe('Máscara de data', () => {
  it('digitação sequencial chega a DD/MM/AAAA', () => {
    let v = '';
    for (const c of '15031985') v = mascararData(v + c);
    expect(v).toBe('15/03/1985');
  });
  it.each([
    ['15031985', '15/03/1985'],
    ['10', '10'],
    ['10/', '10/'],
    ['10/09', '10/09'],
    ['10/09/', '10/09/'],
    ['10/2/1950', '10/2/1950'],
    ['1/2/1950', '1/2/1950'],
    ['abc', 'abc'],
  ])('%s → %s', (entrada, saida) => expect(mascararData(entrada)).toBe(saida));
  it('apagar não recoloca a barra', () => {
    expect(mascararData('10')).toBe('10');
    expect(mascararData('10/0')).toBe('10/0');
  });
});
