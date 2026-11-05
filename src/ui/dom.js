/**
 * Único ponto de criação de elementos. Textos sempre viram nós de texto: o
 * aplicativo não usa innerHTML, o que impede a injeção de HTML por nomes digitados.
 */
export function h(tag, props = {}, ...filhos) {
  const el = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props ?? {})) {
    if (valor === null || valor === undefined || valor === false) continue;
    if (chave.startsWith('on') && typeof valor === 'function') {
      // Converte onClick/onInput em eventos reais, sem criar atributos JavaScript no HTML.
      el.addEventListener(chave.slice(2).toLowerCase(), valor);
    } else if (chave === 'class') {
      el.className = valor;
    } else if (chave === 'value') {
      // Controles refletem o valor atual pela propriedade; um atributo pode ficar desatualizado.
      el.value = valor;
    } else if (chave === 'checked' || chave === 'selected' || chave === 'open') {
      el[chave] = Boolean(valor);
    } else if (chave === 'style') {
      // Aceita tanto propriedades CSS comuns quanto variáveis como --rotulo.
      for (const [prop, val] of Object.entries(valor)) el.style.setProperty(prop, val);
    } else {
      el.setAttribute(chave, valor === true ? '' : String(valor));
    }
  }
  anexar(el, filhos);
  return el;
}

/** Aceita filhos aninhados em arrays e ignora condicionais vazias usados pelos componentes. */
export function anexar(el, filhos) {
  for (const filho of filhos.flat(Infinity)) {
    if (filho === null || filho === undefined || filho === false) continue;
    // Elementos prontos são anexados; textos nunca são interpretados como marcação HTML.
    el.append(filho instanceof Node ? filho : document.createTextNode(String(filho)));
  }
}

/** Esvazia um contêiner antes de reconstruí-lo com os dados atuais. */
export function limpar(el) {
  el.replaceChildren();
}
