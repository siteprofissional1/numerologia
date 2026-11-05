import './styles/tokens.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/print.css';

import { gerarMapa } from './domain/numerology-map.js';
import { criarRepositorioDePerfis } from './storage/profiles.js';
import { notificar, secao } from './ui/components.js';
import { h, limpar } from './ui/dom.js';
import { secaoInconsistencias, secaoRegras } from './ui/explanations.js';
import {
  executarComparacao, executarOraculo, secaoCompatibilidade, secaoInicio, secaoOraculo, secaoPerfis,
} from './ui/forms.js';
import { secaoRelatorio } from './ui/print-export.js';
import { carregarTextosPrivados } from './ui/private-texts.js';
import {
  secaoAno, secaoAptidoes, secaoCiclos, secaoFrequencias, secaoMes, secaoNascimento, secaoNome,
  secaoPinaculos, secaoPlanos, secaoQuadro,
} from './ui/render.js';

const SECOES = [
  ['Início', [
    { id: 'inicio', rotulo: 'Novo mapa', render: secaoInicio },
    { id: 'mapa', rotulo: 'Mapa completo', render: secaoRelatorio, exigeMapa: true },
  ]],
  ['Nome', [
    { id: 'nome', rotulo: 'Análise do nome', render: secaoNome, exigeMapa: true },
    { id: 'frequencias', rotulo: 'Frequência dos números', render: secaoFrequencias, exigeMapa: true },
    { id: 'aptidoes', rotulo: 'Aptidões e ausências', render: secaoAptidoes, exigeMapa: true },
    { id: 'planos', rotulo: 'Planos de expressão', render: secaoPlanos, exigeMapa: true },
  ]],
  ['Nascimento', [
    { id: 'nascimento', rotulo: 'Interpretação do nascimento', render: secaoNascimento, exigeMapa: true },
    { id: 'quadro', rotulo: 'Quadro 3×3', render: secaoQuadro, exigeMapa: true },
  ]],
  ['Futuro', [
    { id: 'pinaculos', rotulo: 'Pináculos', render: secaoPinaculos, exigeMapa: true },
    { id: 'ciclos', rotulo: 'Ciclos e desafios', render: secaoCiclos, exigeMapa: true },
    { id: 'ano', rotulo: 'Ano Pessoal', render: secaoAno, exigeMapa: true },
    { id: 'mes', rotulo: 'Mês Pessoal', render: secaoMes, exigeMapa: true },
  ]],
  ['Consultas', [
    { id: 'oraculo', rotulo: 'Amor, Dinheiro e Sucesso', render: secaoOraculo },
    { id: 'compatibilidade', rotulo: 'Compatibilidade', render: secaoCompatibilidade },
  ]],
  ['Referência', [
    { id: 'regras', rotulo: 'Explicação das regras', render: secaoRegras },
    { id: 'inconsistencias', rotulo: 'Inconsistências do livro', render: secaoInconsistencias },
    { id: 'perfis', rotulo: 'Perfis salvos', render: secaoPerfis },
  ]],
];

const TODAS = SECOES.flatMap(([, itens]) => itens);

function storageSeguro() {
  try {
    return window.localStorage;
  } catch {
    const dados = new Map();
    return {
      get length() { return dados.size; },
      key: (i) => [...dados.keys()][i] ?? null,
      getItem: (k) => dados.get(k) ?? null,
      setItem: (k, v) => dados.set(k, String(v)),
      removeItem: (k) => dados.delete(k),
    };
  }
}

const storage = storageSeguro();
const CHAVE_TEMA = 'numerologia-codex.tema';

const novoOraculo = () => ({ categoria: 'amor', numeros: [null, null, null], erros: [], resultado: null });
const formularioVazio = () => ({ nome: '', data: '' });

const estado = {
  formulario: formularioVazio(),
  errosFormulario: [],
  /** Dados confirmados do mapa atual; editar o formulário não altera o mapa até gerar de novo. */
  entrada: null,
  mapa: null,
  anoConsulta: new Date().getFullYear(),
  mes: new Date().getMonth() + 1,
  textos: null,
  oraculo: novoOraculo(),
  compat: { a: { nome: '', data: '' }, b: { nome: '', data: '' }, erros: [], resultado: null },
  repositorio: criarRepositorioDePerfis(storage),
  perfilId: null,
};

function recalcular() {
  const { nome, data } = estado.entrada;
  const mapa = gerarMapa({ nome, data, anoConsulta: estado.anoConsulta });
  if (!mapa.ok) {
    estado.errosFormulario = mapa.erros;
    return false;
  }
  estado.errosFormulario = [];
  estado.mapa = mapa;
  return true;
}

const ir = (id) => {
  if (window.location.hash === `#/${id}`) renderizar();
  else window.location.hash = `#/${id}`;
};

