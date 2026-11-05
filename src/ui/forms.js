/**
 * Constrói os formulários e liga os campos a ctx.estado. As ações de main.js
 * confirmam as entradas e redesenham a tela quando necessário.
 * As rotinas executarOraculo e executarComparacao fazem a ponte com o domínio.
 */
import { SIGNIFICADOS_GERAIS } from '../data/general-meanings.js';
import { LEITURAS_ORACULO } from '../data/oracle-readings.js';
import { RELACIONAMENTOS } from '../data/relationships.js';
import { METODO_ORACULO } from '../data/position-definitions.js';
import { compararMapas } from '../domain/compatibility.js';
import { CATEGORIAS_ORACULO, OPCOES_ORACULO, consultarOraculo } from '../domain/love-money-success.js';
import { gerarMapa } from '../domain/numerology-map.js';
import { aviso, blocoTexto, cartao, definicoes, etapas, notificar, secao, tabela } from './components.js';
import { h } from './dom.js';

/**
 * Insere as barras enquanto se digita. Só age a partir de um dia de dois
 * algarismos, para não atrapalhar quem digita 1/2/1950 à mão.
 */
export function mascararData(valor) {
  const partes = /^(\d{2})\/?(\d{0,2})(\/?)(\d{0,4})$/.exec(valor);
  if (!partes) return valor;
  const [, dia, mes, barra, ano] = partes;
  let resultado = dia;
  if (mes || valor[2] === '/') resultado += `/${mes}`;
  if (ano || barra) resultado += `/${ano}`;
  return resultado;
}

// for/id associam rótulo e campo; aria-describedby associa o texto de ajuda.
// O mesmo componente atende o cadastro principal e as duas pessoas da comparação.
const campoTexto = ({ id, rotulo, ajuda, valor, autocomplete = 'off', autocapitalize = 'words', inputmode, placeholder, erro, onInput }) =>
  h('div', { class: 'campo' },
    h('label', { for: id }, rotulo),
    h('input', {
      id, type: 'text', value: valor, autocomplete, autocapitalize, inputmode, placeholder, spellcheck: 'false', autocorrect: 'off',
      'aria-invalid': erro ? 'true' : null,
      'aria-describedby': ajuda ? `${id}-ajuda` : null,
      onInput,
    }),
    ajuda && h('p', { class: 'ajuda', id: `${id}-ajuda` }, ajuda));

// A máscara facilita digitar; quem decide se uma data existe é interpretarData no domínio.
const campoData = (props) => campoTexto({
  placeholder: 'DD/MM/AAAA',
  inputmode: 'numeric',
  ...props,
  onInput: (e) => {
    const mascarado = mascararData(e.target.value);
    if (mascarado !== e.target.value) e.target.value = mascarado;
    props.onInput?.(e);
  },
});

// role=alert anuncia erros novos a tecnologias assistivas, além de mostrá-los na tela.
const listaErros = (erros) =>
  erros?.length > 0 && h('div', { class: 'erros', role: 'alert' }, h('ul', {}, erros.map((x) => h('li', {}, x))));

/** Tela inicial: a digitação atualiza o formulário; só o submit confirma um novo mapa. */
export function secaoInicio(ctx) {
  const { formulario, errosFormulario } = ctx.estado;
  // Não redesenha a cada letra: isso mantém o cursor estável enquanto a pessoa digita.
  const atualizar = (campo) => (e) => { formulario[campo] = e.target.value; };
  return h('section', { class: 'secao' },
    h('div', {},
      h('h1', {}, 'Mapa numerológico completo'),
      h('p', { class: 'secao-intro' }, 'Informe o nome recebido ao nascer e a data de nascimento.')),
    h('form', {
      class: 'formulario cartao',
      novalidate: true,
      'aria-label': 'Dados para o mapa',
      onSubmit: (e) => { e.preventDefault(); ctx.acoes.gerar(); },
    },
    listaErros(errosFormulario),
    campoTexto({
      id: 'nome', rotulo: 'Nome completo recebido ao nascer', valor: formulario.nome,
      ajuda: 'Use o nome original, mesmo que tenha mudado depois. Exemplo: Maria Aparecida da Silva',
      autocomplete: 'off', onInput: atualizar('nome'),
    }),
    campoData({
      id: 'data', rotulo: 'Data de nascimento', valor: formulario.data,
      ajuda: 'Exemplo: 15/03/1985', onInput: atualizar('data'),
    }),
    h('div', { class: 'acoes' },
      h('button', { type: 'submit', class: 'botao', id: 'gerar' }, 'Gerar mapa numerológico completo'),
      h('button', { type: 'button', class: 'botao secundario', id: 'limpar', onClick: () => ctx.acoes.limpar() }, 'Limpar campos'))),
  );
}

