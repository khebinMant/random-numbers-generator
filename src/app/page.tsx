'use client'

import { useState } from 'react'
import MultiplicativeCongruentialCalculator from '../components/MultiplicativeCongruentialCalculator'
import LinearCongruentialGenerator from '../components/LinearCongruentialGenerator'

type TabType = 'multiplicative' | 'linear'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('multiplicative')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Generadores de Números Pseudoaleatorios
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Implementación completa de algoritmos congruenciales con validación, 
            cálculos automáticos y visualización gráfica de los resultados.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('multiplicative')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'multiplicative'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">×</span>
                <div>
                  <div className="font-semibold">Congruencial Multiplicativo</div>
                  <div className="text-sm opacity-75">Banks Carson, Nelson y Nicol</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('linear')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'linear'
                  ? 'bg-green-600 text-white border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">+</span>
                <div>
                  <div className="font-semibold">Congruencial Lineal (LCG)</div>
                  <div className="text-sm opacity-75">Con gráficas y estadísticas</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'multiplicative' && <MultiplicativeCongruentialCalculator />}
        {activeTab === 'linear' && <LinearCongruentialGenerator />}

        {/* Information Footer */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📊 Características de la Aplicación
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✅ Validación completa de parámetros de entrada</li>
                <li>✅ Cálculos automáticos según especificaciones</li>
                <li>✅ Visualización gráfica de secuencias (LCG)</li>
                <li>✅ Estadísticas descriptivas de los resultados</li>
                <li>✅ Interfaz responsive y moderna</li>
                <li>✅ Feedback inmediato de errores</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🧮 Algoritmos Implementados
              </h3>
              <div className="text-sm text-gray-600 space-y-3">
                <div>
                  <strong>Multiplicativo:</strong> X<sub>n+1</sub> = (a × X<sub>n</sub>) mod m
                  <br />
                  <span className="text-xs">Condiciones de Banks Carson, Nelson y Nicol</span>
                </div>
                <div>
                  <strong>Lineal (LCG):</strong> X<sub>n+1</sub> = (a × X<sub>n</sub> + c) mod m
                  <br />
                  <span className="text-xs">Con a = 1 + 4k, validaciones completas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}