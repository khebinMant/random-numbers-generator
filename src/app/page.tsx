export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Generadores de Números Aleatorios
          </h1>
          <p className="text-xl text-gray-600">
            Colección de algoritmos para generación de números pseudoaleatorios
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Bienvenido
          </h2>
          <p className="text-gray-700 mb-4">
            Esta aplicación implementa diversos algoritmos clásicos para la generación de números pseudoaleatorios.
            Cada algoritmo incluye:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
            <li>Validación de entradas según condiciones específicas</li>
            <li>Generación de secuencias de números</li>
            <li>Normalización al rango [0, 1]</li>
            <li>Pruebas de independencia y uniformidad</li>
            <li>Visualización con diagramas de dispersión</li>
            <li>Estadísticas descriptivas</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Algoritmos Disponibles
          </h2>
          <div className="space-y-3">
            <div className="border-l-4 border-gray-600 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">LCG - Generador Congruencial Lineal</h3>
              <p className="text-sm text-gray-600">X<sub>k+1</sub> = (a  X<sub>k</sub> + c) mod m</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">01. Algoritmo de Productos Medios</h3>
              <p className="text-sm text-gray-600">Método de von Neumann (Middle Square Method)</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">02. Algoritmo Multiplicador Constante</h3>
              <p className="text-sm text-gray-600">Generación mediante multiplicación por constante</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">03. Algoritmo Lineal</h3>
              <p className="text-sm text-gray-600">Método de generación lineal simple</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">04. Algoritmo Congruencial Multiplicativo</h3>
              <p className="text-sm text-gray-600">X<sub>k+1</sub> = (a  X<sub>k</sub>) mod m (Condiciones de Banks-Carson)</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">05. Algoritmo Congruencial Aditivo</h3>
              <p className="text-sm text-gray-600">Generador basado en suma de términos previos</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">06. Algoritmo Congruencial Cuadrático</h3>
              <p className="text-sm text-gray-600">X<sub>k+1</sub> = (a  X<sub>k</sub> + b  X<sub>k</sub> + c) mod m</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Instrucciones:</strong> Utilice el menú lateral izquierdo para navegar entre los diferentes algoritmos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
