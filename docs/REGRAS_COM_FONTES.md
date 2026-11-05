# Regras com fontes

> Arquivo gerado por `npm run gerar-docs` a partir de `src/data/`. Não edite à mão.

Obra: *Numerologia: O poder secreto dos números*, Hemus. Classificações: explícita, inferida, ambígua ou contraditória.

## R-LETRAS: Conversão de letras em números

- **Capítulo e página:** cap. 2, p. 16
- **Classificação:** Explícita no livro
- **Fórmula:** 1: A J S · 2: B K T · 3: C L U · 4: D M V · 5: E N W · 6: F O X · 7: G P Y · 8: H Q Z · 9: I R
- **Exemplo reproduzível:** DAVID → 4 1 4 9 4
- **Casos especiais:** Letras acentuadas não constam do livro. Convertê-las (Á→A, Ç→C) é convenção técnica do aplicativo; o modo estrito as recusa. Símbolos desconhecidos nunca recebem número.
- **Tratamento de 11 e 22:** Não se aplica.
- **Ambiguidades:** O livro não trata de diacríticos.
- **Implementação:** `domain/alphabet.js: valorLetra(); domain/normalize-name.js: decomporNome()`

## R-VOGAIS: Vogais e a regra do Y

- **Capítulo e página:** cap. 2, p. 16, 45
- **Classificação:** Explícita no livro
- **Fórmula:** Vogais: A E I O U. Y é vogal somente se o nome inteiro não tiver nenhuma dessas cinco.
- **Exemplo reproduzível:** JEAN HARVEY: o Y é consoante e vale 7 nas consoantes (p. 17). "Lynn" sozinho: o Y é vogal.
- **Casos especiais:** Sem vogal e sem Y, a Ambição é informada como indeterminada.
- **Tratamento de 11 e 22:** Não se aplica.
- **Ambiguidades:** "No nome" poderia significar cada palavra; adota-se o nome completo, como pedido e como a p. 45 ("nomes formados apenas por consoantes") sugere.
- **Implementação:** `domain/name-numbers.js: analisarNome()`

## R-REDUCAO: Redução de números

- **Capítulo e página:** cap. 2, p. 17, 23, 54–55, 59
- **Classificação:** Contraditória
- **Fórmula:** reduzirSimples: somar algarismos até um dígito. reduzirComMestres: idem, parando em 11 ou 22.
- **Exemplo reproduzível:** 28 → 10 → 1; 29 → 11 (com mestres) ou 29 → 11 → 2 (simples)
- **Casos especiais:** A política varia por operação; nunca há redução universal.
- **Tratamento de 11 e 22:** Conservados no Destino, nos Pináculos, no Oráculo e nos subtotais por palavra; registrados como X/Y em Ambição, Personalidade, Expressão, Realidade e períodos pessoais.
- **Ambiguidades:** A p. 54 manda reduzir a um só dígito, mas a p. 55–56 mantém o quarto pináculo 11.
- **Implementação:** `domain/reduce.js`

## R-AMBICAO: Número de Ambição

- **Capítulo e página:** cap. 2, p. 16–18, 45–47
- **Classificação:** Explícita no livro
- **Fórmula:** Somar vogais por palavra, reduzir cada subtotal (conservando 11 e 22), somar os subtotais e reduzir a um dígito.
- **Exemplo reproduzível:** ANNE LOUISE JONES: 6 + (23→5) + 11 = 22 → 4; soma bruta 40 → 4
- **Casos especiais:** Palavra sem vogal não entra nos subtotais.
- **Tratamento de 11 e 22:** Resultado principal de um dígito, com o intermediário registrado: "número de ambição 22/4" (p. 46).
- **Ambiguidades:** A soma bruta (40) esconde o 22 que a soma por palavra revela; as duas são mostradas.
- **Implementação:** `domain/name-numbers.js: calcularAmbicao()`

## R-PERSONALIDADE: Número de Personalidade (Impressão)

- **Capítulo e página:** cap. 2, p. 16–18, 45–47
- **Classificação:** Explícita no livro
- **Fórmula:** Mesmo procedimento da Ambição, com as consoantes.
- **Exemplo reproduzível:** JEAN HARVEY: 6 + (28→10→1) = 7
- **Casos especiais:** Sem consoantes, o número é indeterminado.
- **Tratamento de 11 e 22:** Um dígito como principal, com X/Y registrado (inferido do tratamento da Ambição).
- **Ambiguidades:** Os diagramas omitem letras (HARVE, WEI, JONE), mas as somas as incluem.
- **Implementação:** `domain/name-numbers.js: calcularPersonalidade()`

