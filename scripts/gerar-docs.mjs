#!/usr/bin/env node
/** Gera os documentos derivados dos catálogos, para código e documentação não divergirem. */
import { writeFileSync } from 'node:fs';
import { CLASSIFICACOES, REGRAS } from '../src/data/rules-catalog.js';
import { INCONSISTENCIAS } from '../src/data/inconsistencies.js';

const AVISO = '> Arquivo gerado por `npm run gerar-docs` a partir de `src/data/`. Não edite à mão.\n';

// Cada registro é convertido em uma seção Markdown. Alterar o catálogo e gerar de novo
// mantém a explicação no aplicativo e a documentação interna usando a mesma informação.
const regras = [
  '# Regras com fontes\n',
  AVISO,
  'Obra: *Numerologia: O poder secreto dos números*, Hemus. Classificações: explícita, inferida, ambígua ou contraditória.\n',
  ...REGRAS.map((r) => `## ${r.id}: ${r.nome}

- **Capítulo e página:** cap. ${r.capitulo}, ${r.paginas}
- **Classificação:** ${CLASSIFICACOES[r.classificacao]}
- **Fórmula:** ${r.formula}
- **Exemplo reproduzível:** ${r.exemplo}
- **Casos especiais:** ${r.casosEspeciais}
- **Tratamento de 11 e 22:** ${r.mestres}
- **Ambiguidades:** ${r.ambiguidades}
- **Implementação:** \`${r.implementacao}\`
`),
].join('\n');

const inconsistencias = [
  '# Inconsistências do livro\n',
  AVISO,
  `São ${INCONSISTENCIAS.length} registros. Cada um separa a passagem original, o problema identificado e a decisão adotada.\n`,
  ...INCONSISTENCIAS.map((i) => `## ${i.id}: ${i.titulo}

- **Página:** ${i.paginas}
- **Tipo:** ${i.tipo}
- **Passagem:** ${i.passagem}
- **Problema:** ${i.problema}
- **Solução no aplicativo:** ${i.solucao}
`),
].join('\n');

// Resolver caminhos pelo próprio módulo permite chamar o script a partir de outra pasta.
writeFileSync(new URL('../docs/REGRAS_COM_FONTES.md', import.meta.url), regras);
writeFileSync(new URL('../docs/INCONSISTENCIAS_DO_LIVRO.md', import.meta.url), inconsistencias);
console.log(`${REGRAS.length} regras e ${INCONSISTENCIAS.length} inconsistências documentadas.`);
