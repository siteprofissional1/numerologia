import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

/** O texto do livro não é versionado: sem a importação local, o app usa os resumos. */
const TEM_TEXTO_DO_LIVRO = existsSync(new URL('../src/data/private/transcricoes.json', import.meta.url));
const TEXTOS = JSON.parse(readFileSync(new URL('../src/data/private/transcricoes.json', import.meta.url), 'utf8')).textos;

async function conferirLeitura(page) {
  const blocos = await page.locator('[data-texto]').evaluateAll((elementos) => elementos.map((el) => ({
    chave: el.dataset.texto,
    paragrafos: [...el.querySelectorAll(':scope > .texto-original')].map((p) => p.textContent),
  })));
  for (const bloco of blocos) expect(bloco.paragrafos.join('\n\n'), bloco.chave).toBe(TEXTOS[bloco.chave]);
  await expect(page.locator('#conteudo')).not.toContainText(/\bp\.\s*\d|\bpáginas?\s*\d/iu);
  await expect(page.locator('.fonte')).toHaveCount(0);
}

async function gerar(page, nome = 'Anne Louise Jones', data = '02/04/1946') {
  await page.goto('./');
  await page.getByLabel('Nome completo recebido ao nascer').fill(nome);
  await page.getByLabel('Data de nascimento').fill(data);
  await page.getByRole('button', { name: 'Gerar mapa numerológico completo' }).click();
}

const valor = (page, chave) => page.locator(`[data-numero="${chave}"] .numero-valor`);

test('gera o mapa de Anne Louise Jones e mostra os cinco números', async ({ page }) => {
  await gerar(page);
  await expect(page.getByTestId('nome-mapa')).toHaveText('Anne Louise Jones');
  await expect(valor(page, 'ambicao')).toHaveText('22/4');
  await expect(valor(page, 'personalidade')).toHaveText('3');
  await expect(valor(page, 'expressao')).toHaveText('7');
  await expect(valor(page, 'destino')).toHaveText('8');
  await expect(valor(page, 'realidade')).toHaveText('6');
  await expect(valor(page, 'elemento')).toHaveText('Fogo');
});

test('resultados são dinâmicos para outra entrada', async ({ page }) => {
  await gerar(page, 'David Weir', '04/03/1930');
  await expect(valor(page, 'ambicao')).toHaveText('6');
  await expect(valor(page, 'destino')).toHaveText('11');
});

test('o diálogo do número mostra o texto do livro e a fórmula, sem citações, e fecha pelo teclado', async ({ page }) => {
  await gerar(page);
  await page.locator('[data-numero="destino"]').click();
  const dialogo = page.locator('dialog#detalhe');
  await expect(dialogo).toBeVisible();
  await expect(dialogo).toContainText('Dinheiro/Poder Comercial');
  await expect(dialogo).toContainText('2 + 4 + 2 = 8');
  await expect(dialogo).not.toContainText(/\bp\.\s*\d|\bpáginas?\s*\d/iu);
  await page.keyboard.press('Escape');
  await expect(dialogo).toBeHidden();
});

test('mensagens de erro claras e nenhum mapa em dados inválidos', async ({ page }) => {
  await gerar(page, 'Ana3', '31/04/2000');
  const alerta = page.getByRole('alert');
  await expect(alerta).toContainText('Caracteres sem valor');
  await expect(alerta).toContainText('não existe');
});

test('botão limpar esvazia os campos', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Nome completo recebido ao nascer').fill('Ana');
  await page.getByRole('button', { name: 'Limpar campos' }).click();
  await expect(page.getByLabel('Nome completo recebido ao nascer')).toHaveValue('');
});

test('máscara de data', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Data de nascimento').pressSequentially('15031985');
  await expect(page.getByLabel('Data de nascimento')).toHaveValue('15/03/1985');
});

test('injeção de HTML é recusada como nome e nunca executada', async ({ page }) => {
  let alertou = false;
  page.on('dialog', async (d) => { alertou = true; await d.dismiss(); });
  await gerar(page, '<img src=x onerror=alert(1)>', '01/01/2000');
  await expect(page.getByRole('alert')).toContainText('Caracteres');
  expect(await page.locator('img[src="x"]').count()).toBe(0);
  expect(alertou).toBe(false);
});