const acoes = {
  ir,
  atualizar: () => renderizar(false),
  gerar() {
    estado.entrada = { ...estado.formulario };
    if (recalcular()) {
      ir('mapa');
    } else {
      estado.entrada = null;
      estado.mapa = null;
      renderizar();
      document.querySelector('.erros')?.scrollIntoView({ block: 'nearest' });
    }
  },
  limpar() {
    estado.formulario = formularioVazio();
    estado.errosFormulario = [];
    estado.entrada = null;
    estado.mapa = null;
    estado.perfilId = null;
    renderizar();
    document.getElementById('nome')?.focus();
  },
  definirAno(ano) {
    if (!Number.isInteger(ano) || ano < 1 || ano > 9999) {
      notificar('Informe um ano entre 1 e 9999.');
      renderizar(false);
      return;
    }
    estado.anoConsulta = ano;
    if (estado.entrada) recalcular();
    renderizar(false);
  },
  definirMes(mes) {
    estado.mes = mes;
    renderizar(false);
  },
  consultarOraculo() {
    executarOraculo(estado.oraculo);
    renderizar(false);
  },
  novaConsulta() {
    estado.oraculo = novoOraculo();
    renderizar(false);
  },
  comparar() {
    executarComparacao(estado.compat, estado.anoConsulta);
    renderizar(false);
  },
  usarMapaComoA() {
    estado.compat.a = { nome: estado.entrada.nome, data: estado.entrada.data };
    renderizar(false);
  },
  salvarPerfil() {
    const perfil = estado.repositorio.salvar({ id: estado.perfilId ?? undefined, ...estado.entrada });
    estado.perfilId = perfil.id;
    notificar('Perfil salvo neste navegador.');
    renderizar(false);
  },
  abrirPerfil(id) {
    acoes.editarPerfil(id);
    acoes.gerar();
  },
  editarPerfil(id) {
    const p = estado.repositorio.obter(id);
    if (!p) return;
    estado.perfilId = p.id;
    estado.formulario = { nome: p.nome, data: p.data };
    ir('inicio');
  },
  excluirPerfil(id) {
    estado.repositorio.excluir(id);
    if (estado.perfilId === id) estado.perfilId = null;
    renderizar(false);
  },
  excluirTudo() {
    estado.repositorio.excluirTudo();
    estado.perfilId = null;
    aplicarTema(null);
    notificar('Todos os dados locais foram excluídos.');
    renderizar(false);
  },
};

const ctx = { estado, acoes };

function secaoAtual() {
  const id = window.location.hash.replace(/^#\/?/, '');
  return TODAS.find((s) => s.id === id) ?? TODAS[0];
}

function renderizarNavegacao(atual) {
  const nav = document.getElementById('navegacao');
  limpar(nav);
  for (const [grupo, itens] of SECOES) {
    nav.append(h('div', {},
      h('p', { class: 'lateral-titulo' }, grupo),
      h('ul', { class: 'lateral-grupo' },
        itens.map((s) => h('li', {},
          h('a', {
            href: `#/${s.id}`,
            'aria-current': s.id === atual.id ? 'page' : null,
            onClick: () => {
              nav.classList.remove('aberta');
              document.getElementById('botao-menu').setAttribute('aria-expanded', 'false');
            },
          }, s.rotulo))))));
  }
}

const FOCAVEIS = 'a[href], button, input, select, summary';

function renderizar(mover = true) {
  const atual = secaoAtual();
  const conteudo = document.getElementById('conteudo');
  const rolagem = window.scrollY;
  const indiceFoco = [...conteudo.querySelectorAll(FOCAVEIS)].indexOf(document.activeElement);
  renderizarNavegacao(atual);
  limpar(conteudo);
  if (atual.exigeMapa && !estado.mapa) {
    conteudo.append(secao(atual.rotulo, 'Esta seção mostra os resultados de um mapa. Gere um mapa para continuar.',
      h('a', { class: 'botao', href: '#/inicio' }, 'Ir para o formulário')));
  } else {
    conteudo.append(atual.render(ctx));
  }
  document.title = `${atual.rotulo} · Mapa Numerológico`;
  if (mover) {
    window.scrollTo(0, 0);
    conteudo.querySelector('h1, h2')?.setAttribute('tabindex', '-1');
    conteudo.querySelector('h1, h2')?.focus({ preventScroll: true });
  } else {
    // A tela é recriada: devolve o foco ao controle equivalente, para quem usa teclado.
    if (indiceFoco >= 0) conteudo.querySelectorAll(FOCAVEIS)[indiceFoco]?.focus({ preventScroll: true });
    window.scrollTo(0, rolagem);
  }
}

function aplicarTema(tema) {
  const escuro = tema === 'dark';
  document.documentElement.dataset.theme = escuro ? 'dark' : 'light';
  document.getElementById('tema-claro').setAttribute('aria-pressed', String(!escuro));
  document.getElementById('tema-escuro').setAttribute('aria-pressed', String(escuro));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', escuro ? '#000000' : '#ffffff');
}

function escolherTema(tema) {
  aplicarTema(tema);
  try {
    storage.setItem(CHAVE_TEMA, tema);
  } catch { /* a preferência é opcional */ }
}

function iniciar() {
  try {
    aplicarTema(storage.getItem(CHAVE_TEMA));
  } catch {
    aplicarTema('light');
  }
  document.getElementById('tema-claro').addEventListener('click', () => escolherTema('light'));
  document.getElementById('tema-escuro').addEventListener('click', () => escolherTema('dark'));

  document.getElementById('botao-menu').addEventListener('click', (e) => {
    const aberta = document.getElementById('navegacao').classList.toggle('aberta');
    e.currentTarget.setAttribute('aria-expanded', String(aberta));
  });

  estado.textos = carregarTextosPrivados();
  window.addEventListener('hashchange', () => renderizar());
  renderizar(false);
}

iniciar();
