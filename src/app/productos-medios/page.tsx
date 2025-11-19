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

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend)

export default function ProductosMedios() {
  const [inputs, setInputs] = useState({
    semilla: 5735,
    digitos: 4,
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

  const validarEntradas = () => {
    const errors: string[] = []
    if (!Number.isInteger(inputs.semilla)) errors.push('La semilla debe ser un número entero')
    if (!Number.isInteger(inputs.digitos) || inputs.digitos < 2 || inputs.digitos > 6) {
      errors.push('Los dígitos deben ser entre 2 y 6')
    }
    if (!Number.isInteger(inputs.cantidad) || inputs.cantidad < 1) {
      errors.push('La cantidad debe ser un entero positivo')
    }
    const maxSemilla = Math.pow(10, inputs.digitos) - 1
    if (inputs.semilla < 0 || inputs.semilla > maxSemilla) {
      errors.push(`La semilla debe estar entre 0 y ${maxSemilla}`)
    }
    return errors
  }

  const generar = () => {
    const errors = validarEntradas()
    if (errors.length > 0) {
      setResults(prev => ({ ...prev, errors, generado: false }))
      return
    }

    const numeros: number[] = []
    const normalizados: number[] = []
    let x = inputs.semilla

    for (let i = 0; i < inputs.cantidad; i++) {
      // Elevar al cuadrado
      const cuadrado = x * x
      // Convertir a string con padding
      const strCuadrado = cuadrado.toString().padStart(inputs.digitos * 2, '0')
      // Extraer dígitos centrales
      const inicio = Math.floor((strCuadrado.length - inputs.digitos) / 2)
      const medio = strCuadrado.substring(inicio, inicio + inputs.digitos)
      x = parseInt(medio)
      numeros.push(x)
      normalizados.push(x / Math.pow(10, inputs.digitos))
    }

    const independencia = pruebaIndependencia(normalizados)
    const uniformidad = pruebaUniformidad(normalizados)
    const valido = independencia && uniformidad
    
    setResults({ numeros, normalizados, errors: [], generado: true })
    setValidacion({ independencia, uniformidad, valido })
  }

  const reiniciar = () => {
    setInputs({ semilla: 5735, digitos: 4, cantidad: 10 })
    setResults({ numeros: [], normalizados: [], errors: [], generado: false })
    setValidacion({ independencia: null, uniformidad: null, valido: null })
  }

  const scatterData = {
    datasets: [{
      label: 'Valores Normalizados',
      data: results.normalizados.map((val, idx) => ({ x: idx + 1, y: val })),
      backgroundColor: 'rgba(75, 85, 99, 0.7)',
      borderColor: 'rgb(55, 65, 81)',
      borderWidth: 2,
      pointRadius: 5,
    }]
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Algoritmo de Productos Medios
          </h1>
          <p className="text-gray-600">Método de von Neumann (Middle Square Method)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-200 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Parámetros</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semilla (X₀)</label>
                  <input
                    type="number"
                    value={inputs.semilla}
                    onChange={(e) => setInputs(prev => ({ ...prev, semilla: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de dígitos</label>
                  <input
                    type="number"
                    value={inputs.digitos}
                    onChange={(e) => setInputs(prev => ({ ...prev, digitos: parseInt(e.target.value) || 4 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-100"
                    min="2"
                    max="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                  <input
                    type="number"
                    value={inputs.cantidad}
                    onChange={(e) => setInputs(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-100"
                    min="1"
                  />
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="bg-red-100 border border-red-300 rounded-md p-3 mt-4">
                  <h3 className="text-red-800 font-medium mb-2 text-sm">Errores:</h3>
                  <ul className="text-red-700 text-xs">
                    {results.errors.map((error, idx) => <li key={idx}>• {error}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <button onClick={generar} className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800">
                  Generar Números
                </button>
                <button onClick={reiniciar} className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  Reiniciar
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {results.generado ? (
              <div className="space-y-4">
                <div className={`rounded-md p-3 ${validacion.valido ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'} border`}>
                  <h3 className="font-medium text-sm mb-1">Validación</h3>
                  <ul className="text-xs">
                    <li><strong>Independencia:</strong> {validacion.independencia ? '✔️' : '❌'}</li>
                    <li><strong>Uniformidad:</strong> {validacion.uniformidad ? '✔️' : '❌'}</li>
                  </ul>
                  <div className="mt-2 font-bold">
                    {validacion.valido ? <span className="text-green-700">Válidos</span> : <span className="text-red-700">No válidos</span>}
                  </div>
                  {!validacion.valido && (
                    <button onClick={generar} className="mt-3 px-4 py-2 bg-red-600 text-white rounded">Regenerar</button>
                  )}
                </div>
                <div className="bg-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">Diagrama de Dispersión</h3>
                  <div className="h-64">
                    <Scatter data={scatterData} options={{ responsive: true, scales: { y: { min: 0, max: 1 } } }} />
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
      </div>
    </div>
  )
}
