/**
 * Motor de redução. Não existe uma redução universal no livro: cada operação
 * escolhe entre reduzirSimples (sempre até um dígito, registrando o 11/22 que
 * apareceu no caminho) e reduzirComMestres (para em 11 ou 22).
 */
export const NUMEROS_MESTRES = Object.freeze([11, 22]);

export const ehMestre = (n) => n === 11 || n === 22;

function exigirInteiroNaoNegativo(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`Esperado inteiro não negativo, recebido: ${n}`);
  }
}

export function somaDigitos(n) {
  exigirInteiroNaoNegativo(n);
  let soma = 0;
  for (const digito of String(n)) soma += Number(digito);
  return soma;
}

export function somar(numeros) {
  return numeros.reduce((total, n) => total + n, 0);
}

/** Reduz até um dígito. 29 → 11 → 2, com mestre = 11 registrado. */
export function reduzirSimples(n) {
  exigirInteiroNaoNegativo(n);
  const caminho = [n];
  let atual = n;
  while (atual > 9) {
    atual = somaDigitos(atual);
    caminho.push(atual);
  }
  return {
    entrada: n,
    caminho,
    valor: atual,
    reduzido: atual,
    mestre: caminho.find(ehMestre) ?? null,
  };
}

/** Reduz até um dígito, mas para em 11 ou 22. 29 → 11, com reduzido = 2. */
export function reduzirComMestres(n) {
  exigirInteiroNaoNegativo(n);
  const caminho = [n];
  let atual = n;
  while (atual > 9 && !ehMestre(atual)) {
    atual = somaDigitos(atual);
    caminho.push(atual);
  }
  return {
    entrada: n,
    caminho,
    valor: atual,
    reduzido: atual > 9 ? somaDigitos(atual) : atual,
    mestre: ehMestre(atual) ? atual : null,
  };
}

/** Forma de leitura usada pelo livro: "22/4", "11/2" ou apenas "7". */
export function exibicao(reducao) {
  return reducao.mestre ? `${reducao.mestre}/${reducao.reduzido}` : String(reducao.valor);
}

export function textoCaminho(reducao) {
  return reducao.caminho.join(' → ');
}
