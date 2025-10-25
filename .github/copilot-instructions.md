# Calculadora de Algoritmo Congruencial Multiplicativo

Este proyecto es una aplicación web React + Next.js que implementa el algoritmo congruencial multiplicativo con las condiciones de Banks Carson, Nelson y Nicol.

## Funcionalidad

La aplicación permite:
- Ingresar parámetros g, k, y X₀
- Calcular automáticamente m = 2^g
- Calcular a = 3 + 8k o a = 5 + 8k
- Calcular el período máximo N = 2^(g-2)
- Validar que X₀ sea impar
- Mostrar la secuencia de números generados

## Condiciones del algoritmo

- m = 2^g
- a = 3 + 8k o a = 5 + 8k
- X₀ debe ser impar
- Período máximo: N = m/4 = 2^(g-2)