## R-EXPRESSAO: Número de Expressão

- **Capítulo e página:** cap. 2, p. 16–18, 45–47
- **Classificação:** Explícita no livro
- **Fórmula:** Ambição + Personalidade, reduzido; controle: soma de todas as letras, reduzida.
- **Exemplo reproduzível:** DAVID WEIR: 6 + 8 = 14 → 5; todas as letras 50 → 5
- **Casos especiais:** Se Ambição ou Personalidade for indeterminada, usa-se a soma de todas as letras, com aviso.
- **Tratamento de 11 e 22:** Um dígito como principal, com 11/2 ou 22/4 registrado quando aparecer: o livro não dá exemplo de Expressão mestre.
- **Ambiguidades:** A leitura de Expressão mestre é uma inferência.
- **Implementação:** `domain/name-numbers.js: calcularExpressao()`

## R-REALIDADE: Número de Realidade

- **Capítulo e página:** cap. 5, p. 45–46, 71
- **Classificação:** Explícita no livro
- **Fórmula:** Expressão + Destino, reduzido.
- **Exemplo reproduzível:** ANNE LOUISE JONES: 7 + 8 = 15 → 6
- **Casos especiais:** Influência mais forte na segunda metade da vida (p. 46).
- **Tratamento de 11 e 22:** Destino 11 ou 22 entra literal na soma; o resultado é um dígito, com X/Y registrado.
- **Ambiguidades:** O livro não dá exemplo com Destino mestre.
- **Implementação:** `domain/name-numbers.js: calcularRealidade()`

## R-INTENSIFICACAO: Intensificação: frequências, aptidões e faltas

- **Capítulo e página:** cap. 2, p. 19–22
- **Classificação:** Inferida a partir de exemplo
- **Fórmula:** Contar quantas letras têm cada valor de 1 a 9.
- **Exemplo reproduzível:** DAVID WEIR: 1×1, 3×4, 2×5, 3×9
- **Casos especiais:** Falta "suprida" por posição principal: os números 2, 3 e 7 são os únicos não supridos de David, cujas posições são 6, 8 e 5 (p. 20).
- **Tratamento de 11 e 22:** A contagem só tem valores de 1 a 9.
- **Ambiguidades:** O livro não define quantas repetições são "muitos" números; o aplicativo só aponta os mais frequentes e não cria fórmula de dominância.
- **Implementação:** `domain/name-numbers.js: calcularFrequencias(), calcularSuprimentos()`

## R-PLANOS: Planos de Expressão

- **Capítulo e página:** cap. 5, p. 47–51
- **Classificação:** Explícita no livro
- **Fórmula:** Materiais: 4, 5. Emocionais: 2, 3, 6. Mentais: 1, 8. Intuitivos: 7, 9. Soma das QUANTIDADES de letras.
- **Exemplo reproduzível:** ANNE LOUISE JONES: 6, 4, 4, 1
- **Casos especiais:** Corrige a contagem "0 × 6" da p. 48: há duas letras O.
- **Tratamento de 11 e 22:** Não se aplica.
- **Ambiguidades:** Não há regra para declarar um plano dominante nem texto próprio por plano.
- **Implementação:** `domain/name-numbers.js: calcularPlanos()`

## R-DESTINO: Caminho do Destino

- **Capítulo e página:** cap. 3, p. 23–30, 45
- **Classificação:** Explícita no livro
- **Fórmula:** D + M + A, cada um reduzido; a soma é reduzida, parando em 11 ou 22.
- **Exemplo reproduzível:** 06/10/1947: 6 + 1 + 3 = 10 → 1. 04/03/1930: 4 + 3 + 4 = 11
- **Casos especiais:** O mês 10 vale 1; o ano é reduzido pela soma de seus algarismos.
- **Tratamento de 11 e 22:** O 11 e o 22 finais não são reduzidos, com leitura opcional 11/2 e 22/4 (p. 23, 29).
- **Ambiguidades:** Não há exemplo de dia, mês ou ano igual a 11 ou 22 como componente. O aplicativo reduz e avisa quando conservar esses números mudaria o resultado.
- **Implementação:** `domain/birth-numbers.js: calcularComponentes(), calcularDestino()`

## R-DIA: Dia de nascimento

