/**
 * Perfis no navegador. Nada é gravado até o usuário ativar o armazenamento, e
 * nada sai do computador. O storage é injetável para permitir testes sem DOM.
 */
const PREFIXO = 'numerologia-codex.';
const CHAVE_ATIVO = `${PREFIXO}armazenamento-ativo`;
const CHAVE_PERFIS = `${PREFIXO}perfis`;

function ler(storage, chave) {
  try {
    return storage.getItem(chave);
  } catch {
    return null;
  }
}

/** crypto.randomUUID não existe em http:// fora de localhost, como no acesso pelo Wi-Fi. */
const idPadrao = () =>
  globalThis.crypto?.randomUUID?.() ?? `perfil-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function criarRepositorioDePerfis(storage, gerarId = idPadrao) {
  const carregar = () => {
    try {
      const lista = JSON.parse(ler(storage, CHAVE_PERFIS) ?? '[]');
      return Array.isArray(lista) ? lista : [];
    } catch {
      return [];
    }
  };
  const persistir = (lista) => storage.setItem(CHAVE_PERFIS, JSON.stringify(lista));
  const ativo = () => ler(storage, CHAVE_ATIVO) === '1';
  const exigirAtivo = () => {
    if (!ativo()) throw new Error('Ative o armazenamento local antes de salvar perfis.');
  };

  return {
    ativo,
    ativar() {
      storage.setItem(CHAVE_ATIVO, '1');
    },
    listar: carregar,
    obter: (id) => carregar().find((p) => p.id === id) ?? null,
    salvar({ id, nome, data }) {
      exigirAtivo();
      const lista = carregar();
      const perfil = { id: id ?? gerarId(), nome, data };
      const indice = lista.findIndex((p) => p.id === perfil.id);
      if (indice >= 0) lista[indice] = perfil;
      else lista.push(perfil);
      persistir(lista);
      return perfil;
    },
    excluir(id) {
      persistir(carregar().filter((p) => p.id !== id));
    },
    /** Apaga todos os dados locais do aplicativo e desativa o armazenamento. */
    excluirTudo() {
      const chaves = [];
      for (let i = 0; i < storage.length; i += 1) {
        const chave = storage.key(i);
        if (chave?.startsWith(PREFIXO)) chaves.push(chave);
      }
      chaves.forEach((chave) => storage.removeItem(chave));
    },
  };
}
