import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const RAIZ = import.meta.dirname;
const hash = (texto) => `'sha256-${createHash('sha256').update(texto).digest('base64')}'`;

/**
 * Embute CSS e JavaScript em um único HTML, para abrir com dois cliques:
 * navegadores bloqueiam módulos externos em file://. A CSP libera só esse
 * conteúdo, por hash, e connect-src impede que dados saiam para outro domínio.
 */
function arquivoUnico() {
  let html = '';
  return {
    name: 'arquivo-unico',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const pagina = Object.values(bundle).find((f) => f.fileName.endsWith('.html'));
      const arquivos = Object.values(bundle).filter((f) => f !== pagina);
      const js = arquivos
        .filter((f) => f.type === 'chunk')
        .map((f) => f.code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--'))
        .join('\n');
      const css = arquivos.filter((f) => f.fileName.endsWith('.css')).map((f) => f.source).join('\n');
      const csp = [
        "default-src 'none'",
        `script-src ${hash(js)}`,
        `style-src ${hash(css)}`,
        "img-src 'self' data:",
        "connect-src 'self'",
        "base-uri 'none'",
        "form-action 'none'",
      ].join('; ');

      html = String(pagina.source)
        .replace(/\s*<script\b[^>]*\bsrc=[^>]*><\/script>/g, '')
        .replace(/\s*<link\b[^>]*rel="stylesheet"[^>]*>/g, '')
        .replace('<meta charset="utf-8" />', () =>
          `<meta charset="utf-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`)
        .replace('</head>', () => `<style>${css}</style>\n  </head>`)
        .replace('</body>', () => `<script type="module">${js}</script>\n  </body>`);

      pagina.source = html;
      for (const f of arquivos) delete bundle[f.fileName];
    },
    closeBundle() {
      if (html) writeFileSync(resolve(RAIZ, 'index.html'), html);
    },
  };
}

export default defineConfig(() => ({
  root: resolve(RAIZ, 'src'),
  envDir: RAIZ,
  base: './',
  plugins: [arquivoUnico()],
  build: {
    outDir: resolve(RAIZ, 'dist'),
    emptyOutDir: true,
    target: 'es2020',
    modulePreload: false,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    chunkSizeWarningLimit: 2000,
  },
  preview: { port: 4175, strictPort: true },
  test: {
    root: RAIZ,
    include: ['tests/**/*.test.js'],
    environment: 'node',
  },
}));
