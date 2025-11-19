'use client'

import { useState } from 'react'
import { Scatter } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { pruebaIndependencia, pruebaUniformidad } from '@/components/ValidationHelpers'

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend)

export default function AlgoritmoLineal() {
  const [inputs, setInputs] = useState({ a: 7, b: 13, m: 100, x0: 5, cantidad: 10 })
  const [results, setResults] = useState({ numeros: [] as number[], normalizados: [] as number[], errors: [] as string[], generado: false })
  const [validacion, setValidacion] = useState({ independencia: null as null | boolean, uniformidad: null as null | boolean, valido: null as null | boolean })

  const generar = () => {
    const numeros: number[] = []
    const normalizados: number[] = []
    let x = inputs.x0
    
    for (let i = 0; i < inputs.cantidad; i++) {
      x = (inputs.a * x + inputs.b) % inputs.m
      numeros.push(x)
      normalizados.push(x / inputs.m)
    }

    const independencia = pruebaIndependencia(normalizados)
    const uniformidad = pruebaUniformidad(normalizados)
    setResults({ numeros, normalizados, errors: [], generado: true })
    setValidacion({ independencia, uniformidad, valido: independencia && uniformidad })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold text-center mb-8">Algoritmo Lineal</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Parámetros</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">a</label><input type="number" value={inputs.a} onChange={(e) => setInputs(prev => ({ ...prev, a: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border rounded-md bg-gray-100" /></div>
              <div><label className="block text-sm font-medium mb-2">b</label><input type="number" value={inputs.b} onChange={(e) => setInputs(prev => ({ ...prev, b: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border rounded-md bg-gray-100" /></div>
              <div><label className="block text-sm font-medium mb-2">m</label><input type="number" value={inputs.m} onChange={(e) => setInputs(prev => ({ ...prev, m: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2 border rounded-md bg-gray-100" /></div>
              <div><label className="block text-sm font-medium mb-2">X₀</label><input type="number" value={inputs.x0} onChange={(e) => setInputs(prev => ({ ...prev, x0: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border rounded-md bg-gray-100" /></div>
              <div><label className="block text-sm font-medium mb-2">Cantidad</label><input type="number" value={inputs.cantidad} onChange={(e) => setInputs(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2 border rounded-md bg-gray-100" /></div>
            </div>
            <button onClick={generar} className="w-full mt-6 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800">Generar</button>
          </div>
          <div className="lg:col-span-2">
            {results.generado ? (
              <div className="space-y-4">
                <div className={`p-3 rounded-md border ${validacion.valido ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
                  <h3 className="font-medium text-sm">Validación</h3>
                  <p className="text-xs"><strong>Independencia:</strong> {validacion.independencia ? '✔️' : '❌'}</p>
                  <p className="text-xs"><strong>Uniformidad:</strong> {validacion.uniformidad ? '✔️' : '❌'}</p>
                  <div className="font-bold mt-2">{validacion.valido ? <span className="text-green-700">Válidos</span> : <span className="text-red-700">No válidos</span>}</div>
                </div>
                <div className="bg-gray-200 rounded-lg p-4">
                  <Scatter data={{ datasets: [{ label: 'Valores', data: results.normalizados.map((v, i) => ({ x: i + 1, y: v })), backgroundColor: 'rgba(75, 85, 99, 0.7)' }] }} options={{ responsive: true, scales: { y: { min: 0, max: 1 } } }} />
                </div>
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg p-8 text-center"><p>Configure y genere números</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