test('gerar abre direto o mapa completo, sem pré-tela nem botões de copiar e exportar', async ({ page }) => {
  await gerar(page);
  await expect(page).toHaveURL(/#\/mapa$/);
  await expect(valor(page, 'ambicao')).toHaveText('22/4');
  await expect(page.locator('.secao-relatorio')).toHaveCount(18);
  await expect(page.locator('.secao-relatorio h3').first()).toHaveText('1. Dados utilizados');
  await expect(page.getByRole('link', { name: /Abrir relatório/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Painel|Relatório/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Copiar|Exportar/ })).toHaveCount(0);
  await page.locator('[data-numero="destino"]').click();
  await expect(page.locator('dialog#detalhe').getByRole('button', { name: /Copiar/ })).toHaveCount(0);
});

test('todas as seções do mapa abrem sem erro no console', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  await gerar(page);
  for (const id of ['mapa', 'nome', 'frequencias', 'aptidoes', 'planos', 'nascimento', 'quadro', 'pinaculos', 'ciclos', 'ano', 'mes', 'oraculo', 'compatibilidade', 'regras', 'inconsistencias', 'perfis']) {
    await page.goto(`./#/${id}`);
    await expect(page.locator('#conteudo h1, #conteudo h2').first()).toBeVisible();
  }
  expect(erros).toEqual([]);
});

test('quadro 3×3 de 06/02/1950', async ({ page }) => {
  await gerar(page, 'Teste', '06/02/1950');
  await page.getByRole('link', { name: 'Quadro 3×3' }).click();
  for (const n of [1, 2, 5, 6, 9]) await expect(page.locator(`[data-celula="${n}"]`)).toHaveClass(/cheia/);
  for (const n of [3, 4, 7, 8]) await expect(page.locator(`[data-celula="${n}"]`)).toHaveClass(/vazia/);
});

test('pináculos: usa a regra de nove anos, sem seletor de modo', async ({ page }) => {
  await gerar(page, 'Teste', '21/04/1942');
  await page.getByRole('link', { name: 'Pináculos' }).click();
  await expect(page.getByRole('heading', { name: /2º pináculo: 1, 32 a 40 anos/ })).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(0);
});

test('tela inicial traz só nome, data e os botões', async ({ page }) => {
  await page.goto('./');
  const pagina = page.locator('body');
  await expect(pagina).not.toContainText(/Mary Anderson/i);
  await expect(pagina).not.toContainText(/nome adotado/i);
  await expect(pagina).not.toContainText(/Opções de método/i);
  await expect(page.locator('#conteudo input')).toHaveCount(2);
  await expect(page.locator('#conteudo details')).toHaveCount(0);
});

test('Ano e Mês Pessoal: 05/05 em 1971 e navegação entre anos', async ({ page }) => {
  await gerar(page, 'Teste', '05/05/1950');
  await page.getByRole('link', { name: 'Ano Pessoal' }).click();
  await page.getByLabel('Ano', { exact: true }).fill('1971');
  await page.getByLabel('Ano', { exact: true }).press('Tab');
  await expect(page.getByRole('heading', { name: 'Ano Pessoal 1 em 1971' })).toBeVisible();
  await expect(page.locator('#conteudo')).toContainText('5 + 5 + 9 = 19 → 10 → 1');
  await page.getByRole('button', { name: 'Ano seguinte' }).click();
  await expect(page.getByRole('heading', { name: 'Ano Pessoal 11/2 em 1972' })).toBeVisible();

  await page.getByRole('button', { name: 'Ano anterior' }).click();
  await page.getByRole('link', { name: 'Mês Pessoal' }).click();
  await expect(page.locator('.mes')).toHaveCount(12);
  await page.getByRole('button', { name: /Dezembro/ }).click();
  await expect(page.getByRole('heading', { name: /Dezembro de 1971: Mês Pessoal 4/ })).toBeVisible();
  await expect(page.locator('#conteudo')).toContainText('1 + 12 = 13 → 4');
});

test('dia 18 mostra o título corrigido, e dia 15 mantém o seu', async ({ page }) => {
  await gerar(page, 'Teste', '18/01/2000');
  await page.getByRole('link', { name: 'Interpretação do nascimento' }).click();
  await expect(page.getByRole('heading', { name: 'Nascido no dia 18' })).toBeVisible();
  await expect(page.locator('#conteudo')).toContainText(/líder nato/i);
  await expect(page.locator('#conteudo')).toContainText('Correção editorial');
  await gerar(page, 'Teste', '15/01/2000');
  await page.getByRole('link', { name: 'Interpretação do nascimento' }).click();
  await expect(page.getByRole('heading', { name: 'Nascido no dia 15' })).toBeVisible();
  await expect(page.locator('#conteudo')).toContainText(TEM_TEXTO_DO_LIVRO ? 'gosta de cooperar' : 'Cooperativo');
});

