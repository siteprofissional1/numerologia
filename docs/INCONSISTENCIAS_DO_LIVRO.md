# Inconsistências do livro

> Arquivo gerado por `npm run gerar-docs` a partir de `src/data/`. Não edite à mão.

São 30 registros. Cada um separa a passagem original, o problema identificado e a decisão adotada.

## I-01: Segundo título "dia 15"

- **Página:** p. 38
- **Tipo:** Erro editorial
- **Passagem:** Sequência de títulos: "dia 17", "dia 15", "dia 19".
- **Problema:** O dia 18 fica sem título, e o dia 15 aparece duas vezes.
- **Solução no aplicativo:** O texto entre 17 e 19 é o dia 18; o dia 15 da p. 37 é preservado. Validado por teste.

## I-02: Número de página no meio do texto

- **Página:** p. 38
- **Tipo:** Erro de digitalização
- **Passagem:** "capacidade crítica, como 38 ensaísta"
- **Problema:** O número da página invadiu a frase do dia 18.
- **Solução no aplicativo:** O importador remove o "38" do texto privado.

## I-03: Contagem do 6 em ANNE LOUISE JONES

- **Página:** p. 48 (e p. 50)
- **Tipo:** Erro matemático
- **Passagem:** Tabela: "0 X 6"
- **Problema:** O nome tem duas letras O, de valor 6. Os "4" emocionais e os "dois números 6" da p. 50 confirmam isso.
- **Solução no aplicativo:** O aplicativo faz a contagem verdadeira: 2 × 6.

## I-04: Duração dos pináculos intermediários

- **Página:** p. 53, 56
- **Tipo:** Contradição
- **Passagem:** "terá a duração de nove anos"; tabela "De 32 anos aos 41"
- **Problema:** De 32 a 41 são dez idades inteiras, e não nove.
- **Solução no aplicativo:** Dois modos, identificados: regra textual (32–40, 41–49, 50+) e tabela (32–41, 42–51, 52+).

## I-05: Duração do primeiro pináculo

- **Página:** p. 53, 55–56
- **Tipo:** Contradição
- **Passagem:** O primeiro pináculo "tem uma duração de nove anos"
- **Problema:** A fórmula 36 − N dá 27 anos ou mais, e a p. 56 diz que o primeiro é dos mais prolongados.
- **Solução no aplicativo:** Prevalece 36 − N, usada no exemplo resolvido.

## I-06: Redução versus quarto pináculo 11

- **Página:** p. 54–56
- **Tipo:** Contradição
- **Passagem:** "deve ser reduzido a um só dígito"; "4 + 7 = 11 para encontrar o quarto pináculo"
- **Problema:** A regra geral destruiria o 11 mostrado no exemplo.
- **Solução no aplicativo:** Pináculos conservam 11 e 22.

## I-07: Quarto desafio chamado de pináculo

- **Página:** p. 56
- **Tipo:** Erro de terminologia
- **Passagem:** "encontrará o quarto pináculo"
- **Problema:** A seção é sobre desafios, e a tabela lista 3 como quarto desafio.
- **Solução no aplicativo:** Implementado como quarto desafio, |M − A|.

## I-08: Subtração com sinal e redação truncada

- **Página:** p. 56
- **Tipo:** Erro editorial
- **Passagem:** "3 — 4 = 1", "3 — 7 = 4"; "Subtraia o dia e o mês do nascimento do primeiro desafio"
- **Problema:** As contas literais dariam −1 e −4, e a frase inverte a operação.
- **Solução no aplicativo:** Valor absoluto, apoiado em "sempre o mais alto da série mais baixa".

## I-09: Abreviações do exemplo de 1971

- **Página:** p. 58
- **Tipo:** Erro editorial
- **Passagem:** "1 + 9 + 7 + 1 = 9"; "5 + 5 = 1"
- **Problema:** As somas reais são 18 → 9 e 5 + 5 + 9 = 19 → 10 → 1.
- **Solução no aplicativo:** O aplicativo mostra todas as etapas.

