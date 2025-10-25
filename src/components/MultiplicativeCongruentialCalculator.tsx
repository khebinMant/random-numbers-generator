'use client'

import { useState, useEffect } from 'react'

interface AlgorithmState {
  g: number
  k: number
  x0: number
  m: number
  a: number
  N: number
  aOption: '3+8k' | '5+8k'
  sequence: number[]
  isValid: boolean
  errors: string[]
}

export default function MultiplicativeCongruentialCalculator() {
  const [state, setState] = useState<AlgorithmState>({
    g: 0,
    k: 0,
    x0: 1,
    m: 0,
    a: 0,
    N: 0,
    aOption: '3+8k',
    sequence: [],
    isValid: false,
    errors: []
  })

  const [inputValues, setInputValues] = useState({
    g: '',
    k: '',
    x0: ''
  })

  // Validar y calcular parámetros
  useEffect(() => {
    const errors: string[] = []
    let isValid = true

    // Validar g
    if (state.g <= 0 || !Number.isInteger(state.g)) {
      errors.push('g debe ser un entero positivo')
      isValid = false
    }

    // Validar X0
    if (state.x0 % 2 === 0) {
      errors.push('X₀ debe ser un número impar')
      isValid = false
    }

    // Calcular m
    const m = Math.pow(2, state.g)
    
    // Calcular a
    const a = state.aOption === '3+8k' ? 3 + 8 * state.k : 5 + 8 * state.k
    
    // Calcular N (período máximo)
    const N = Math.pow(2, state.g - 2)

    setState(prev => ({
      ...prev,
      m,
      a,
      N,
      isValid,
      errors
    }))
  }, [state.g, state.k, state.x0, state.aOption])

  const handleInputChange = (field: 'g' | 'k' | 'x0', value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }))
    
    const numValue = parseInt(value) || 0
    setState(prev => ({
      ...prev,
      [field]: numValue,
      sequence: [] // Reset sequence when parameters change
    }))
  }

  const generateSequence = () => {
    if (!state.isValid) return

    const sequence: number[] = []
    let x = state.x0

    // Generar hasta el período máximo o hasta que se repita
    for (let i = 0; i < state.N && i < 50; i++) { // Limitar a 50 para evitar secuencias muy largas
      sequence.push(x)
      x = (state.a * x) % state.m
      
      // Si encontramos el valor inicial de nuevo, hemos completado un ciclo
      if (x === state.x0 && i > 0) {
        break
      }
    }

    setState(prev => ({ ...prev, sequence }))
  }

  const clearResults = () => {
    setState(prev => ({ ...prev, sequence: [] }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Generador Congruencial Multiplicativo
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Implementación con las condiciones de Banks Carson, Nelson y Nicol
      </p>

      {/* Formulario de entrada */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor de g (entero positivo)
          </label>
          <input
            type="number"
            value={inputValues.g}
            onChange={(e) => handleInputChange('g', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 5"
            min="1"
            step="1"
          />
          <p className="text-xs text-gray-500 mt-1">m = 2^g</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor de k
          </label>
          <input
            type="number"
            value={inputValues.k}
            onChange={(e) => handleInputChange('k', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 1"
            min="0"
            step="1"
          />
          <div className="mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="3+8k"
                checked={state.aOption === '3+8k'}
                onChange={(e) => setState(prev => ({ ...prev, aOption: e.target.value as '3+8k' | '5+8k' }))}
                className="mr-2"
              />
              <span className="text-sm">a = 3 + 8k</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="5+8k"
                checked={state.aOption === '5+8k'}
                onChange={(e) => setState(prev => ({ ...prev, aOption: e.target.value as '3+8k' | '5+8k' }))}
                className="mr-2"
              />
              <span className="text-sm">a = 5 + 8k</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor inicial X₀ (debe ser impar)
          </label>
          <input
            type="number"
            value={inputValues.x0}
            onChange={(e) => handleInputChange('x0', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 7"
            min="1"
            step="2"
          />
          <p className="text-xs text-gray-500 mt-1">Debe ser un número impar</p>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Parámetros Calculados</h2>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-blue-600">{state.m}</div>
            <div className="text-sm text-gray-600">m = 2^{state.g}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-green-600">{state.a}</div>
            <div className="text-sm text-gray-600">a = {state.aOption.replace('k', state.k.toString())}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-purple-600">{state.N}</div>
            <div className="text-sm text-gray-600">N = 2^{state.g-2}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-orange-600">{state.x0}</div>
            <div className="text-sm text-gray-600">X₀ inicial</div>
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
          Generar Secuencia
        </button>
        <button
          onClick={clearResults}
          className="px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* Mostrar secuencia generada */}
      {state.sequence.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Secuencia Generada ({state.sequence.length} números)
          </h2>
          <div className="grid grid-cols-8 md:grid-cols-12 gap-2 mb-4">
            {state.sequence.map((num, index) => (
              <div key={index} className="bg-white p-2 rounded text-center border">
                <div className="text-xs text-gray-500">X{index}</div>
                <div className="font-medium">{num}</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Fórmula utilizada:</strong> X<sub>n+1</sub> = ({state.a} × X<sub>n</sub>) mod {state.m}</p>
            <p><strong>Período detectado:</strong> {state.sequence.length} números</p>
            <p><strong>Período máximo teórico:</strong> {state.N} números</p>
          </div>
        </div>
      )}

      {/* Información teórica */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Condiciones del Algoritmo (Banks Carson, Nelson y Nicol)
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Parámetros:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• m = 2^g (donde g es entero)</li>
              <li>• a = 3 + 8k o a = 5 + 8k</li>
              <li>• k = 0, 1, 2, 3, ...</li>
              <li>• X₀ debe ser un número impar</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Propiedades:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Período máximo: N = m/4 = 2^(g-2)</li>
              <li>• Fórmula: X<sub>n+1</sub> = (a × X<sub>n</sub>) mod m</li>
              <li>• Genera números pseudoaleatorios</li>
              <li>• Cumple las condiciones de máximo período</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}