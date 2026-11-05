#!/usr/bin/env bash
# Executar no terminal do Linux Mint, com a sessão GitHub já autenticada.
# Ordem: validar destino e conta → testar → enviar main → configurar Pages → acompanhar.
# O script usa as credenciais do gh; não recebe nem grava tokens em arquivos do projeto.
set -euo pipefail

# -e interrompe falhas; -u recusa variáveis ausentes; pipefail propaga falhas de pipelines.
# Resolve a raiz pelo caminho deste script, sem depender da pasta aberta no terminal.
projeto_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$projeto_dir"
repositorio='siteprofissional1/numerologia'

for programa in gh git node npm curl; do
  command -v "$programa" >/dev/null || { echo "Programa necessário: $programa" >&2; exit 1; }
done

# Confere a identidade respondida pela API, além de uma conta cadastrada localmente no CLI.
conta="$(gh api user --jq '.login')"
if [[ "$conta" != 'siteprofissional1' ]]; then
  echo "A conta ativa é $conta. Selecione siteprofissional1 no GitHub CLI antes de publicar." >&2
  exit 1
fi
permissao="$(gh repo view "$repositorio" --json viewerPermission --jq '.viewerPermission')"
if [[ "$permissao" != 'ADMIN' ]]; then
  echo 'A configuração do GitHub Pages requer acesso ADMIN ao repositório.' >&2
  exit 1
fi
if [[ "$(git branch --show-current)" != 'main' ]]; then
  echo 'Execute a publicação na branch main.' >&2
  exit 1
fi
case "$(git remote get-url origin)" in
  https://github.com/siteprofissional1/numerologia.git|https://github.com/siteprofissional1/numerologia|git@github.com:siteprofissional1/numerologia.git) ;;
  *) echo 'O origin não aponta para siteprofissional1/numerologia.' >&2; exit 1 ;;
esac
# Não inclui alterações de trabalho não revisadas no envio automático.
if [[ -n "$(git status --porcelain)" ]]; then
  echo 'Há alterações locais sem commit. Revise e salve essas alterações antes de publicar.' >&2
  git status --short
  exit 1
fi

echo 'Conferindo os cálculos, os textos e a interface no Chromium…'
if [[ ! -d node_modules ]]; then npm ci; fi
npm test
npx playwright install chromium
npm run test:ui

# O build só pode atualizar estes dois artefatos conhecidos.
git add -- index.html src/data/private/transcricoes.json
if ! git diff --quiet; then
  echo 'As verificações alteraram outros arquivos. Revise as diferenças antes de publicar.' >&2
  git diff --stat
  exit 1
fi
if ! git diff --cached --quiet; then
  git commit -m 'Atualiza os artefatos conferidos para publicação'
fi

echo 'Enviando o sistema para a branch main…'
git push --set-upstream origin main

# Usa a API para criar a configuração de Pages quando ausente ou atualizar a existente.
echo 'Configurando o GitHub Pages para publicar pelo GitHub Actions…'
if gh api "repos/$repositorio/pages" >/dev/null 2>&1; then
  gh api --method PUT "repos/$repositorio/pages" -f build_type=workflow >/dev/null
else
  gh api --method POST "repos/$repositorio/pages" -f build_type=workflow >/dev/null
fi

commit="$(git rev-parse HEAD)"
execucao=''
# A execução de Actions pode levar alguns segundos para aparecer após o push.
# O filtro pelo commit evita acompanhar uma publicação antiga da mesma branch.
for tentativa in {1..12}; do
  execucao="$(gh run list --repo "$repositorio" --workflow pages.yml --branch main --commit "$commit" --limit 1 --json databaseId --jq '.[0].databaseId // empty')"
  if [[ -n "$execucao" ]]; then break; fi
  sleep 5
done
if [[ -z "$execucao" ]]; then
  # Quando o push não gerou uma execução detectável, tenta o disparo manual do workflow.
  gh workflow run pages.yml --repo "$repositorio" --ref main
  for tentativa in {1..12}; do
    execucao="$(gh run list --repo "$repositorio" --workflow pages.yml --branch main --commit "$commit" --limit 1 --json databaseId --jq '.[0].databaseId // empty')"
    if [[ -n "$execucao" ]]; then break; fi
    sleep 5
  done
fi
if [[ -z "$execucao" ]]; then
  echo "Os arquivos foram enviados, mas a execução ainda não apareceu: https://github.com/$repositorio/actions" >&2
  exit 1
fi

echo 'Acompanhando os testes e a publicação no GitHub…'
gh run watch "$execucao" --repo "$repositorio" --exit-status
# Só anuncia sucesso depois do workflow aprovado e de uma resposta HTTP válida do site.
endereco="$(gh api "repos/$repositorio/pages" --jq '.html_url')"
curl --fail --silent --show-error --location --retry 10 --retry-delay 3 --retry-all-errors "$endereco" --output /dev/null
printf '\nSistema publicado e respondendo em:\n%s\n' "$endereco"