/** Consulta independente do mapa: três opções numéricas e uma categoria escolhida pelo usuário. */
export function secaoOraculo(ctx) {
  const o = ctx.estado.oraculo;
  const seletor = (i) => h('div', { class: 'campo' },
    h('label', { for: `oraculo-${i}` }, `${i + 1}º número`),
    h('select', {
      id: `oraculo-${i}`,
      onChange: (e) => { o.numeros[i] = Number(e.target.value) || null; },
    },
    h('option', { value: '', selected: o.numeros[i] === null }, 'Escolher'),
    OPCOES_ORACULO.map((n) => h('option', { value: n, selected: o.numeros[i] === n }, n))));

  return secao('Amor, Dinheiro e Sucesso',
    'Método do livro: concentre-se na palavra, relaxe e escolha livremente três números. Eles não vêm da sua data de nascimento, pois a escolha espontânea faz parte do método.',
    blocoTexto(METODO_ORACULO, ctx),
    h('form', {
      class: 'cartao formulario',
      novalidate: true,
      onSubmit: (e) => {
        e.preventDefault();
        ctx.acoes.consultarOraculo();
      },
    },
    h('fieldset', {},
      h('legend', {}, 'Palavra escolhida'),
      Object.entries(CATEGORIAS_ORACULO).map(([valor, rotulo]) =>
        h('label', { class: 'opcao' },
          h('input', {
            type: 'radio', name: 'oraculo-categoria', value: valor, checked: o.categoria === valor,
            onChange: () => { o.categoria = valor; },
          }), rotulo))),
    h('div', { class: 'grade grade-3' }, [0, 1, 2].map(seletor)),
    listaErros(o.erros),
    h('div', { class: 'acoes' },
      h('button', { type: 'submit', class: 'botao', id: 'consultar' }, 'Consultar'),
      o.resultado && h('button', { type: 'button', class: 'botao secundario', onClick: () => ctx.acoes.novaConsulta() }, 'Nova consulta'))),
    o.resultado && cartao(`${CATEGORIAS_ORACULO[o.resultado.categoria]}: número ${o.resultado.valor}`,
      etapas([`Números escolhidos: ${o.resultado.numeros.join(', ')}`, o.resultado.conta]),
      blocoTexto(LEITURAS_ORACULO[o.resultado.categoria][o.resultado.valor], ctx)),
  );
}

/** Valida a seleção e guarda o resultado que secaoOraculo apresentará na próxima renderização. */
export function executarOraculo(o) {
  if (o.numeros.some((n) => n === null)) {
    o.erros = ['Escolha os três números.'];
    o.resultado = null;
    return;
  }
  o.erros = [];
  o.resultado = consultarOraculo(o.categoria, o.numeros);
}

// As afinidades são direcionais; a frase indica se a inclusão ocorre em um ou nos dois sentidos.
const afinidadeTexto = (p) => {
  if (!p.afinidade) return 'Não aplicável';
  const { aListaB, bListaA } = p.afinidade;
  if (aListaB && bListaA) return 'Listam-se mutuamente';
  if (aListaB) return `O ${p.valorA} lista o ${p.valorB}`;
  if (bListaA) return `O ${p.valorB} lista o ${p.valorA}`;
  return 'Sem afinidade listada';
};

