# Matriz de cobertura

## Capítulos

| Capítulo | Páginas | Domínio | Dados | Tela | Testes |
|---|---|---|---|---|---|
| Prefácio | 4–5 | Não se aplica | Não se aplica | Não se aplica | Não se aplica |
| 1. O sentido dos números | 6–15 | `compatibility.js` (afinidades) | `general-meanings.js` | Diálogo de número, Ano, Mês | `data.test.js` |
| 2. Palavras e números | 16–22 | `alphabet.js`, `normalize-name.js`, `name-numbers.js` | `intensification.js` | Nome, Frequência, Aptidões | `alphabet`, `names`, `fixtures` |
| 3. Padrões do destino | 23–30 | `birth-numbers.js` | `destiny-meanings.js` | Mapa completo, Nascimento | `dates`, `data` |
| 4. Vibrações do nascimento | 31–44 | `birth-numbers.js` | `birth-days.js`, `elements.js` | Nascimento | `dates`, `data` (Teste K), `ui.spec` |
| 5. Mapa numerológico | 45–51 | `name-numbers.js` | `expression-planes.js` | Mapa completo, Planos | `fixtures` (Teste D) |
| 6. O que reserva o futuro | 52–58 | `birth-grid.js`, `pinnacles.js`, `cycles.js`, `challenges.js`, `personal-periods.js` | `grid-notes.js`, `pinnacle-meanings.js` | Quadro, Pináculos, Ciclos, Ano, Mês | `grid`, `timeline`, `periods` |
| 7. Amor, dinheiro e sucesso | 59–67 | `love-money-success.js` | `oracle-readings.js` | Amor, Dinheiro e Sucesso | `periods`, `data`, `ui.spec` |
| 8. O amor sem lágrimas | 68–72 | `compatibility.js`, `name-numbers.js` | `relationships.js` | Compatibilidade | `compatibility`, `ui.spec` |

## Testes obrigatórios

| Teste | Conteúdo | Arquivo |
|---|---|---|
| A | Tabela de letras | `tests/alphabet.test.js` |
| B | Jean Harvey | `tests/fixtures.test.js` |
| C | David Weir | `tests/fixtures.test.js` |
| D | Anne Louise Jones | `tests/fixtures.test.js` |
| E | Destino | `tests/dates.test.js` |
| F | Quadro 3×3 | `tests/grid.test.js` |
| G | Pináculos, ciclos e desafios | `tests/timeline.test.js` |
| H | Ano Pessoal e Mês Pessoal | `tests/periods.test.js` |
| I | Compatibilidade | `tests/compatibility.test.js` |
| J | Segurança e validação | `names`, `dates`, `profiles`, `periods`, `ui.spec.js` |
| K | Correção do dia 18 | `tests/data.test.js`, `ui.spec.js` |

## Critérios de aceitação

| # | Critério | Estado | Evidência |
|---|---|---|---|
| 1 | Oito capítulos mapeados | Atendido | Tabela acima e inventário |
| 2 | Cálculos inequívocos implementados | Atendido | `src/domain` |
| 3 | Interpretações ligadas às páginas | Atendido | `registro()` em `provenance.js`, validado em `data.test.js` |
| 4 | Exemplos do livro reproduzidos | Atendido | Testes A–I |
| 5 | Testes automatizados passando | Atendido | `npm run test:tudo` |
| 6 | Correção do dia 18 | Atendido | Teste K, no resumo, na cópia privada e na tela |
| 7 | Cinco números principais | Atendido | `numerology-map.js` |
| 8 | Frequências para qualquer nome válido | Atendido | `calcularFrequencias` |
| 9 | Planos de expressão | Atendido | Teste D |
| 10 | Quadro para qualquer data válida | Atendido | Teste F |
| 11–13 | Pináculos, ciclos e desafios | Atendido | Teste G |
| 14–15 | Ano e Mês Pessoal | Atendido | Teste H |
| 16 | Amor, Dinheiro e Sucesso | Atendido | `periods.test.js`, `ui.spec.js` |
| 17 | Comparação de duas pessoas | Atendido | `compatibility.test.js`, `ui.spec.js` |
| 18 | Relatório imprimível | Atendido | `ui.spec.js` gera PDF no Chromium |
| 19 | Exportação | Removido a pedido do usuário | O mapa pode ser impresso ou salvo como PDF |
| 20 | Responsivo | Atendido em emulação | 360, 768 e 1366 px no Chromium; sem teste em aparelho físico |
| 21 | Dados locais | Atendido | Teste de requisições e CSP |
| 22 | Nenhuma fórmula externa | Atendido | Regras classificadas em `REGRAS_COM_FONTES.md` |
| 23 | Ambiguidades documentadas | Atendido | `INCONSISTENCIAS_DO_LIVRO.md` |
| 24 | Código organizado e testável | Atendido | Separação domínio, dados e interface |
| 25 | Instruções de execução | Atendido | `docs/README.md` |

## Limitações

- O aplicativo foi testado apenas no Chromium. Firefox, Safari e aparelhos físicos não foram testados.
- O texto exibido é comparado ao PDF por teste, palavra por palavra, e mantém os erros de digitalização do PDF. As quebras de parágrafo são reconstruídas pelo recuo e podem diferir do impresso.
- Ciclos e desafios não têm interpretação própria no livro.