- **Capítulo e página:** cap. 4, p. 32–44
- **Classificação:** Explícita no livro
- **Fórmula:** Interpretação indexada pelo dia original de 1 a 31.
- **Exemplo reproduzível:** Dia 19 recebe o texto do dia 19, não o genérico do número 1.
- **Casos especiais:** O título "dia 15" entre 17 e 19 (p. 38) é o dia 18.
- **Tratamento de 11 e 22:** Dias 11 e 22 têm texto próprio; o dia 22 autoriza reduzir a 4 (p. 40).
- **Ambiguidades:** Nenhuma além do erro de título.
- **Implementação:** `data/birth-days.js; domain/birth-numbers.js: calcularDiaNascimento()`

## R-ELEMENTOS: Elementos harmônicos

- **Capítulo e página:** cap. 4, p. 31–32, 68
- **Classificação:** Contraditória
- **Fórmula:** Água: 1, 5, 7. Fogo: 2, 4, 8, 11, 22. Ar: 3, 6, 9. Cada dia está em uma lista.
- **Exemplo reproduzível:** Dia 28 → 1 → Água; dia 29 → 11 → Fogo
- **Casos especiais:** A lista de dias é igual à obtida pela redução do dia.
- **Tratamento de 11 e 22:** 11 e 22 pertencem ao Fogo.
- **Ambiguidades:** A p. 31 inclui o 8 no Fogo; o quadro da p. 68 o omite.
- **Implementação:** `domain/birth-numbers.js: ELEMENTOS, elementoDoDia()`

## R-QUADRO: Quadro numerológico 3×3

- **Capítulo e página:** cap. 6, p. 52–53
- **Classificação:** Explícita no livro
- **Fórmula:** Linhas 3 6 9 / 2 5 8 / 1 4 7, preenchidas com os algarismos da data, sem zeros.
- **Exemplo reproduzível:** 06/02/1950: 6, 2, 1, 9, 5; soma 23 → 5
- **Casos especiais:** Só a data preenche o quadro. Só há leitura para linhas horizontais, verticais e a diagonal 1-5-9.
- **Tratamento de 11 e 22:** Não se aplica.
- **Ambiguidades:** O livro não define o tratamento de repetições nem a diagonal 3-5-7, e a leitura só é exemplificada para a diagonal completa.
- **Implementação:** `domain/birth-grid.js: calcularQuadro()`

## R-PINACULOS: Pináculos

- **Capítulo e página:** cap. 6, p. 53–58
- **Classificação:** Contraditória
- **Fórmula:** Fim do 1º = 36 − N. P1 = D+M; P2 = D+A; P3 = P1+P2; P4 = M+A.
- **Exemplo reproduzível:** 21/04/1942: fim 31; 7, 1, 8, 11
- **Casos especiais:** Duração: nove anos no texto, usados no mapa; dez idades na tabela da p. 56.
- **Tratamento de 11 e 22:** Conservados, reproduzindo o quarto pináculo 11. Para 36 − N com Destino mestre, as duas contas são mostradas.
- **Ambiguidades:** A p. 53 diz que o primeiro dura nove anos, mas a fórmula e a p. 56 contradizem isso.
- **Implementação:** `domain/pinnacles.js`

## R-CICLOS: Ciclos da vida

- **Capítulo e página:** cap. 6, p. 54–56, 58
- **Classificação:** Explícita no livro
- **Fórmula:** C1 = mês, até o fim de P1. C2 = dia, por P2, P3 e nove anos de P4. C3 = ano, pelo restante.
- **Exemplo reproduzível:** 21/04/1942: 4, 3, 7; o ciclo 7 começa aos 59 (nove anos) ou 61 (tabela da p. 56)
- **Casos especiais:** A idade de troca depende do modo dos pináculos.
- **Tratamento de 11 e 22:** Dia, mês ou ano 11/22 são exibidos como X/Y e somados conforme a política.
- **Ambiguidades:** Não há lista própria de interpretações: a p. 58 diz apenas que o significado é semelhante.
- **Implementação:** `domain/cycles.js`

## R-DESAFIOS: Desafios da vida

- **Capítulo e página:** cap. 6, p. 54, 56, 58
- **Classificação:** Inferida a partir de exemplo
- **Fórmula:** |D−M|, |D−A|, |D1−D2|, |M−A|, com números de um dígito.
- **Exemplo reproduzível:** 21/04/1942: 1, 4, 3, 3
- **Casos especiais:** Zero é preservado e fica sem interpretação.
- **Tratamento de 11 e 22:** Componentes sempre de um dígito ("o mais alto da série mais baixa", p. 56).
- **Ambiguidades:** A 4ª operação é chamada de "quarto pináculo". Desafio zero não é tratado no livro.
- **Implementação:** `domain/challenges.js`

## R-ANO-PESSOAL: Ano Universal e Ano Pessoal

