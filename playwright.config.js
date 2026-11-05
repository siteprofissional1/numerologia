/**
 * Testes de navegador usam o build real, servido na porta 4175.
 * O Playwright inicia e encerra o servidor; não reutilizar outro evita testar uma versão errada.
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'ui.spec.js',
  fullyParallel: true,
  // Limita os navegadores simultâneos para reduzir o uso de memória local e no CI.
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4175/',
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4175/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
