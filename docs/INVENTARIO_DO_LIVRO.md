# Inventário do livro

**Obra:** *Numerologia: O poder secreto dos números*, Editora Hemus. PDF de 74 páginas.

As 74 páginas foram lidas por extração de texto (`pdftotext -layout`). A numeração impressa coincide com a do PDF. As páginas 17, 18, 46, 48, 56 e 68 também foram conferidas como imagem, porque têm diagramas ou tabelas que a extração desalinha. O PDF não contém imagens incorporadas: os diagramas são texto posicionado.

## Estrutura

| Páginas | Conteúdo | Tipo | Uso no aplicativo |
|---|---|---|---|
| 1–3 | Capa, folha de rosto, conteúdo | Pré-textual | Não usado |
| 4–5 | Prefácio | Contexto | Justifica 1–9 e os números 11 e 22 |
| 6–15 | Cap. 1, O sentido dos números | 11 interpretações | `data/general-meanings.js` |
| 16–22 | Cap. 2, Palavras e números | Tabela, fórmulas, exemplos, intensificação | `domain/alphabet.js`, `domain/name-numbers.js`, `data/intensification.js` |
| 23–30 | Cap. 3, Os padrões de seu destino | Fórmula, exemplos, 11 interpretações | `domain/birth-numbers.js`, `data/destiny-meanings.js` |
| 31–44 | Cap. 4, As vibrações do seu nascimento | 3 elementos, 31 dias | `domain/birth-numbers.js`, `data/elements.js`, `data/birth-days.js` |
| 45–51 | Cap. 5, Mapa numerológico | Realidade, planos, mapa de Anne | `domain/name-numbers.js`, `data/expression-planes.js` |
| 52–58 | Cap. 6, O que lhe reserva o futuro | Quadro, pináculos, ciclos, desafios, períodos | `domain/birth-grid.js`, `pinnacles.js`, `cycles.js`, `challenges.js`, `personal-periods.js` |
| 59–67 | Cap. 7, Amor, dinheiro e sucesso | Método, 33 interpretações | `domain/love-money-success.js`, `data/oracle-readings.js` |
| 68–72 | Cap. 8, O amor sem lágrimas | Códigos, combinações, paridade, casamento, mudança de nome | `domain/compatibility.js`, `data/relationships.js` |
| 73–74 | Índice | Pós-textual | Não usado |

## Cálculos ensinados

| Cálculo | Página | Exemplo do livro |
|---|---|---|
| Conversão de letras | 16 | Tabela 1–9 |
| Vogais e regra do Y | 16, 45 | Y só sem outra vogal |
| Ambição | 16–18, 46 | Jean Harvey 3; David Weir 6; Anne 22/4 |
| Personalidade (Impressão) | 16–18, 46 | 7; 8; 3 |
| Expressão | 16–18, 45–46 | 1; 5; 7 |
| Frequências | 19–21, 47–48 | David Weir; Anne |
| Destino | 23, 45–46 | 06/10/1947 = 1; 04/03/1930 = 11; 02/04/1946 = 8 |
| Elemento | 31–32 | Listas de dias |
| Realidade | 45–46 | 7 + 8 = 15 → 6 |
| Planos de Expressão | 47–48 | 6, 4, 4, 1 |
| Quadro 3×3 | 52–53 | 06/02/1950 |
| Soma dos algarismos da data | 53 | 23 → 5 |
| Pináculos | 53–56 | 21/04/1942: 7, 1, 8, 11 |
| Ciclos | 54–56 | 4, 3, 7 |
| Desafios | 54, 56 | 1, 4, 3, 3 |
| Ano Universal e Ano Pessoal | 54, 58 | 1971 = 9; 05/05 = 1 |
| Mês Pessoal | 58 | Só a fórmula |
| Amor, Dinheiro e Sucesso | 59 | Só o método |
| Códigos de relacionamento | 68 | Quadro |
| Combinações | 69 | 1 + 9, 1 + 1, 6 + 9 |
| Pares e ímpares | 70 | Sem exemplo numérico |

## Base interpretativa

| Base | Registros | Páginas |
|---|---|---|
| Significados gerais | 11 | 6–15 |
| Caminhos do Destino | 11 | 24–30 |
| Dias de nascimento | 31 | 32–44 |
| Aptidões | 9 | 21–22 |
| Faltas | 9 | 22 |
| Pináculos | 11 | 57–58 |
| Amor | 11 | 59–61 |
| Dinheiro | 11 | 62–64 |
| Sucesso | 11 | 64–67 |
| Elementos | 3 | 31–32 |
| Planos | 4 | 47–51 |
| Relacionamentos | 9 | 68–72 |

## O que o livro não contém

Lista própria de ciclos e desafios, leitura de desafio zero, percentual de compatibilidade, fórmula de dia ou horário pessoal, critério de predominância e texto próprio por plano de expressão. O aplicativo não preenche essas lacunas. Detalhes em `INCONSISTENCIAS_DO_LIVRO.md`.