- **Capítulo e página:** cap. 6, p. 54, 58
- **Classificação:** Explícita no livro
- **Fórmula:** Universal = soma dos algarismos do ano, reduzida. Pessoal = D + M + Universal, reduzido.
- **Exemplo reproduzível:** 05/05 em 1971: 5 + 5 + 9 = 19 → 10 → 1
- **Casos especiais:** O ano consultado é livre e não depende do relógio.
- **Tratamento de 11 e 22:** Um dígito como principal, com X/Y registrado; o livro não dá exemplo mestre.
- **Ambiguidades:** A p. 58 abrevia "5 + 5 = 1" e "1+9+7+1 = 9".
- **Implementação:** `domain/personal-periods.js: calcularAnoPessoal()`

## R-MES-PESSOAL: Mês Pessoal

- **Capítulo e página:** cap. 6, p. 58
- **Classificação:** Ambígua
- **Fórmula:** Ano Pessoal + número do mês do calendário, reduzido.
- **Exemplo reproduzível:** Ano Pessoal 1: janeiro 1 + 1 = 2; dezembro 1 + 12 = 13 → 4
- **Casos especiais:** Sem fórmula para dia pessoal, apesar de a p. 58 mencionar variação diária.
- **Tratamento de 11 e 22:** Um dígito como principal, com X/Y registrado.
- **Ambiguidades:** O livro não diz se os meses 10, 11 e 12 são reduzidos antes. O dígito final é igual; só o registro de 11/22 pode mudar.
- **Implementação:** `domain/personal-periods.js: calcularMesPessoal()`

## R-ORACULO: Amor, Dinheiro e Sucesso

- **Capítulo e página:** cap. 7, p. 59–67
- **Classificação:** Explícita no livro
- **Fórmula:** Três números livres (1 a 9, com 11 e 22 opcionais), somados e reduzidos, sem reduzir 11 e 22.
- **Exemplo reproduzível:** 5 + 9 + 8 = 22 (fica 22); 7 + 8 + 9 = 24 → 6
- **Casos especiais:** Os números não vêm da data: a escolha espontânea faz parte do método.
- **Tratamento de 11 e 22:** Conservados, com leitura própria.
- **Ambiguidades:** Não há proibição de repetir números; repetir é permitido.
- **Implementação:** `domain/love-money-success.js`

## R-RELACOES: Similares, complementares e opostos

- **Capítulo e página:** cap. 8, p. 68–69
- **Classificação:** Ambígua
- **Fórmula:** Mesmo grupo harmônico: similares. Mesma paridade e grupos diferentes: complementares. Paridade e grupos diferentes: opostos.
- **Exemplo reproduzível:** 6 e 9 (Ar): similares. 1 e 3: complementares. 1 e 2: opostos.
- **Casos especiais:** Só Ambição e Destino são classificados, como no texto da p. 68.
- **Tratamento de 11 e 22:** 11 é ímpar, mas 2 é par: se as leituras divergem, as duas são mostradas e nenhuma é imposta. O mesmo vale para o 8 fora do Fogo na p. 68.
- **Ambiguidades:** O texto de "similares" fala em números "iguais"; o quadro, em grupos.
- **Implementação:** `domain/compatibility.js: classificarPar()`

## R-COMBINACOES: Combinação de Expressões e de Destinos

- **Capítulo e página:** cap. 8, p. 69
- **Classificação:** Explícita no livro
- **Fórmula:** Somar os dois números e reduzir.
- **Exemplo reproduzível:** Expressão 1 + 9 = 10 → 1; 1 + 1 = 2; Destino 6 + 9 = 15 → 6
- **Casos especiais:** Não há percentuais: a autora não os define.
- **Tratamento de 11 e 22:** Conservados no registro; o livro não dá exemplo.
- **Ambiguidades:** Só os resultados 1, 2 e 6 são exemplificados; os demais usam o significado geral.
- **Implementação:** `domain/compatibility.js: combinarNumeros()`

## R-PARIDADE: Positivo e negativo (pares e ímpares)

- **Capítulo e página:** cap. 8, p. 70
- **Classificação:** Contraditória
- **Fórmula:** Contar números pares e ímpares no nome e na data.
- **Exemplo reproduzível:** Pares: "realizadores". Ímpares: "pensadores".
- **Casos especiais:** Zeros da data são ignorados, como no quadro.
- **Tratamento de 11 e 22:** A contagem usa só valores de 1 a 9.
- **Ambiguidades:** Uma frase atribui aos pares um tipo "mais negativo"; adota-se a conclusão final do parágrafo.
- **Implementação:** `domain/name-numbers.js: calcularParidade()`
