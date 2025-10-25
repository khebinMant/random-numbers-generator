'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface LCGState {
  x0: number
  k: number
  g: number
  c: number
  N: number
  a: number
  m: number
  sequence: number[]
  isValid: boolean
  errors: string[]
}

export default function LinearCongruentialGenerator() {
  const [state, setState] = useState<LCGState>({
    x0: 1,
    k: 1,
    g: 4,
    c: 1,
    N: 10,
    a: 0,
    m: 0,
    sequence: [],
    isValid: false,
    errors: []
  })

  const [inputValues, setInputValues] = useState({
    x0: '1',
    k: '1',
    g: '4',
    c: '1',
    N: '10'
  })

  // Validar parámetros
  useEffect(() => {
    const errors: string[] = []
    let isValid = true

    // Calcular a y m
    const a = 1 + 4 * state.k
    const m = Math.pow(2, state.g)

    // Validar rangos
    if (state.g < 1) {
      errors.push('g debe ser un entero ≥ 1')
      isValid = false
    }

    if (state.k < 0) {
      errors.push('k debe ser un entero ≥ 0')
      isValid = false
    }

    if (state.x0 < 0 || state.x0 >= m) {
      errors.push(`X₀ debe estar en el rango 0 ≤ X₀ < ${m}`)
      isValid = false
    }

    if (state.c < 0 || state.c >= m) {
      errors.push(`c debe estar en el rango 0 ≤ c < ${m}`)
      isValid = false
    }

    if (state.N < 1 || state.N > 10000) {
      errors.push('N debe estar en el rango 1 ≤ N ≤ 10,000')
      isValid = false
    }

    setState(prev => ({
      ...prev,
      a,
      m,
      isValid,
      errors,
      sequence: [] // Reset sequence when parameters change
    }))
  }, [state.x0, state.k, state.g, state.c, state.N])

  const handleInputChange = (field: keyof typeof inputValues, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }))
    
    const numValue = parseInt(value) || 0
    setState(prev => ({
      ...prev,
      [field]: numValue,
      sequence: []
    }))
  }

  const generateSequence = () => {
    if (!state.isValid) return

    const sequence: number[] = []
    let x = state.x0

    for (let i = 0; i < state.N; i++) {
      x = (state.a * x + state.c) % state.m
      sequence.push(x)
    }

    setState(prev => ({ ...prev, sequence }))
  }

  const clearResults = () => {
    setState(prev => ({ ...prev, sequence: [] }))
  }

  // Configuración de gráficos
  const lineChartData = {
    labels: state.sequence.map((_, index) => (index + 1).toString()),
    datasets: [
      {
        label: 'Secuencia de Números Generados',
        data: state.sequence,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const barChartData = {
    labels: state.sequence.map((_, index) => (index + 1).toString()),
    datasets: [
      {
        label: 'Distribución de Valores',
        data: state.sequence,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Visualización de Números Pseudoaleatorios',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: state.m > 0 ? state.m : undefined,
      },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Generador Congruencial Lineal (LCG)
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Fórmula: X<sub>n+1</sub> = (a × X<sub>n</sub> + c) mod m, donde a = 1 + 4k
      </p>

      {/* Formulario de entrada */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X₀ (semilla)
          </label>
          <input
            type="number"
            value={inputValues.x0}
            onChange={(e) => handleInputChange('x0', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1"
            min="0"
            step="1"
          />
          <p className="text-xs text-gray-500 mt-1">0 ≤ X₀ &lt; m</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            k (coeficiente)
          </label>
          <input
            type="number"
            value={inputValues.k}
            onChange={(e) => handleInputChange('k', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1"
            min="0"
            step="1"
          />
          <p className="text-xs text-gray-500 mt-1">k ≥ 0</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            g (exponente)
          </label>
          <input
            type="number"
            value={inputValues.g}
            onChange={(e) => handleInputChange('g', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="4"
            min="1"
            step="1"
          />
          <p className="text-xs text-gray-500 mt-1">g ≥ 1, m = 2^g</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            c (constante)
          </label>
          <input
            type="number"
            value={inputValues.c}
            onChange={(e) => handleInputChange('c', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1"
            min="0"
            step="1"
          />
          <p className="text-xs text-gray-500 mt-1">0 ≤ c &lt; m</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            N (iteraciones)
          </label>
          <input
            type="number"
            value={inputValues.N}
            onChange={(e) => handleInputChange('N', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="10"
            min="1"
            max="10000"
            step="1"
          />
          <p className="text-xs text-gray-500 mt-1">1 ≤ N ≤ 10,000</p>
        </div>
      </div>

      {/* Mostrar errores */}
      {state.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">Errores de validación:</h3>
          <ul className="text-red-700 text-sm">
            {state.errors.map((error, index) => (
              <li key={index} className="mb-1">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Parámetros calculados */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Parámetros Calculados</h3>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-blue-600">{state.a}</div>
            <div className="text-sm text-gray-600">a = 1 + 4×{state.k}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-green-600">{state.m}</div>
            <div className="text-sm text-gray-600">m = 2^{state.g}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-purple-600">{state.N}</div>
            <div className="text-sm text-gray-600">N iteraciones</div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={generateSequence}
          disabled={!state.isValid}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            state.isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Generar Secuencia LCG
        </button>
        <button
          onClick={clearResults}
          className="px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* Mostrar secuencia y gráficas */}
      {state.sequence.length > 0 && (
        <>
          {/* Tabla de secuencia */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Secuencia Generada ({state.sequence.length} números)
            </h3>
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Iteración</th>
                    <th className="px-3 py-2 text-left">Valor</th>
                    <th className="px-3 py-2 text-left">Cálculo</th>
                  </tr>
                </thead>
                <tbody>
                  {state.sequence.map((value, index) => {
                    const prevValue = index === 0 ? state.x0 : state.sequence[index - 1]
                    return (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2 font-medium">{index + 1}</td>
                        <td className="px-3 py-2 font-mono text-blue-600">{value}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          ({state.a} × {index === 0 ? state.x0 : state.sequence[index - 1]} + {state.c}) mod {state.m}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráficas */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Gráfica de Línea - Evolución de la Secuencia
              </h4>
              <Line data={lineChartData} options={chartOptions} />
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Gráfica de Barras - Distribución de Valores
              </h4>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Estadísticas</h4>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-3 rounded border">
                <div className="text-xl font-bold text-green-600">
                  {Math.min(...state.sequence)}
                </div>
                <div className="text-sm text-gray-600">Mínimo</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-xl font-bold text-green-600">
                  {Math.max(...state.sequence)}
                </div>
                <div className="text-sm text-gray-600">Máximo</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-xl font-bold text-green-600">
                  {(state.sequence.reduce((a, b) => a + b, 0) / state.sequence.length).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Promedio</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-xl font-bold text-green-600">
                  {new Set(state.sequence).size}
                </div>
                <div className="text-sm text-gray-600">Únicos</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}