'use client'

import { useState } from 'react'
import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function GeneradorLCG() {
  const [inputs, setInputs] = useState({
    a: 5,       // multiplicador
    c: 1,       // incremento
    m: 16,      // módulo (se calcula automáticamente)
    semilla: 1, // semilla (X₀)
    cantidad: 10 // cantidad de números a generar
  })
  
  const [results, setResults] = useState({
    numeros: [] as number[],
    normalizados: [] as number[],
    errors: [] as string[],
    generado: false
  })
  // Estado para validación
  const [validacion, setValidacion] = useState({
    independencia: null as null | boolean,
    uniformidad: null as null | boolean,
    valido: null as null | boolean
  })
  // Prueba de independencia: correlación de Pearson entre u_k y u_{k+1}
  function pruebaIndependencia(normalizados: number[]): boolean {
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
  function pruebaUniformidad(normalizados: number[]): boolean {
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
  
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Función helper para validar si un número es potencia de 2
  const esPotenciaDe2 = (n: number): boolean => {
    return n > 0 && (n & (n - 1)) === 0
  }

  // Función para calcular el módulo automáticamente basado en la cantidad
  const calcularModulo = (cantidad: number): number => {
    if (cantidad <= 0) return 8
    const g = Math.ceil(Math.log2(cantidad))
    return Math.pow(2, g)
  }

  // Función para calcular g basado en la cantidad
  const calcularG = (cantidad: number): number => {
    if (cantidad <= 0) return 3
    return Math.ceil(Math.log2(cantidad))
  }

  // Actualizar módulo automáticamente cuando cambia la cantidad
  const handleCantidadChange = (nuevaCantidad: number) => {
    const nuevoModulo = calcularModulo(nuevaCantidad)
    setInputs(prev => ({ 
      ...prev, 
      cantidad: nuevaCantidad,
      m: nuevoModulo,
      // Ajustar semilla si es mayor o igual al nuevo módulo
      semilla: prev.semilla >= nuevoModulo ? 1 : prev.semilla
    }))
  }

  // CRITERIO 1: Validación completa de entradas
  const validarEntradas = () => {
    const errors: string[] = []
    
    // Validar que todos los parámetros sean enteros
    if (!Number.isInteger(inputs.a)) errors.push('El multiplicador (a) debe ser un número entero')
    if (!Number.isInteger(inputs.c)) errors.push('El incremento (c) debe ser un número entero')
    if (!Number.isInteger(inputs.m)) errors.push('El módulo (m) debe ser un número entero')
    if (!Number.isInteger(inputs.semilla)) errors.push('La semilla debe ser un número entero')
    if (!Number.isInteger(inputs.cantidad)) errors.push('La cantidad debe ser un número entero')
    
    // Validar que el módulo sea una potencia de 2 válida
    if (!esPotenciaDe2(inputs.m) || inputs.m < 8) {
      errors.push('El módulo (m) debe ser una potencia de 2 mayor o igual a 8')
    }
    
    // Validar que la semilla cumpla 0 ≤ semilla < módulo
    if (inputs.semilla < 0 || inputs.semilla >= inputs.m) {
      errors.push(`La semilla debe cumplir: 0 ≤ semilla < ${inputs.m}`)
    }
    
    if (inputs.cantidad < 1) errors.push('La cantidad debe ser mayor que 0')
    
    return errors
  }

  // CRITERIO 2: Generación correcta del LCG
  const generar = () => {
    const errors = validarEntradas()
    
    if (errors.length > 0) {
      setResults(prev => ({ ...prev, errors, generado: false }))
      return
    }

    // Confirmación manual para más de 100 números
    if (inputs.cantidad > 100 && !showConfirmation) {
      setShowConfirmation(true)
      return
    }

    // Implementar LCG: Xₖ₊₁ = (a * Xₖ + c) mod m
    const numeros: number[] = []
    const normalizados: number[] = []
    
    let x = inputs.semilla
    
    for (let i = 0; i < inputs.cantidad; i++) {
      x = (inputs.a * x + inputs.c) % inputs.m
      numeros.push(x)
      // Normalización: uₖ = Xₖ / m
      normalizados.push(x / inputs.m)
    }

    // Validaciones
    const independencia = pruebaIndependencia(normalizados);
    const uniformidad = pruebaUniformidad(normalizados);
    const valido = independencia && uniformidad;
    setResults({
      numeros,
      normalizados,
      errors: [],
      generado: true
    })
    setValidacion({ independencia, uniformidad, valido });
    setShowConfirmation(false)
  }

  // CRITERIO 4: Reinicio y funcionalidad
  const reiniciar = () => {
    const cantidadDefault = 10
    const moduloDefault = calcularModulo(cantidadDefault)
    
    setInputs({
      a: 5,
      c: 1,
      m: moduloDefault,
      semilla: 1,
      cantidad: cantidadDefault
    })
    setResults({
      numeros: [],
      normalizados: [],
      errors: [],
      generado: false
    })
    setValidacion({ independencia: null, uniformidad: null, valido: null });
    setShowConfirmation(false)
  }

  // CRITERIO 3: Datos para el gráfico de dispersión
  const scatterData = {
    datasets: [{
      label: 'Valores Normalizados (uₖ = Xₖ / m)',
      data: results.normalizados.map((val, index) => ({
        x: index + 1, // índice
        y: val        // valor normalizado
      })),
      backgroundColor: 'rgba(75, 85, 99, 0.7)',
      borderColor: 'rgb(55, 65, 81)',
      borderWidth: 2,
      pointRadius: 5,
    }]
  }

  const scatterOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Diagrama de Dispersión: Índice vs Valor Normalizado'
      },
      legend: {
        display: true
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Índice'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valor Normalizado (uₖ = Xₖ / m)'
        },
        min: 0,
        max: 1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Generador de Números Aleatorios (LCG)
          </h1>
          <p className="text-gray-600">
            Generador Congruencial Lineal: X<sub>k+1</sub> = (a × X<sub>k</sub> + c) mod m
          </p>
        </div>

        {/* Layout Principal: Parámetros izquierda, Resultados derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Columna Izquierda: Parámetros del LCG (Vertical) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-200 rounded-lg shadow-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Parámetros del LCG</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Multiplicador (a)
                  </label>
                  <input
                    type="number"
                    value={inputs.a}
                    onChange={(e) => setInputs(prev => ({ ...prev, a: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                    step="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incremento (c)
                  </label>
                  <input
                    type="number"
                    value={inputs.c}
                    onChange={(e) => setInputs(prev => ({ ...prev, c: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                    step="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Módulo (m) = 2^g
                  </label>
                  <select
                    value={inputs.m}
                    onChange={(e) => setInputs(prev => ({ ...prev, m: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                  >
                    {[8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384].map((value) => (
                      <option key={value} value={value}>
                        {value} (2^{Math.log2(value)}) {value === calcularModulo(inputs.cantidad) ? '← Auto' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-600 mt-1">
                    Auto: {calcularModulo(inputs.cantidad)} | g = {calcularG(inputs.cantidad)} | m = 2^{calcularG(inputs.cantidad)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semilla (X₀)
                  </label>
                  <input
                    type="number"
                    value={inputs.semilla}
                    onChange={(e) => setInputs(prev => ({ ...prev, semilla: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                    min="0"
                    step="1"
                  />
                  <p className="text-xs text-gray-600 mt-1">0 ≤ semilla &lt; m</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={inputs.cantidad}
                    onChange={(e) => handleCantidadChange(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                    min="1"
                    step="1"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Números a generar (g = {calcularG(inputs.cantidad)})
                  </p>
                </div>
              </div>

              {/* CRITERIO 1: Errores de validación */}
              {results.errors.length > 0 && (
                <div className="bg-red-100 border border-red-300 rounded-md p-3 mt-4">
                  <h3 className="text-red-800 font-medium mb-2 text-sm">Errores:</h3>
                  <ul className="text-red-700 text-xs">
                    {results.errors.map((error, index) => (
                      <li key={index} className="mb-1">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CRITERIO 1: Confirmación para más de 100 números */}
              {showConfirmation && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 mt-4">
                  <h3 className="text-yellow-800 font-medium mb-2 text-sm">Confirmación requerida</h3>
                  <p className="text-yellow-700 text-xs mb-3">
                    ¿Generar {inputs.cantidad} números? (más de 100)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={generar}
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-800"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={generar}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                >
                  Generar Números
                </button>
                <button
                  onClick={reiniciar}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resultados */}
          <div className="lg:col-span-2">
            {results.generado && results.numeros.length > 0 ? (
              <div className="space-y-4">
                {/* Indicador de validación */}
                <div className={`rounded-md p-3 mb-2 ${validacion.valido === null ? '' : validacion.valido ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
                  <h3 className="font-medium text-sm mb-1 text-gray-800">Validación de los números generados</h3>
                  <ul className="text-xs text-gray-700">
                    <li>
                      <strong>Independencia:</strong> {validacion.independencia === null ? '-' : validacion.independencia ? '✔️' : '❌'}
                      {validacion.independencia === false && <span className="ml-2 text-red-600">(Correlación detectada)</span>}
                    </li>
                    <li>
                      <strong>Uniformidad:</strong> {validacion.uniformidad === null ? '-' : validacion.uniformidad ? '✔️' : '❌'}
                      {validacion.uniformidad === false && <span className="ml-2 text-red-600">(No uniforme)</span>}
                    </li>
                  </ul>
                  <div className="mt-2 font-bold text-lg">
                    {validacion.valido === null ? '' : validacion.valido ? <span className="text-green-700">Válidos</span> : <span className="text-red-700">No válidos</span>}
                  </div>
                  {/* Botón de regenerar si no son válidos */}
                  {validacion.valido === false && (
                    <button
                      onClick={generar}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Regenerar Números
                    </button>
                  )}
                </div>
                {/* ...existing code... */}
                {/* Fórmula utilizada */}
                <div className="bg-gray-400 border border-gray-500 rounded-md p-3">
                  <p className="text-gray-800 font-medium text-sm">
                    LCG: X<sub>k+1</sub> = ({inputs.a} × X<sub>k</sub> + {inputs.c}) mod {inputs.m}
                  </p>
                  <p className="text-gray-700 text-xs mt-1">
                    Cantidad: {inputs.cantidad} → g = {calcularG(inputs.cantidad)} → m = 2^{calcularG(inputs.cantidad)} = {calcularModulo(inputs.cantidad)}
                  </p>
                  <p className="text-gray-700 text-xs">
                    Normalización: u<sub>k</sub> = X<sub>k</sub> / {inputs.m}
                  </p>
                </div>
                {/* ...existing code... */}
                {/* Diagrama de Dispersión */}
                <div className="bg-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Diagrama de Dispersión</h3>
                  <div className="h-64">
                    <Scatter data={scatterData} options={scatterOptions} />
                  </div>
                </div>
                {/* ...existing code... */}
                {/* Estadísticas */}
                <div className="bg-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Estadísticas</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-gray-300 rounded-md">
                      <div className="text-xl font-bold text-gray-800">{Math.min(...results.numeros)}</div>
                      <div className="text-xs text-gray-600">Mínimo</div>
                    </div>
                    <div className="text-center p-3 bg-gray-300 rounded-md">
                      <div className="text-xl font-bold text-gray-800">{Math.max(...results.numeros)}</div>
                      <div className="text-xs text-gray-600">Máximo</div>
                    </div>
                    <div className="text-center p-3 bg-gray-300 rounded-md">
                      <div className="text-xl font-bold text-gray-800">
                        {(results.numeros.reduce((a, b) => a + b, 0) / results.numeros.length).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">Promedio</div>
                    </div>
                    <div className="text-center p-3 bg-gray-300 rounded-md">
                      <div className="text-xl font-bold text-gray-800">{results.numeros.length}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                  </div>
                </div>
                {/* ...existing code... */}
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">Configure los parámetros y presione &quot;Generar Números&quot; para ver los resultados</p>
              </div>
            )}
          </div>
        </div>

        {/* Sección inferior: Números generados y Parámetros utilizados */}
        {results.generado && results.numeros.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Números Generados */}
            <div className="bg-gray-200 rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-medium mb-3 text-gray-800">
                Números Generados ({results.numeros.length} total)
              </h3>
              <div className="max-h-96 overflow-y-auto border border-gray-400 rounded">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-400 sticky top-0">
                    <tr>
                      <th className="border border-gray-500 px-3 py-2 text-gray-800">Índice (k)</th>
                      <th className="border border-gray-500 px-3 py-2 text-gray-800">X<sub>k</sub></th>
                      <th className="border border-gray-500 px-3 py-2 text-gray-800">u<sub>k</sub> (Normalizado)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.numeros.map((num, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                        <td className="border border-gray-400 px-3 py-2 text-center text-gray-800">{index + 1}</td>
                        <td className="border border-gray-400 px-3 py-2 text-center font-mono text-gray-800">{num}</td>
                        <td className="border border-gray-400 px-3 py-2 text-center font-mono text-gray-800">
                          {results.normalizados[index].toFixed(6)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Parámetros Utilizados y Resumen */}
            <div className="space-y-4">
              
              {/* Parámetros Utilizados */}
              <div className="bg-gray-200 rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Parámetros Utilizados</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-300 rounded-md text-center">
                    <div className="text-xl font-bold text-gray-800">a = {inputs.a}</div>
                    <div className="text-sm text-gray-600">Multiplicador</div>
                  </div>
                  <div className="p-3 bg-gray-300 rounded-md text-center">
                    <div className="text-xl font-bold text-gray-800">c = {inputs.c}</div>
                    <div className="text-sm text-gray-600">Incremento</div>
                  </div>
                  <div className="p-3 bg-gray-300 rounded-md text-center">
                    <div className="text-xl font-bold text-gray-800">m = {inputs.m}</div>
                    <div className="text-sm text-gray-600">Módulo</div>
                  </div>
                  <div className="p-3 bg-gray-300 rounded-md text-center">
                    <div className="text-xl font-bold text-gray-800">X₀ = {inputs.semilla}</div>
                    <div className="text-sm text-gray-600">Semilla</div>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-gray-200 rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Información del Algoritmo</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="p-2 bg-gray-300 rounded">
                    <strong>Fórmula:</strong> X<sub>k+1</sub> = ({inputs.a} × X<sub>k</sub> + {inputs.c}) mod {inputs.m}
                  </div>
                  <div className="p-2 bg-gray-300 rounded">
                    <strong>Cálculo automático:</strong> g = ceil(log₂({inputs.cantidad})) = {calcularG(inputs.cantidad)}
                  </div>
                  <div className="p-2 bg-gray-300 rounded">
                    <strong>Módulo calculado:</strong> m = 2^{calcularG(inputs.cantidad)} = {calcularModulo(inputs.cantidad)}
                  </div>
                  <div className="p-2 bg-gray-300 rounded">
                    <strong>Normalización:</strong> u<sub>k</sub> = X<sub>k</sub> / {inputs.m}
                  </div>
                  <div className="p-2 bg-gray-300 rounded">
                    <strong>Rango de valores:</strong> X<sub>k</sub> ∈ [0, {inputs.m - 1}]
                  </div>
                  <div className="p-2 bg-gray-300 rounded">
                    <strong>Rango normalizado:</strong> u<sub>k</sub> ∈ [0, 1)
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
