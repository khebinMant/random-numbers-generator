# Calculadora de Algoritmo Congruencial Multiplicativo

Una aplicación web React + Next.js que implementa el algoritmo congruencial multiplicativo con las condiciones de Banks Carson, Nelson y Nicol.

## 🚀 Características

- ✅ **Interfaz intuitiva**: Formulario fácil de usar para ingresar parámetros g, k, y X₀
- ✅ **Validación automática**: Verifica que los parámetros cumplan las condiciones requeridas
- ✅ **Cálculo automático**: Calcula m = 2^g, a y N = 2^(g-2) automáticamente
- ✅ **Generación de secuencias**: Muestra la secuencia de números pseudoaleatorios generados
- ✅ **Responsive**: Diseño adaptativo con Tailwind CSS
- ✅ **Listo para Netlify**: Configurado para despliegue automático

## Condiciones del Algoritmo

Según Banks Carson, Nelson y Nicol, para que el algoritmo congruencial multiplicativo alcance su máximo periodo **N**, debe cumplir:

- **m = 2^g** (donde g es un entero positivo)
- **a = 3 + 8k** o **a = 5 + 8k** (donde k = 0, 1, 2, 3, ...)
- **X₀ debe ser un número impar**
- **Período máximo**: N = m/4 = 2^(g-2)

## Fórmula del Algoritmo

```
Xₙ₊₁ = (a × Xₙ) mod m
```

Donde:
- Xₙ es el número actual en la secuencia
- a es el multiplicador
- m es el módulo
- Xₙ₊₁ es el siguiente número en la secuencia

## Instalación y Uso

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. Clona o descarga este repositorio
2. Navega al directorio del proyecto:
   ```bash
   cd calculadora-random
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecución

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Construcción para producción

```bash
npm run build
npm start
```

## Uso de la Aplicación

1. **Ingresa los parámetros**:
   - **g**: Un número entero positivo
   - **k**: Un número entero (0, 1, 2, 3, ...)
   - **X₀**: El valor inicial (debe ser un número impar)

2. **Selecciona la fórmula para 'a'**:
   - a = 3 + 8k
   - a = 5 + 8k

3. **Observa los parámetros calculados**:
   - m = 2^g
   - a = 3 + 8k o 5 + 8k
   - N = 2^(g-2) (período máximo)

4. **Genera la secuencia**: Haz clic en "Generar Secuencia" para ver los números pseudoaleatorios

5. **Analiza los resultados**: La aplicación mostrará la secuencia generada y información sobre el período detectado

## Ejemplos de Uso

### Ejemplo 1
- g = 5, k = 1, X₀ = 7
- m = 2⁵ = 32
- a = 3 + 8(1) = 11
- N = 2⁵⁻² = 8
- Secuencia: 7, 23, 29, 31, 21, 7, ... (período = 5)

### Ejemplo 2
- g = 4, k = 0, X₀ = 3
- m = 2⁴ = 16
- a = 5 + 8(0) = 5
- N = 2⁴⁻² = 4
- Secuencia: 3, 15, 11, 7, 3, ... (período = 4)

## Tecnologías Utilizadas

- **React 18**: Biblioteca de JavaScript para construir interfaces de usuario
- **Next.js 14**: Framework de React para aplicaciones web
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework de CSS para diseño rápido
- **ESLint**: Herramienta de análisis de código estático

## Estructura del Proyecto

```
calculadora-random/
├── src/
│   └── app/
│       ├── globals.css          # Estilos globales
│       ├── layout.tsx           # Layout principal
│       └── page.tsx             # Componente principal
├── .github/
│   └── copilot-instructions.md  # Instrucciones del proyecto
├── package.json                 # Dependencias y scripts
├── tsconfig.json               # Configuración de TypeScript
├── tailwind.config.js          # Configuración de Tailwind CSS
├── next.config.js              # Configuración de Next.js
└── README.md                   # Este archivo
```

## Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Referencias

- Banks, Carson, Nelson y Nicol - Condiciones para el algoritmo congruencial multiplicativo
- "The Art of Computer Programming, Volume 2" por Donald E. Knuth
- Documentación de Next.js: https://nextjs.org/docs
- Documentación de React: https://reactjs.org/docs