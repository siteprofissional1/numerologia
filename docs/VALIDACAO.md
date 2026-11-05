# Validação da versão

Conferência local em 5 de novembro de 2026.

- Build de produção concluído, com arquivo único na raiz e em `dist/index.html`.
- 187 testes de cálculos, datas, exemplos, interpretações e armazenamento aprovados.
- 168 passagens verificadas contra o PDF fornecido; todas as 168 chaves de conteúdo da interface estão cobertas.
- 565 telas e diálogos renderizados em DOM simulado com LinkeDOM, verificando 3.826 ocorrências de passagens. Nenhuma divergência em relação à transcrição e nenhuma citação de página.
- HTML final executado em DOM simulado: formulário, eventos, navegação e geração do mapa de Anne Louise Jones, com Ambição 22/4, Destino 8 e 18 seções.
- Arquivo final sem dependências externas de JavaScript ou CSS. Hashes de conteúdo conferidos com a política CSP.

O ambiente local impede abrir portas e iniciar o Chromium. Portanto, os testes de navegador real, aparência responsiva e impressão não foram executados aqui. O workflow de publicação executa os 40 testes Playwright em Chromium antes de publicar o site.

As referências de procedência nos catálogos internos não são exibidas ao leitor. As notas editoriais permanecem separadas do texto do livro.
