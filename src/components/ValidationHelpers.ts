// Prueba de independencia: correlación de Pearson entre u_k y u_{k+1}
export function pruebaIndependencia(normalizados: number[]): boolean {
  if (normalizados.length < 2) return true;
  const n = normalizados.length - 1;
  const x = normalizados.slice(0, n);
  const y = normalizados.slice(1);
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - meanX) * (y[i] - meanY);
    denX += (x[i] - meanX) ** 2;
    denY += (y[i] - meanY) ** 2;
  }
  const corr = num / Math.sqrt(denX * denY);
  // Considerar independiente si |corr| < 0.1
  return Math.abs(corr) < 0.1;
}

// Prueba de uniformidad: chi-cuadrado en 10 intervalos
export function pruebaUniformidad(normalizados: number[]): boolean {
  const n = normalizados.length;
  if (n === 0) return true;
  const k = 10;
  const frec = Array(k).fill(0);
  for (let u of normalizados) {
    let idx = Math.floor(u * k);
    if (idx === k) idx = k - 1;
    frec[idx]++;
  }
  const esperado = n / k;
  let chi2 = 0;
  for (let i = 0; i < k; i++) {
    chi2 += ((frec[i] - esperado) ** 2) / esperado;
  }
  // Valor crítico chi2 para k-1=9 y alfa=0.05 ≈ 16.92
  return chi2 < 16.92;
}
