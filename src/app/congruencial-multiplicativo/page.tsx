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
import { pruebaIndependencia, pruebaUniformidad } from '@/components/ValidationHelpers'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function CongruencialMultiplicativo() {
  const [inputs, setInputs] = useState({
    g: 5,       // exponente para m = 2^g
    k: 1,       // para calcular a = 3 + 8k o a = 5 + 8k
    tipo: '3',  // '3' para 3+8k, '5' para 5+8k
    x0: 1,      // semilla (debe ser impar)
    cantidad: 10
  })
  
  const [results, setResults] = useState({
    numeros: [] as number[],
    normalizados: [] as number[],
    errors: [] as string[],
    generado: false
  })
  
  const [validacion, setValidacion] = useState({
    independencia: null as null | boolean,
    uniformidad: null as null | boolean,
    valido: null as null | boolean
  })
  
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Calcular m = 2^g
  const calcularM = (g: number): number => {
    return Math.pow(2, g)
  }

  // Calcular a según tipo
  const calcularA = (k: number, tipo: string): number => {
    return tipo === '3' ? 3 + 8 * k : 5 + 8 * k
  }

  // Calcular período máximo N = 2^(g-2)
  const calcularPeriodo = (g: number): number => {
    return Math.pow(2, g - 2)
  }

  // Validación de entradas
  const validarEntradas = () => {
    const errors: string[] = []
    
    if (!Number.isInteger(inputs.g)) errors.push('g debe ser un número entero')
    if (!Number.isInteger(inputs.k)) errors.push('k debe ser un número entero')
    if (!Number.isInteger(inputs.x0)) errors.push('X₀ debe ser un número entero')
    if (!Number.isInteger(inputs.cantidad)) errors.push('La cantidad debe ser un número entero')
    
    if (inputs.g < 3) errors.push('g debe ser mayor o igual a 3')
    if (inputs.k < 0) errors.push('k debe ser mayor o igual a 0')
    
    // X₀ debe ser impar
    if (inputs.x0 % 2 === 0) errors.push('X₀ debe ser impar')
    
    const m = calcularM(inputs.g)
    if (inputs.x0 < 1 || inputs.x0 >= m) {
      errors.push(`X₀ debe cumplir: 1 ≤ X₀ < ${m}`)
    }
    
    if (inputs.cantidad < 1) errors.push('La cantidad debe ser mayor que 0')
    
    return errors
  }

  // Generación del algoritmo
  const generar = () => {
    const errors = validarEntradas()
    
    if (errors.length > 0) {
      setResults(prev => ({ ...prev, errors, generado: false }))
      return
    }

    if (inputs.cantidad > 100 && !showConfirmation) {
      setShowConfirmation(true)
      return
    }

    // Implementar algoritmo: Xₖ₊₁ = (a * Xₖ) mod m
    const numeros: number[] = []
    const normalizados: number[] = []
    
    const m = calcularM(inputs.g)
    const a = calcularA(inputs.k, inputs.tipo)
    let x = inputs.x0
    
    for (let i = 0; i < inputs.cantidad; i++) {
      x = (a * x) % m
      numeros.push(x)
      normalizados.push(x / m)
    }

    const independencia = pruebaIndependencia(normalizados)
    const uniformidad = pruebaUniformidad(normalizados)
    const valido = independencia && uniformidad
    
    setResults({
      numeros,
      normalizados,
      errors: [],
      generado: true
    })
    setValidacion({ independencia, uniformidad, valido })
    setShowConfirmation(false)
  }

  const reiniciar = () => {
    setInputs({
      g: 5,
      k: 1,
      tipo: '3',
      x0: 1,
      cantidad: 10
    })
    setResults({
      numeros: [],
      normalizados: [],
      errors: [],
      generado: false
    })
    setValidacion({ independencia: null, uniformidad: null, valido: null })
    setShowConfirmation(false)
  }

  const scatterData = {
    datasets: [{
      label: 'Valores Normalizados',
      data: results.normalizados.map((val, index) => ({
        x: index + 1,
        y: val
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
        text: 'Diagrama de Dispersión'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 1
      }
    }
  }

  const m = calcularM(inputs.g)
  const a = calcularA(inputs.k, inputs.tipo)
  const periodo = calcularPeriodo(inputs.g)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Algoritmo Congruencial Multiplicativo
          </h1>
          <p className="text-gray-600">
            Condiciones de Banks Carson, Nelson y Nicol
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-200 rounded-lg shadow-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Parámetros</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    g (exponente para m = 2^g)
                  </label>
                  <input
                    type="number"
                    value={inputs.g}
                    onChange={(e) => setInputs(prev => ({ ...prev, g: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                    min="3"
                    step="1"
                  />
                  <p className="text-xs text-gray-600 mt-1">m = 2^{inputs.g} = {m}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    k (para calcular a)
                  </label>
                  <input
                    type="number"
                    value={inputs.k}
                    onChange={(e) => setInputs(prev => ({ ...prev, k: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                    min="0"
                    step="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de a
                  </label>
                  <select
                    value={inputs.tipo}
                    onChange={(e) => setInputs(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                  >
                    <option value="3">a = 3 + 8k</option>
                    <option value="5">a = 5 + 8k</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">
                    a = {inputs.tipo} + 8×{inputs.k} = {a}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    X₀ (semilla - debe ser impar)
                  </label>
                  <input
                    type="number"
                    value={inputs.x0}
                    onChange={(e) => setInputs(prev => ({ ...prev, x0: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                    min="1"
                    step="2"
                  />
                  <p className="text-xs text-gray-600 mt-1">Debe ser impar</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={inputs.cantidad}
                    onChange={(e) => setInputs(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
                    min="1"
                    step="1"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Período máximo: N = 2^(g-2) = {periodo}
                  </p>
                </div>
              </div>

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

          <div className="lg:col-span-2">
            {results.generado && results.numeros.length > 0 ? (
              <div className="space-y-4">
                <div className={`rounded-md p-3 mb-2 ${validacion.valido === null ? '' : validacion.valido ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
                  <h3 className="font-medium text-sm mb-1 text-gray-800">Validación</h3>
                  <ul className="text-xs text-gray-700">
                    <li>
                      <strong>Independencia:</strong> {validacion.independencia === null ? '-' : validacion.independencia ? '✔️' : '❌'}
                    </li>
                    <li>
                      <strong>Uniformidad:</strong> {validacion.uniformidad === null ? '-' : validacion.uniformidad ? '✔️' : '❌'}
                    </li>
                  </ul>
                  <div className="mt-2 font-bold text-lg">
                    {validacion.valido === null ? '' : validacion.valido ? <span className="text-green-700">Válidos</span> : <span className="text-red-700">No válidos</span>}
                  </div>
                  {validacion.valido === false && (
                    <button
                      onClick={generar}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Regenerar Números
                    </button>
                  )}
                </div>

                <div className="bg-gray-400 border border-gray-500 rounded-md p-3">
                  <p className="text-gray-800 font-medium text-sm">
                    Xₖ₊₁ = ({a} × Xₖ) mod {m}
                  </p>
                  <p className="text-gray-700 text-xs">
                    m = 2^{inputs.g} = {m} | a = {inputs.tipo} + 8×{inputs.k} = {a} | N máx = {periodo}
                  </p>
                </div>

                <div className="bg-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Diagrama de Dispersión</h3>
                  <div className="h-64">
                    <Scatter data={scatterData} options={scatterOptions} />
                  </div>
                </div>

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
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">Configure los parámetros y presione &quot;Generar Números&quot;</p>
              </div>
            )}
          </div>
        </div>

        {results.generado && results.numeros.length > 0 && (
          <div className="bg-gray-200 rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-medium mb-3 text-gray-800">
              Números Generados ({results.numeros.length} total)
            </h3>
            <div className="max-h-96 overflow-y-auto border border-gray-400 rounded">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-400 sticky top-0">
                  <tr>
                    <th className="border border-gray-500 px-3 py-2 text-gray-800">Índice</th>
                    <th className="border border-gray-500 px-3 py-2 text-gray-800">Xₖ</th>
                    <th className="border border-gray-500 px-3 py-2 text-gray-800">Normalizado</th>
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
        )}
      </div>
    </div>
  )
}
