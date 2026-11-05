# Como estudar o código

Comece pelos arquivos de `src/`. O `index.html` da raiz e a pasta `dist/` são gerados pelo build; seu JavaScript é compactado e não é o melhor ponto de partida para aprender. Os comentários explicativos estão nos arquivos de origem.

## Caminho principal

1. [src/index.html](../src/index.html) define os contêineres da página e carrega o módulo de entrada.
2. [src/main.js](../src/main.js) mantém o estado, registra ações e escolhe a tela pelo fragmento da URL, como `#/mapa`.
3. Ao enviar o formulário, `acoes.gerar()` copia os dados para `estado.entrada` e chama `recalcular()`.
4. [src/domain/numerology-map.js](../src/domain/numerology-map.js) valida as entradas e reúne os cálculos em um objeto `mapa`.
5. [src/ui/print-export.js](../src/ui/print-export.js) usa esse objeto para construir o relatório completo.

Em uma troca de tela, `main.js` fornece `ctx`, um objeto com `estado` e `acoes`. A tela lê os resultados em `ctx.estado` e chama os comandos de `ctx.acoes` quando o usuário interage.

## Onde encontrar cada assunto

| Assunto | Arquivos |
| --- | --- |
| Redução e números mestres | `src/domain/reduce.js` |
| Letras, acentos, vogais e consoantes | `src/domain/alphabet.js`, `normalize-name.js` e `name-numbers.js` |
| Datas e posições de nascimento | `src/domain/birth-numbers.js` |
| Quadro 3×3 | `src/domain/birth-grid.js` |
| Pináculos, ciclos e desafios | `src/domain/pinnacles.js`, `cycles.js` e `challenges.js` |
| Ano e Mês Pessoal | `src/domain/personal-periods.js` |
| Relacionamentos e consultas | `src/domain/compatibility.js` e `love-money-success.js` |
| Construção segura de elementos HTML | `src/ui/dom.js` |
| Formulários e apresentação dos resultados | `src/ui/forms.js` e `render.js` |
| Cartões, interpretações e tabelas | `src/ui/components.js` |
| Gráficos e linha do tempo | `src/ui/chart.js` e `timeline.js` |
| Perfis no navegador | `src/storage/profiles.js` |
| Aparência e impressão | `src/styles/` |
| Configuração e publicação | `vite.config.js`, `playwright.config.js` e `.github/workflows/pages.yml` |

## Cálculo e apresentação

As funções de `src/domain/` recebem dados e devolvem resultados sem acessar o HTML. Por isso, é possível estudar e testar uma fórmula separadamente da página. Além do valor final, várias funções devolvem subtotais e `passos`, que explicam a conta na interface.

`reduzirSimples(29)` percorre `29 → 11 → 2`, guardando o 11 como intermediário. `reduzirComMestres(29)` para no 11 e mantém também sua leitura reduzida, 2. Cada operação escolhe explicitamente qual redução usar.

Os catálogos em `src/data/` organizam as leituras por `chave`. Por exemplo, `dia.18` identifica uma interpretação. `blocoTexto()` usa essa chave para buscar a passagem literal no JSON carregado, enquanto os cálculos permanecem no domínio.

Os arquivos JSON não aceitam comentários na sintaxe padrão. A transcrição é um arquivo gerado: seu formato e suas verificações são explicados em `scripts/importar-textos-privados.mjs` e `scripts/verificar-textos.mjs`.

## Como ler os testes

Os arquivos `tests/*.test.js` verificam funções com Vitest. `describe` agrupa casos, `it` define um caso e `expect` confere o resultado. Os exemplos em `fixtures.test.js` ajudam a acompanhar um mapa com valores conhecidos.

`tests/ui.spec.js` usa Playwright para preencher campos e conferir o aplicativo no Chromium. Como essas ações são assíncronas, `await` aguarda sua conclusão.

Os comentários foram adicionados para explicar responsabilidades, regras e decisões. Para experimentar mudanças no funcionamento, altere os arquivos de origem e execute os testes antes de gerar novamente o HTML.