test('Amor, Dinheiro e Sucesso: consulta sem usar a data', async ({ page }) => {
  await page.goto('./#/oraculo');
  await page.getByRole('button', { name: 'Consultar' }).click();
  await expect(page.getByRole('alert')).toContainText('três números');
  await page.getByLabel('Dinheiro').check();
  await page.getByLabel('1º número').selectOption('5');
  await page.getByLabel('2º número').selectOption('9');
  await page.getByLabel('3º número').selectOption('8');
  await page.getByRole('button', { name: 'Consultar' }).click();
  await expect(page.getByRole('heading', { name: 'Dinheiro: número 22' })).toBeVisible();
  await page.getByRole('button', { name: 'Nova consulta' }).click();
  await expect(page.getByRole('heading', { name: 'Dinheiro: número 22' })).toHaveCount(0);
});

test('compatibilidade compara duas pessoas, sem percentuais', async ({ page }) => {
  await page.goto('./#/compatibilidade');
  await page.locator('#compat-nome-a').fill('Anne Louise Jones');
  await page.locator('#compat-data-a').fill('02/04/1946');
  await page.locator('#compat-nome-b').fill('David Weir');
  await page.locator('#compat-data-b').fill('21/04/1942');
  await page.getByRole('button', { name: 'Comparar' }).click();
  const conteudo = page.locator('#conteudo');
  await expect(conteudo).toContainText('Soma das Expressões');
  await expect(conteudo).toContainText('Soma dos Destinos');
  await expect(conteudo).toContainText('3º pináculo');
  expect(await conteudo.innerText()).not.toMatch(/\d+\s?%/);
});

test('o mapa reúne tudo, e o CSS de impressão esconde a navegação', async ({ page }) => {
  await gerar(page);
  await expect(page.getByTestId('nome-mapa')).toHaveText('Anne Louise Jones');
  await expect(page.locator('.secao-relatorio')).toHaveCount(18);
  await expect(page.getByRole('button', { name: 'Imprimir / Salvar como PDF' })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#navegacao')).toBeHidden();
  await expect(page.locator('.topo')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Imprimir / Salvar como PDF' })).toBeHidden();
  const pdf = await page.pdf({ format: 'A4' });
  expect(pdf.length).toBeGreaterThan(5000);
});

test('botão de impressão chama window.print', async ({ page }) => {
  await gerar(page);
  await page.goto('./#/mapa');
  await page.evaluate(() => { window.__impressoes = 0; window.print = () => { window.__impressoes += 1; }; });
  await page.getByRole('button', { name: 'Imprimir / Salvar como PDF' }).click();
  expect(await page.evaluate(() => window.__impressoes)).toBe(1);
});

test('perfis: desativados por padrão; salvar, editar, excluir, excluir tudo', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await gerar(page);
  expect(await page.evaluate(() => Object.keys(localStorage).length)).toBe(0);

  await page.getByRole('link', { name: 'Perfis salvos' }).click();
  await page.getByRole('button', { name: 'Ativar armazenamento local' }).click();
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByTestId('perfil')).toHaveCount(1);

  await page.getByRole('button', { name: 'Editar' }).click();
  await page.getByLabel('Nome completo recebido ao nascer').fill('Anne Jones');
  await page.getByRole('button', { name: 'Gerar mapa numerológico completo' }).click();
  await page.getByRole('link', { name: 'Perfis salvos' }).click();
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByTestId('perfil')).toHaveCount(1);
  await expect(page.getByTestId('perfil')).toContainText('Anne Jones');

  await page.getByRole('button', { name: 'Abrir e recalcular' }).click();
  await expect(page.getByTestId('nome-mapa')).toHaveText('Anne Jones');

  await page.getByRole('link', { name: 'Perfis salvos' }).click();
  await page.getByRole('button', { name: 'Excluir', exact: true }).click();
  await expect(page.getByTestId('perfil')).toHaveCount(0);

  await page.getByRole('button', { name: 'Excluir todos os dados locais' }).click();
  await expect(page.getByRole('button', { name: 'Ativar armazenamento local' })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('numerologia-codex.')).length)).toBe(0);
});