## I-10: O 8 no elemento Fogo

- **Página:** p. 31, 68
- **Tipo:** Contradição
- **Passagem:** p. 31: "2, 4, 8, 11 ou 22"; p. 68: "2.4.11.22"
- **Problema:** O quadro da p. 68 omite o 8, deixando-o sem grupo.
- **Solução no aplicativo:** Elemento do dia segue a p. 31. Na comparação, a divergência é mostrada quando muda a classificação.

## I-11: Natureza dos números pares

- **Página:** p. 70
- **Tipo:** Contradição
- **Passagem:** Pares: "positivas"; depois, pares predominantes: "tipo mais negativo, subjetivo"
- **Problema:** Duas descrições opostas no mesmo trecho.
- **Solução no aplicativo:** Mostrada a contagem e a conclusão final ("realizadores" e "pensadores"), com aviso.

## I-12: Intermediário 22/4 da Ambição

- **Página:** p. 46–47
- **Tipo:** Particularidade
- **Passagem:** "6 + 5 + 11 = 22 = 4"; "número de ambição 22/4"
- **Problema:** A soma bruta 40 → 4 não passa por 22; só a soma por palavra o revela.
- **Solução no aplicativo:** Os dois caminhos são calculados e o 22/4 é exibido.

## I-13: Uso desigual dos números mestres

- **Página:** p. 17, 23, 54, 59
- **Tipo:** Contradição
- **Passagem:** p. 17: "reduzidos a um único dígito"; p. 23: "não podem ser reduzidos"
- **Problema:** Cada operação segue uma política própria.
- **Solução no aplicativo:** Regra específica por operação, documentada em REGRAS_COM_FONTES.

## I-14: Desafio zero

- **Página:** p. 56
- **Tipo:** Lacuna
- **Passagem:** Sem passagem correspondente
- **Problema:** A subtração pode dar 0, mas não há texto para isso.
- **Solução no aplicativo:** O zero é preservado, sem interpretação.

## I-15: Percentuais de compatibilidade

- **Página:** cap. 8
- **Tipo:** Lacuna
- **Passagem:** Sem passagem correspondente
- **Problema:** Não existe fórmula de percentual.
- **Solução no aplicativo:** O aplicativo não calcula percentuais nem probabilidades.

## I-16: Predominância geral de um número

- **Página:** p. 6, 20, 48
- **Tipo:** Lacuna
- **Passagem:** "sendo este número predominante em seu mapa"
- **Problema:** Não há algoritmo para determinar a predominância.
- **Solução no aplicativo:** Mostram-se só os mais frequentes, sem índice inventado.

## I-17: 36 − N com Destino 11 ou 22

- **Página:** p. 53, 55
- **Tipo:** Lacuna
- **Passagem:** "subtraindo o número de destino do número 36"
- **Problema:** N pode ser literal (25, 14) ou reduzido (34, 32).
- **Solução no aplicativo:** As duas contas são mostradas; o mapa usa o número literal.

## I-18: Letras omitidas nos diagramas

- **Página:** p. 17, 18, 46
- **Tipo:** Erro editorial
- **Passagem:** "HARVE", "WEI"; consoantes de JONES sem o último 1
- **Problema:** Faltam Y, R e S nos desenhos, embora as somas 28, 14 e 7 os incluam.
- **Solução no aplicativo:** O cálculo usa a grafia integral (HARVEY, WEIR, JONES).

## I-19: Rótulo trocado de David Weir

- **Página:** p. 19
- **Tipo:** Erro editorial
- **Passagem:** "o número de ambição, 5"
- **Problema:** O 5 é a Expressão de David; a Ambição é 6.
- **Solução no aplicativo:** Registrado; não afeta o cálculo.

## I-20: Faltas de David Weir

