'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const algorithms = [
  { name: 'LCG - Lineal Congruencial', path: '/lcg' },
  { name: '01. Productos Medios', path: '/productos-medios' },
  { name: '02. Multiplicador Constante', path: '/multiplicador-constante' },
  { name: '03. Algoritmo Lineal', path: '/algoritmo-lineal' },
  { name: '04. Congruencial Multiplicativo', path: '/congruencial-multiplicativo' },
  { name: '05. Congruencial Aditivo', path: '/congruencial-aditivo' },
  { name: '06. Congruencial Cuadrático', path: '/congruencial-cuadratico' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4 text-white">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Generadores de Números Aleatorios</h2>
        <p className="text-xs text-gray-400">Selecciona un algoritmo</p>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {algorithms.map((algo) => (
            <li key={algo.path}>
              <Link
                href={algo.path}
                className={`block px-3 py-2 rounded transition-colors ${
                  pathname === algo.path
                    ? 'bg-gray-600 text-white font-medium'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                {algo.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