test('privacidade: nenhuma requisição externa durante o uso', async ({ page, baseURL }) => {
  const origem = new URL(baseURL).origin;
  const externas = [];
  page.on('request', (r) => {
    const url = r.url();
    if (!url.startsWith(origem) && !url.startsWith('data:') && !url.startsWith('blob:')) externas.push(url);
  });
  await gerar(page, 'Maria Aparecida da Silva', '15/03/1985');
  await page.goto('./#/mapa');
  await expect(page.getByTestId('nome-mapa')).toBeVisible();
  expect(externas).toEqual([]);
});

test.describe('tema', () => {
  test.use({ colorScheme: 'dark' });

  const cores = (page) => page.evaluate(() => {
    const c = getComputedStyle(document.body);
    return [c.backgroundColor, c.color];
  });

  test('branco com letras pretas por padrão, mesmo com o sistema em modo escuro', async ({ page }) => {
    await page.goto('./');
    expect(await cores(page)).toEqual(['rgb(255, 255, 255)', 'rgb(0, 0, 0)']);
    await expect(page.locator('#tema-claro')).toHaveText('☀️');
    await expect(page.locator('#tema-claro')).toHaveAttribute('aria-pressed', 'true');
  });

  test('a lua deixa preto com letras brancas, o sol volta, e a escolha fica salva', async ({ page }) => {
    await page.goto('./');
    await page.locator('#tema-escuro').click();
    expect(await cores(page)).toEqual(['rgb(0, 0, 0)', 'rgb(255, 255, 255)']);
    await expect(page.locator('#tema-escuro')).toHaveText('🌙');
    await expect(page.locator('#tema-escuro')).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    expect(await cores(page)).toEqual(['rgb(0, 0, 0)', 'rgb(255, 255, 255)']);
    await page.locator('#tema-claro').click();
    expect(await cores(page)).toEqual(['rgb(255, 255, 255)', 'rgb(0, 0, 0)']);
  });

  test('os botões ficam no canto superior direito', async ({ page }) => {
    await page.goto('./');
    const caixa = await page.locator('.tema').boundingBox();
    const largura = page.viewportSize().width;
    expect(caixa.y).toBeLessThan(40);
    expect(caixa.x + caixa.width).toBeGreaterThan(largura - 40);
  });
});

test('relatório: conversão em colunas, sem "(v)", e com Planos de expressão', async ({ page }) => {
  await gerar(page, 'Márcia Aparecida da Silva', '15/03/1985');
  const relatorio = page.locator('#conteudo');
  await expect(relatorio).not.toContainText('(v)');
  await expect(relatorio.getByRole('columnheader', { name: 'Vogais' })).toBeVisible();
  const linha = relatorio.getByRole('row', { name: /Márcia/ });
  await expect(linha.getByRole('cell').nth(1)).toHaveText('A = 1, I = 9, A = 1');
  await expect(linha.getByRole('cell').nth(2)).toHaveText('M = 4, R = 9, C = 3');
  await expect(page.locator('.secao-relatorio h3', { hasText: 'Planos de expressão' })).toHaveCount(1);
  const titulos = await page.locator('.secao-relatorio h3').allInnerTexts();
  titulos.forEach((t, i) => expect(t.startsWith(`${i + 1}. `), t).toBe(true));
  await page.getByRole('link', { name: 'Planos de expressão' }).click();
  await expect(page.getByRole('heading', { name: 'Planos de expressão' })).toBeVisible();
});

test('relatório traz a leitura do número principal e a reduzida', async ({ page }) => {
  await gerar(page, 'Teste', '04/03/1930');
  await page.goto('./#/mapa');
  await expect(page.getByRole('heading', { name: /Destino 11/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Destino 2/ })).toBeVisible();
});

