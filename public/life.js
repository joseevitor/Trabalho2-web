// ============================================================
// LÓGICA DO JOGO (não mexe com Vue nem com a tela)
// Deixei separado da interface como o professor pediu.
// A grade é uma matriz n x n: true = viva, false = morta
// ============================================================

// cria uma matriz n x n com todo mundo morto
function criarMatriz(n) {
  const matriz = [];
  for (let i = 0; i < n; i++) {
    const linha = [];
    for (let j = 0; j < n; j++) {
      linha.push(false);
    }
    matriz.push(linha);
  }
  return matriz;
}

// conta quantas vizinhas vivas a célula (i, j) tem
// (olha as 8 em volta; o que sai da grade é ignorado, sem dar a volta)
function contarVizinhas(matriz, i, j) {
  const n = matriz.length;
  let total = 0;

  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if (di === 0 && dj === 0) continue; // a própria célula não conta

      const ni = i + di;
      const nj = j + dj;

      // só conta se estiver dentro da grade (tratamento da borda)
      if (ni >= 0 && ni < n && nj >= 0 && nj < n) {
        if (matriz[ni][nj]) total++;
      }
    }
  }
  return total;
}

// calcula a próxima geração numa matriz NOVA.
// Assim as mudanças não atrapalham o cálculo das outras células
// da mesma geração (por isso são duas matrizes).
function proximaGeracao(atual) {
  const n = atual.length;
  const proxima = criarMatriz(n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const vizinhas = contarVizinhas(atual, i, j);

      if (atual[i][j]) {
        // célula viva: sobrevive com 2 ou 3, senão morre
        // (menos de 2 = isolamento, mais de 3 = superpopulação)
        proxima[i][j] = (vizinhas === 2 || vizinhas === 3);
      } else {
        // célula morta: nasce se tiver exatamente 3 vizinhas
        proxima[i][j] = (vizinhas === 3);
      }
    }
  }
  return proxima;
}

// conta quantas células vivas tem na matriz
function contarVivas(matriz) {
  let total = 0;
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (matriz[i][j]) total++;
    }
  }
  return total;
}

// isso aqui é só pra eu conseguir testar no node (no navegador é ignorado)
if (typeof module !== 'undefined') {
  module.exports = { criarMatriz, contarVizinhas, proximaGeracao, contarVivas };
}
