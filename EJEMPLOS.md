# Casos de Prueba y Ejemplos

## Generador Congruencial Multiplicativo

### Ejemplo 1: Configuración básica
- **g = 5**
- **k = 1**
- **X₀ = 7**
- **Opción: a = 3 + 8k**

**Resultado:**
- m = 2^5 = 32
- a = 3 + 8(1) = 11
- N = 2^(5-2) = 8
- Fórmula: X_{n+1} = (11 × X_n) mod 32
- Secuencia esperada: 7, 13, 15, 5, 23, 29, 31, 21, 7...

### Ejemplo 2: Usando a = 5 + 8k
- **g = 4**
- **k = 0**
- **X₀ = 3**
- **Opción: a = 5 + 8k**

**Resultado:**
- m = 2^4 = 16
- a = 5 + 8(0) = 5
- N = 2^(4-2) = 4
- Secuencia esperada: 3, 15, 11, 7, 3...

## Generador Congruencial Lineal (LCG)

### Ejemplo 1: Configuración básica
- **X₀ = 1**
- **k = 1**
- **g = 4**
- **c = 1**
- **N = 10**

**Resultado:**
- a = 1 + 4(1) = 5
- m = 2^4 = 16
- Fórmula: X_{n+1} = (5 × X_n + 1) mod 16
- Secuencia esperada: 6, 15, 12, 13, 2, 11, 8, 9, 14, 7

### Ejemplo 2: Secuencia más larga
- **X₀ = 3**
- **k = 2**
- **g = 5**
- **c = 7**
- **N = 15**

**Resultado:**
- a = 1 + 4(2) = 9
- m = 2^5 = 32
- Fórmula: X_{n+1} = (9 × X_n + 7) mod 32

## Casos de Error - Validaciones

### Multiplicativo - Errores comunes
1. **X₀ par**: X₀ = 4 → Error: "X₀ debe ser un número impar"
2. **g no positivo**: g = 0 → Error: "g debe ser un entero positivo"

### LCG - Errores comunes
1. **X₀ fuera de rango**: g=4, X₀=20 → Error: "X₀ debe estar en el rango 0 ≤ X₀ < 16"
2. **c fuera de rango**: g=3, c=10 → Error: "c debe estar en el rango 0 ≤ c < 8"
3. **N fuera de rango**: N=15000 → Error: "N debe estar en el rango 1 ≤ N ≤ 10,000"
4. **k negativo**: k=-1 → Error: "k debe ser un entero ≥ 0"
5. **g inválido**: g=0 → Error: "g debe ser un entero ≥ 1"

## Verificación de Gráficas (LCG)

### Casos para probar visualización
1. **Secuencia pequeña** (N=5): Verifica que las gráficas se muestren correctamente
2. **Secuencia mediana** (N=50): Prueba la legibilidad de etiquetas
3. **Secuencia grande** (N=1000): Verifica rendimiento de renderizado

### Estadísticas esperables
- **Mínimo**: Debe ser ≥ 0
- **Máximo**: Debe ser < m
- **Únicos**: Cantidad de valores distintos en la secuencia
- **Promedio**: (suma de valores) / N

## Pruebas de Interfaz

### Navegación por pestañas
1. Clic en "Congruencial Multiplicativo" → Debe mostrar formulario con g, k, X₀
2. Clic en "Congruencial Lineal" → Debe mostrar formulario con X₀, k, g, c, N
3. Alternar entre pestañas → Los datos deben mantenerse independientes

### Responsividad
1. **Desktop**: Formularios en grid, gráficas lado a lado
2. **Tablet**: Formularios apilados, gráficas apiladas
3. **Mobile**: Todo en columna única

## Criterios de Evaluación Completados

### ✅ Validación de entradas (0.5 pts)
- Conversión a entero con manejo de errores
- Verificación de rangos con mensajes claros
- Validaciones específicas por algoritmo

### ✅ Cálculo correcto (1.0 pts)
- **Multiplicativo**: a, m, N calculados según especificaciones
- **LCG**: a = 1 + 4k, m = 2^g, secuencia con fórmula correcta
- Lista numerada de N valores mostrada

### ✅ Gráfica de números aleatorios (0.5 pts)
- Gráfica de línea: evolución de la secuencia
- Gráfica de barras: distribución de valores
- Estadísticas: mínimo, máximo, promedio, únicos
- Interactividad con Chart.js

## Entrega

### Archivos incluidos
- ✅ Código fuente completo en TypeScript/React
- ✅ README.md con instrucciones detalladas
- ✅ Ejemplos y casos de prueba (este archivo)
- ✅ Configuración para despliegue (netlify.toml)

### Sin archivos innecesarios
- ✅ .gitignore configurado
- ✅ node_modules excluido
- ✅ Archivos de build excluidos