test.describe('celular', () => {
  test.use({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

  test('do formulário ao relatório, sem rolagem lateral, com áreas de toque adequadas', async ({ page }) => {
    await gerar(page, 'Márcia Aparecida da Silva', '15/03/1985');
    for (const seletor of ['#tema-claro', '#tema-escuro', '#botao-menu']) {
      const caixa = await page.locator(seletor).boundingBox();
      expect(caixa.height, seletor).toBeGreaterThanOrEqual(44);
      expect(caixa.x + caixa.width, seletor).toBeLessThanOrEqual(360);
    }
    await expect(page.getByTestId('nome-mapa')).toBeInViewport();
    await expect(page.locator('.secao-relatorio')).toHaveCount(18);
    await expect(page.getByRole('button', { name: 'Imprimir / Salvar como PDF' })).toBeInViewport();
    const excesso = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(excesso).toBeLessThanOrEqual(0);
    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect(page.locator('.topo')).toBeInViewport();
  });

  test('o menu Seções abre, navega e fecha', async ({ page }) => {
    await gerar(page);
    await expect(page.locator('#navegacao')).toBeHidden();
    await page.locator('#botao-menu').tap();
    await page.getByRole('link', { name: 'Quadro 3×3' }).tap();
    await expect(page.getByRole('heading', { name: 'Quadro numerológico 3×3' })).toBeVisible();
    await expect(page.locator('#navegacao')).toBeHidden();
  });
});

for (const [nome, viewport] of [['celular pequeno', { width: 320, height: 640 }], ['celular', { width: 360, height: 740 }], ['tablet', { width: 768, height: 1024 }], ['desktop', { width: 1366, height: 800 }]]) {
  test(`sem rolagem horizontal da página em ${nome}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await gerar(page, 'Maria Aparecida da Silva', '15/03/1985');
    for (const id of ['mapa', 'nome', 'planos', 'quadro', 'pinaculos', 'ciclos', 'mes', 'regras', 'inconsistencias', 'compatibilidade']) {
      await page.goto(`./#/${id}`);
      await page.locator('#conteudo h1, #conteudo h2').first().waitFor();
      const excesso = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(excesso, `seção ${id}`).toBeLessThanOrEqual(0);
    }
  });
}

test('navegação por teclado alcança o formulário e gera o mapa', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Nome completo recebido ao nascer').focus();
  await page.keyboard.type('Ana');
  await page.keyboard.press('Tab');
  await page.keyboard.type('01012000');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('nome-mapa')).toHaveText('Ana');
});

test('relatório explica o quadro, cada barra do tempo, o ano e os meses', async ({ page }) => {
  await gerar(page, 'Maria Aparecida', '10/09/1990');
  const titulos = await page.locator('.secao-relatorio h3').allInnerTexts();
  const posicao = (t) => titulos.findIndex((x) => x.includes(t));
  expect(posicao('Quatro pináculos')).toBeLessThan(posicao('Quatro desafios'));
  expect(posicao('Quatro desafios')).toBeLessThan(posicao('Três ciclos'));

  const secao = (t) => page.locator('.secao-relatorio', { has: page.getByRole('heading', { name: t }) });
  const quadro = secao('Quadro 3×3');
  await expect(quadro.locator('h4', { hasText: 'Como ler o quadro' })).toBeVisible();
  await expect(quadro.locator('h4', { hasText: 'Soma da data' })).toBeVisible();
  for (const [t, itens] of [['Quatro pináculos', 4], ['Quatro desafios', 4], ['Três ciclos', 3]]) {
    await expect(secao(t).locator('.tempo-faixa')).toHaveCount(1);
    await expect(secao(t).locator('.tempo-seg')).toHaveCount(itens);
    await expect(secao(t).locator('.fase-atual')).toBeVisible();
    await expect(secao(t).locator('h4')).toHaveCount(itens);
  }
  const meses = secao('Meses Pessoais');
  await expect(meses.locator('table tbody tr')).toHaveCount(12);
  const janeiro = meses.locator('h4', { hasText: /janeiro/ });
  await expect(janeiro).toHaveCount(1);
  await expect(meses.locator('.interp').nth(1)).toBeVisible();
});

test('editar o formulário não altera o mapa até gerar de novo', async ({ page }) => {
  await gerar(page);
  await page.getByRole('link', { name: 'Novo mapa' }).click();
  await page.getByLabel('Nome completo recebido ao nascer').fill('Outro1');
  await page.getByRole('link', { name: 'Ano Pessoal' }).click();
  await page.getByRole('button', { name: 'Ano seguinte' }).click();
  await page.getByRole('link', { name: 'Mapa completo' }).click();
  await expect(page.getByTestId('nome-mapa')).toHaveText('Anne Louise Jones');
});

test('mostra o texto literal do livro, sem resumo, com parágrafos e o dia 18 corrigido', async ({ page }) => {
  test.skip(!TEM_TEXTO_DO_LIVRO, 'texto do livro não importado');
  await gerar(page, 'Teste', '18/01/2000');
  await page.getByRole('link', { name: 'Interpretação do nascimento' }).click();
  const conteudo = page.locator('#conteudo');
  await expect(conteudo).toContainText('Você é independente, eficiente, um líder nato.');
  await expect(conteudo).not.toContainText('como 38');
  await expect(conteudo).not.toContainText('Resumo');
  expect(await page.locator('.interp.literal').first().locator('p:not(.fonte, .nota-editorial)').count()).toBeGreaterThan(1);
});