- **Página:** p. 20–21
- **Tipo:** Contradição
- **Passagem:** "os números 2, 3 e 7 não são supridos"; "o 5 também é o seu número de expressão"
- **Problema:** O 5 é citado como se faltasse, mas David tem dois. O 8 é suprido pelos 4 na p. 21, e pela posição principal na conta.
- **Solução no aplicativo:** A lista de não supridos (2, 3, 7) é reproduzida pelas posições principais. Regra inferida.

## I-21: Rótulos trocados no mapa de Anne

- **Página:** p. 50
- **Tipo:** Erro editorial
- **Passagem:** "um número de expressão, 4"; "dois números 6 no seu plano material"
- **Problema:** O 4 é a Ambição, e o 6 pertence ao grupo emocional (p. 47).
- **Solução no aplicativo:** Mantidos os grupos da p. 47 e a posição correta.

## I-22: "Um 7" nos planos

- **Página:** p. 49
- **Tipo:** Ambiguidade
- **Passagem:** "encontrar um 7 ou observar a falta deste número"
- **Problema:** Não está claro se é exatamente um 7. Na prática, a regra cobriria quase todos os nomes.
- **Solução no aplicativo:** A nota aparece com zero ou um 7, acompanhada do aviso de ambiguidade.

## I-23: Variação diária

- **Página:** p. 58
- **Tipo:** Lacuna
- **Passagem:** "varia a cada dia, como já afirmamos"
- **Problema:** Não foi afirmado antes, e não há fórmula de dia pessoal.
- **Solução no aplicativo:** Dia pessoal e horário pessoal não são implementados.

## I-24: Definição de similares

- **Página:** p. 68
- **Tipo:** Ambiguidade
- **Passagem:** "quando o número de ambição e número de destino são iguais"
- **Problema:** O quadro define similares por grupo, e a p. 69 trata 6 e 9 como semelhantes, sem serem iguais.
- **Solução no aplicativo:** Adotado o grupo, com a igualdade exata indicada à parte.

## I-25: Paridade dos números mestres

- **Página:** p. 68
- **Tipo:** Lacuna
- **Passagem:** "Dois números, um par e outro ímpar"
- **Problema:** 11 é ímpar, mas se reduz a 2, que é par.
- **Solução no aplicativo:** Havendo divergência, as duas leituras são mostradas.

## I-26: Afinidades assimétricas

- **Página:** cap. 1
- **Tipo:** Contradição
- **Passagem:** O 1 lista o 4; o 4 lista apenas 2 e 8
- **Problema:** As listas não são recíprocas.
- **Solução no aplicativo:** A comparação mostra a direção: quem lista quem.

## I-27: Terceiro ciclo fora da lista

- **Página:** p. 54–56
- **Tipo:** Lacuna
- **Passagem:** A p. 54 define só o primeiro e o segundo ciclos
- **Problema:** O terceiro aparece apenas na p. 56.
- **Solução no aplicativo:** Implementado conforme a p. 56.

## I-28: Erros recorrentes de leitura

- **Página:** p. 46–49
- **Tipo:** Erro de digitalização
- **Passagem:** "Arme" por Anne; "tomar" por tornar; "funde" por fim de; "S" e "l" por 5 e 1
- **Problema:** O PDF traz erros típicos de OCR.
- **Solução no aplicativo:** A transcrição os preserva sem corrigir.

## I-29: Pináculo 11, "dos da infância"

- **Página:** p. 57
- **Tipo:** Erro provável
- **Passagem:** "assim como dos da infância"
- **Problema:** A expressão é obscura e pode ser erro de digitalização.
- **Solução no aplicativo:** A transcrição a mantém, sem correção por conjectura.

## I-30: "affnadilhas" em vez de "armadilhas"

- **Página:** p. 54
- **Tipo:** Erro de digitalização
- **Passagem:** "verdadeiras affnadilhas"
- **Problema:** A palavra não existe; o contexto indica "armadilhas".
- **Solução no aplicativo:** A transcrição conserva "affnadilhas", exatamente como no PDF.
