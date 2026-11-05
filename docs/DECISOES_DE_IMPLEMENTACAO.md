# Decisões de implementação

## Textos

As interpretações são transcritas do PDF fornecido. O importador conserva as palavras, a pontuação e a grafia da extração, incluindo erros de OCR como “Arme” e “affnadilhas”. As linhas são reunidas e os parágrafos reconstruídos pelo recuo do texto; a disposição tipográfica pode diferir do impresso.

O segundo título “Nascido no dia 15”, entre 17 e 19, é associado ao dia 18. O rodapé “38” que invadiu a frase desse dia é retirado. Nenhuma outra palavra da interpretação é corrigida. A nota editorial é exibida separadamente.

As definições dos cinco números principais e as instruções de Amor, Dinheiro e Sucesso também são transcritas. As fórmulas, os títulos de navegação e as notas de implementação são textos do aplicativo.

O build sempre importa e valida os textos. A interface exige o trecho literal para cada chave; não há fallback para resumos. Os descritores herdados em `src/data/` mantêm os metadados de procedência para auditoria, mas suas paráfrases não são exibidas.

Não há citações de páginas na interface, nos diálogos ou na impressão. Os localizadores internos servem apenas para extrair e verificar a fonte.

## Cálculos

- A tabela atribui 1 a 9 às letras A–Z. Acentos são convertidos e informados como convenção técnica. Y é vogal somente quando o nome inteiro não tem A, E, I, O ou U.
- Ambição e Personalidade somam subtotais por palavra. Esses subtotais conservam 11 e 22; o resultado final é reduzido, registrando o intermediário principal, como 22/4 no exemplo de Anne Louise Jones.
- Expressão é Ambição + Personalidade; Realidade é Expressão + Destino.
- Os componentes da data são reduzidos antes da soma, conforme os exemplos. Destino e pináculos conservam 11 e 22 no resultado.
- O primeiro pináculo termina em 36 − Destino. Para Destino 11 e 22 usa-se o número literal, mostrando a alternativa reduzida quando pertinente. Os dois pináculos intermediários duram nove anos, seguindo a regra textual; a tabela do livro é contraditória.
- Os desafios são diferenças absolutas entre componentes reduzidos. Desafio zero permanece zero, sem inventar uma interpretação.
- O segundo ciclo acompanha o segundo e o terceiro pináculos e os nove primeiros anos do quarto. O terceiro ciclo ocupa o restante da vida.
- Ano Pessoal e Mês Pessoal são reduzidos a um dígito, com registro de 11/22 no caminho da soma. O mês usa o número do calendário.
- Não há fórmula de Dia Pessoal ou percentuais de compatibilidade no livro; essas funções não são acrescentadas.
- As leituras de ciclos e desafios usam a correspondência com os pináculos, conforme a indicação da autora, identificada como tal.

## Relatório e funcionamento

O mapa completo inclui os planos de expressão e as aptidões de todos os números presentes. Leituras de fases repetidas apontam para a primeira ocorrência. Os doze meses são agrupados por número para evitar repetir a mesma passagem.

O build gera um único `index.html`, com estilos, JavaScript e transcrição embutidos, para abrir pela pasta. O armazenamento opcional usa o prefixo `numerologia-codex.`. A cópia de referência não é alterada.
