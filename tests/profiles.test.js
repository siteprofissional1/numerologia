import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { criarRepositorioDePerfis } from '../src/storage/profiles.js';

function storageFalso() {
  const dados = new Map();
  return {
    dados,
    get length() { return dados.size; },
    key: (i) => [...dados.keys()][i] ?? null,
    getItem: (k) => (dados.has(k) ? dados.get(k) : null),
    setItem: (k, v) => dados.set(k, String(v)),
    removeItem: (k) => dados.delete(k),
  };
}

describe('TESTE J: armazenamento de perfis', () => {
  let storage;
  let repo;
  let contador;
  beforeEach(() => {
    storage = storageFalso();
    contador = 0;
    repo = criarRepositorioDePerfis(storage, () => `id-${(contador += 1)}`);
  });

  it('começa desativado e não grava nada silenciosamente', () => {
    expect(repo.ativo()).toBe(false);
    expect(() => repo.salvar({ nome: 'Ana', data: '01/01/2000' })).toThrow(/Ative/);
    expect(storage.dados.size).toBe(0);
  });
  it('salva, lista e abre depois de ativado', () => {
    repo.ativar();
    const p = repo.salvar({ nome: 'Ana', data: '01/01/2000' });
    expect(repo.listar()).toHaveLength(1);
    expect(repo.obter(p.id)).toMatchObject({ nome: 'Ana', data: '01/01/2000' });
  });
  it('edita um perfil existente sem duplicar', () => {
    repo.ativar();
    const p = repo.salvar({ nome: 'Ana', data: '01/01/2000' });
    repo.salvar({ ...p, nome: 'Ana Maria' });
    expect(repo.listar()).toHaveLength(1);
    expect(repo.obter(p.id).nome).toBe('Ana Maria');
  });
  it('exclui um perfil', () => {
    repo.ativar();
    const a = repo.salvar({ nome: 'A', data: '01/01/2000' });
    repo.salvar({ nome: 'B', data: '02/01/2000' });
    repo.excluir(a.id);
    expect(repo.listar().map((p) => p.nome)).toEqual(['B']);
  });
  it('excluir tudo remove apenas as chaves do aplicativo e desativa', () => {
    storage.setItem('outra-chave', 'preservar');
    repo.ativar();
    repo.salvar({ nome: 'A', data: '01/01/2000' });
    repo.excluirTudo();
    expect(repo.ativo()).toBe(false);
    expect(repo.listar()).toEqual([]);
    expect([...storage.dados.keys()]).toEqual(['outra-chave']);
  });
  describe('sem crypto.randomUUID, como em http:// pelo Wi-Fi', () => {
    afterEach(() => vi.unstubAllGlobals());
    it('ainda salva perfis com identificadores diferentes', () => {
      vi.stubGlobal('crypto', {});
      const semApi = criarRepositorioDePerfis(storage);
      semApi.ativar();
      const a = semApi.salvar({ nome: 'A', data: '01/01/2000' });
      const b = semApi.salvar({ nome: 'B', data: '02/01/2000' });
      expect(a.id).toBeTruthy();
      expect(a.id).not.toBe(b.id);
      expect(semApi.listar()).toHaveLength(2);
    });
  });
  it('tolera dados corrompidos', () => {
    storage.setItem('numerologia-codex.perfis', '{nao-json');
    expect(repo.listar()).toEqual([]);
    storage.setItem('numerologia-codex.perfis', '{"a":1}');
    expect(repo.listar()).toEqual([]);
  });
});