test('todas as telas usam só texto do livro, sem nenhum resumo', async ({ page }) => {
  test.skip(!TEM_TEXTO_DO_LIVRO, 'texto do livro não importado');
  await gerar(page, 'David Weir', '11/05/1975');
  for (const id of ['mapa', 'aptidoes', 'planos', 'nascimento', 'quadro', 'pinaculos', 'ciclos', 'ano', 'mes']) {
    await page.goto(`./#/${id}`);
    await page.locator('#conteudo h2').first().waitFor();
    await expect(page.locator('#conteudo'), id).not.toContainText('Resumo');
    await conferirLeitura(page);
  }
});

test('as notas, as regras e todos os diálogos também ficam sem citações de página', async ({ page }) => {
  await gerar(page, 'Teste', '18/01/2000');
  for (const id of ['ambicao', 'personalidade', 'expressao', 'destino', 'realidade', 'dia', 'elemento']) {
    await page.locator(`[data-numero="${id}"]`).click();
    await expect(page.locator('#detalhe')).not.toContainText(/\bp\.\s*\d|\bpáginas?\s*\d/iu);
    await conferirLeitura(page);
    await page.keyboard.press('Escape');
  }
  for (const id of ['nome', 'frequencias', 'regras', 'inconsistencias', 'oraculo', 'compatibilidade']) {
    await page.goto(`./#/${id}`);
    await page.locator('#conteudo h2').first().waitFor();
    await conferirLeitura(page);
  }
});

test('as 33 respostas de Amor, Dinheiro e Sucesso reproduzem os textos do PDF', async ({ page }) => {
  const opcoes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22];
  const reduzir = (n) => {
    while (n > 9 && n !== 11 && n !== 22) n = [...String(n)].reduce((s, d) => s + Number(d), 0);
    return n;
  };
  for (const categoria of ['amor', 'dinheiro', 'sucesso']) {
    await page.goto('./#/oraculo');
    await page.getByLabel({ amor: 'Amor', dinheiro: 'Dinheiro', sucesso: 'Sucesso' }[categoria], { exact: true }).check();
    for (const n of opcoes) {
      const trios = opcoes.flatMap((a) => opcoes.flatMap((b) => opcoes.map((c) => [a, b, c])));
      const trio = trios.find((t) => reduzir(t.reduce((s, v) => s + v, 0)) === n);
      for (let i = 0; i < 3; i++) await page.getByLabel(`${i + 1}º número`).selectOption(String(trio[i]));
      await page.getByRole('button', { name: 'Consultar', exact: true }).click();
      await expect(page.locator(`[data-texto="oraculo.${categoria}.${n}"]`)).toBeVisible();
      await conferirLeitura(page);
    }
  }
});

test('os 31 dias de nascimento recebem a passagem correspondente, inclusive 15 e 18', async ({ page }) => {
  for (let dia = 1; dia <= 31; dia++) {
    await gerar(page, 'Maria Silva', `${String(dia).padStart(2, '0')}/01/2000`);
    await page.goto('./#/nascimento');
    await expect(page.locator(`[data-texto="dia.${dia}"]`)).toBeVisible();
    await conferirLeitura(page);
  }
});

test('abre com duplo clique: index.html pela pasta, com estilos e funcionando', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  await page.goto(new URL('../index.html', import.meta.url).href);
  await expect(page.locator('.cartao').first()).toHaveCSS('border-top-style', 'solid');
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('.topo')).display)).toBe('flex');
  await page.getByLabel('Nome completo recebido ao nascer').fill('Anne Louise Jones');
  await page.getByLabel('Data de nascimento').fill('02/04/1946');
  await page.getByRole('button', { name: 'Gerar mapa numerológico completo' }).click();
  await expect(valor(page, 'ambicao')).toHaveText('22/4');
  await expect(page.locator('.secao-relatorio')).toHaveCount(18);
  if (TEM_TEXTO_DO_LIVRO) {
    await expect(page.locator('.interp.literal').first()).toBeVisible();
    await expect(page.locator('#conteudo')).not.toContainText('Resumo');
  }
  expect(erros).toEqual([]);
});