/** Recebe uma comparação já calculada e monta tabelas e interpretações sem refazer as contas. */
function resultadoCompat(c, ctx, nomeA, nomeB) {
  const classificadas = c.posicoes.filter((p) => p.classificacao);
  const registroClasse = (cl) => RELACIONAMENTOS[cl];
  return [
    cartao('Comparação dos números',
      tabela(['Posição', nomeA, nomeB, 'Relação entre os números', 'Afinidades'],
        c.posicoes.map((p) => [
          p.rotulo, p.a, p.b,
          p.classificacao ? `${p.classificacao.rotulo}${p.classificacao.iguais ? ' (números iguais)' : ''}` : 'Sem código no livro',
          afinidadeTexto(p),
        ])),
      definicoes([
        ['Elemento harmônico', `${c.elemento.a} e ${c.elemento.b}${c.elemento.mesmo ? ': o mesmo elemento' : ': elementos diferentes'}`],
      ])),
    classificadas.flatMap((p) => {
      const cl = p.classificacao;
      if (cl.classe === null) {
        return cartao(`${p.rotulo}: ${cl.rotulo}`,
          aviso('Classificação não imposta:', 'as regras permitem mais de uma leitura.'),
          cl.leituras.length > 0 && h('ul', {}, cl.leituras.map((l) => h('li', {}, `${l.descricao}: ${l.rotulo}`))));
      }
      return cartao(`${p.rotulo}: ${cl.rotulo}`, blocoTexto(registroClasse(cl.classe), ctx));
    }),
    cartao(`Soma das Expressões: ${c.expressoes.exibicao}`,
      etapas([c.expressoes.conta]),
      blocoTexto(RELACIONAMENTOS.somaExpressao, ctx),
      blocoTexto(SIGNIFICADOS_GERAIS[c.expressoes.valor], ctx, { titulo: `Número ${c.expressoes.valor}` })),
    cartao(`Soma dos Destinos: ${c.destinos.exibicao}`,
      etapas([c.destinos.conta]),
      blocoTexto(RELACIONAMENTOS.somaDestino, ctx),
      blocoTexto(SIGNIFICADOS_GERAIS[c.destinos.valor], ctx, { titulo: `Número ${c.destinos.valor}` })),
    cartao('Pináculos e ciclos',
      tabela(['Período', nomeA, nomeB], [
        ...c.pinaculos.map((p) => [`${p.ordem}º pináculo`, `${p.a.valor} (${p.a.faixa})`, `${p.b.valor} (${p.b.faixa})`]),
        ...c.ciclos.map((p) => [`${p.ordem}º ciclo`, `${p.a.valor} (${p.a.faixa})`, `${p.b.valor} (${p.b.faixa})`]),
      ]),
      blocoTexto(RELACIONAMENTOS.analiseCompleta, ctx)),
    cartao('Pares e ímpares',
      tabela(['Pessoa', 'Pares', 'Ímpares'], [
        [nomeA, c.paridade.a.pares, c.paridade.a.impares],
        [nomeB, c.paridade.b.pares, c.paridade.b.impares],
      ]),
      blocoTexto(RELACIONAMENTOS.paridade, ctx)),
    cartao('Sobre o relacionamento', blocoTexto(RELACIONAMENTOS.casamento, ctx)),
    h('p', { class: 'ajuda' }, 'Análise simbólica. O livro não define percentuais de compatibilidade, e este aplicativo não os calcula.'),
  ];
}

/** Mantém os campos das pessoas A e B separados, inclusive quando uma validação falha. */
export function secaoCompatibilidade(ctx) {
  const c = ctx.estado.compat;
  const pessoa = (chave, titulo) => h('fieldset', { class: 'formulario' },
    h('legend', {}, titulo),
    campoTexto({
      id: `compat-nome-${chave}`, rotulo: 'Nome completo de nascimento', valor: c[chave].nome,
      onInput: (e) => { c[chave].nome = e.target.value; },
    }),
    campoData({
      id: `compat-data-${chave}`, rotulo: 'Data de nascimento', valor: c[chave].data,
      onInput: (e) => { c[chave].data = e.target.value; },
    }));
  return secao('Compatibilidade entre pessoas',
    'Comparação pelos procedimentos do livro. Compare também pináculos e ciclos, como recomenda a autora.',
    h('form', {
      class: 'cartao formulario',
      novalidate: true,
      onSubmit: (e) => { e.preventDefault(); ctx.acoes.comparar(); },
    },
    h('div', { class: 'grade grade-2' }, pessoa('a', 'Pessoa A'), pessoa('b', 'Pessoa B')),
    listaErros(c.erros),
    h('div', { class: 'acoes' },
      h('button', { type: 'submit', class: 'botao', id: 'comparar' }, 'Comparar'),
      ctx.estado.mapa && h('button', { type: 'button', class: 'botao secundario', onClick: () => ctx.acoes.usarMapaComoA() }, 'Usar o mapa atual como Pessoa A'))),
    c.resultado && resultadoCompat(c.resultado.comparacao, ctx, c.resultado.nomeA, c.resultado.nomeB),
  );
}

