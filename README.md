# Numerologia

Sistema local baseado em *Numerologia: O poder secreto dos números*, de Mary Anderson. Criado a partir da estrutura do aplicativo em `../numerologia-mary-anderson`, com uma cópia independente dos arquivos.

## Abrir

Abra **`index.html`** nesta pasta com dois cliques. O arquivo já contém os cálculos, os estilos e as interpretações extraídas do PDF fornecido. Funciona sem internet.

Preencha o nome completo recebido ao nascer e a data de nascimento. O botão **Gerar mapa numerológico completo** abre o relatório. Clique nos números para consultar seus significados e cálculos. Use **Imprimir / Salvar como PDF** para guardar o resultado.

## Conteúdo

- Ambição, Personalidade, Expressão, Destino e Realidade.
- Conversão das letras, frequências, aptidões, ausências e planos de expressão.
- Os 31 dias de nascimento e seus elementos harmônicos.
- Quadro numerológico 3×3, quatro pináculos, quatro desafios e três ciclos.
- Ano Pessoal e os doze Meses Pessoais, com consulta a outros anos.
- Amor, Dinheiro e Sucesso, com três números escolhidos livremente.
- Comparação de duas pessoas e perfis opcionais salvos no navegador.

As interpretações são as passagens do PDF, sem resumos substitutos e sem citações de páginas. As notas do aplicativo aparecem separadas. A transcrição conserva a grafia e os erros de digitalização do arquivo; apenas o título do dia 18 é identificado pela sequência, e o número de rodapé que entrou no meio da sua frase é removido. As quebras de linha são reagrupadas em parágrafos.

## Desenvolver ou gerar novamente

Requisitos: Node.js 22.12 ou superior e `pdftotext` (`poppler-utils` no Linux Mint). A transcrição conferida acompanha o projeto. Para extraí-la novamente, mantenha o PDF na pasta acima, com o nome `numerologia-mary-anderson-fratermarcos.pdf`. Sem o PDF, o build verifica e usa a transcrição incluída.

```bash
cd ~/Documentos/numerologia/numerologia-codex
npm install
npm run dev
```

Para gerar novamente o arquivo que abre com dois cliques:

```bash
npm run build
```

O build importa o PDF e verifica se cada passagem existe na fonte e se todas as interpretações exigidas estão presentes. Uma interpretação ausente interrompe a geração; o sistema não usa resumos no lugar do livro.

Para abrir pelo celular na mesma rede, depois do build:

```bash
npm run preview -- --host
```

Abra o endereço de rede mostrado no terminal, na porta 4175.

## Verificações

```bash
npm test
npm run verificar-textos
npm run test:ui
```

Os testes cobrem os exemplos do livro, datas, números principais, frequências, períodos, comparação e interface. Os testes de navegador exigem o Chromium do Playwright (`npx playwright install chromium`).

Os dados são calculados no aparelho. O armazenamento de perfis é opcional e independente do aplicativo de referência. Não há publicação ou sincronização automática.

Os detalhes das escolhas para as ambiguidades do livro estão em [docs/DECISOES_DE_IMPLEMENTACAO.md](docs/DECISOES_DE_IMPLEMENTACAO.md).

## GitHub Pages

Para publicar pelo terminal já autenticado do Linux Mint, execute:

```bash
bash ~/Documentos/numerologia/numerologia-codex/scripts/publicar-github.sh
```

O comando verifica a conta e o repositório, executa os testes, envia `main`, configura o Pages, acompanha a publicação e mostra o endereço depois de confirmar que o site responde. Ele interrompe a publicação se algum teste falhar.

O repositório de destino é [siteprofissional1/numerologia](https://github.com/siteprofissional1/numerologia). O workflow `.github/workflows/pages.yml` executa os testes, gera o site e publica o artefato no GitHub Pages a cada envio para `main`. A origem de publicação nas configurações de Pages deve ser **GitHub Actions**.

O arquivo `index.html` da raiz também pode ser aberto diretamente, independentemente da hospedagem.
