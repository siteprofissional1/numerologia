/**
 * Único ponto de criação de elementos. Textos sempre viram nós de texto: o
 * aplicativo não usa innerHTML, o que impede a injeção de HTML por nomes digitados.
 */
export function h(tag, props = {}, ...filhos) {
  const el = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props ?? {})) {
    if (valor === null || valor === undefined || valor === false) continue;
    if (chave.startsWith('on') && typeof valor === 'function') {
      el.addEventListener(chave.slice(2).toLowerCase(), valor);
    } else if (chave === 'class') {
      el.className = valor;
    } else if (chave === 'value') {
      el.value = valor;
    } else if (chave === 'checked' || chave === 'selected' || chave === 'open') {
      el[chave] = Boolean(valor);
    } else if (chave === 'style') {
      for (const [prop, val] of Object.entries(valor)) el.style.setProperty(prop, val);
    } else {
      el.setAttribute(chave, valor === true ? '' : String(valor));
    }
  }
  anexar(el, filhos);
  return el;
}

export function anexar(el, filhos) {
  for (const filho of filhos.flat(Infinity)) {
    if (filho === null || filho === undefined || filho === false) continue;
    el.append(filho instanceof Node ? filho : document.createTextNode(String(filho)));
  }
}

export function limpar(el) {
  el.replaceChildren();
}