/** Gera os dois mapas no mesmo ano e só compara quando ambos são válidos. */
export function executarComparacao(c, anoConsulta) {
  const a = gerarMapa({ nome: c.a.nome, data: c.a.data, anoConsulta });
  const b = gerarMapa({ nome: c.b.nome, data: c.b.data, anoConsulta });
  // Prefixar a pessoa ajuda a localizar o campo errado sem apagar os demais dados.
  const erros = [
    ...(a.ok ? [] : a.erros.map((e) => `Pessoa A: ${e}`)),
    ...(b.ok ? [] : b.erros.map((e) => `Pessoa B: ${e}`)),
  ];
  c.erros = erros;
  c.resultado = erros.length > 0
    ? null
    : { comparacao: compararMapas(a, b), nomeA: a.pessoa.nome, nomeB: b.pessoa.nome };
}

/** Exibe os comandos do repositório local; salvar só é oferecido após ativação explícita. */
export function secaoPerfis(ctx) {
  const repo = ctx.estado.repositorio;
  const ativo = repo.ativo();
  const perfis = repo.listar();
  const { entrada, mapa } = ctx.estado;
  return secao('Perfis salvos',
    'Opcional. Os dados ficam só no armazenamento deste navegador e nunca são enviados. Nada é gravado até você ativar.',
    !ativo
      ? cartao('Armazenamento desativado',
        h('p', {}, 'Ao ativar, nomes e datas salvos ficam neste navegador. Quem usa este computador pode acessá-los.'),
        h('button', {
          type: 'button', class: 'botao', id: 'ativar-armazenamento',
          onClick: () => { repo.ativar(); ctx.acoes.atualizar(); notificar('Armazenamento local ativado.'); },
        }, 'Ativar armazenamento local'))
      : [
          cartao('Perfil atual',
            mapa
              ? [
                  h('p', {}, `${entrada.nome}, ${entrada.data}`),
                  h('button', {
                    type: 'button', class: 'botao', id: 'salvar-perfil',
                    onClick: () => ctx.acoes.salvarPerfil(),
                  }, ctx.estado.perfilId ? 'Salvar alterações' : 'Salvar perfil'),
                ]
              : h('p', {}, 'Gere um mapa válido para salvar um perfil.')),
          cartao(`Perfis (${perfis.length})`,
            perfis.length === 0 && h('p', {}, 'Nenhum perfil salvo.'),
            h('ul', { class: 'lista-limpa' },
              perfis.map((p) => h('li', { 'data-testid': 'perfil' },
                h('p', {}, h('strong', {}, p.nome), ` · ${p.data}`),
                h('div', { class: 'acoes' },
                  h('button', { type: 'button', class: 'botao secundario pequeno', onClick: () => ctx.acoes.abrirPerfil(p.id) }, 'Abrir e recalcular'),
                  h('button', { type: 'button', class: 'botao secundario pequeno', onClick: () => ctx.acoes.editarPerfil(p.id) }, 'Editar'),
                  h('button', {
                    type: 'button', class: 'botao perigo pequeno',
                    onClick: () => { if (window.confirm(`Excluir o perfil de ${p.nome}?`)) ctx.acoes.excluirPerfil(p.id); },
                  }, 'Excluir')))))),
          h('button', {
            type: 'button', class: 'botao perigo', id: 'excluir-tudo',
            onClick: () => {
              if (window.confirm('Excluir todos os dados locais deste aplicativo? Isso não pode ser desfeito.')) ctx.acoes.excluirTudo();
            },
          }, 'Excluir todos os dados locais'),
        ],
  );
}
