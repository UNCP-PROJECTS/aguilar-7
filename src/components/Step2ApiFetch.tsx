import React, { useState, useEffect } from 'react';
import type { ProductItem } from '../types';

export const Step2ApiFetch: React.FC = () => {
  // IA: Peticiones asíncronas concurrentes sin cancelación (Memory Leak)
  // Solución manual: async/await dentro de useEffect con AbortController en la función de limpieza

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Inicializando petición...');
  const [category, setCategory] = useState<string>('laptops');
  const [abortTriggerCount, setAbortTriggerCount] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setStatusMessage(`Cargando categoría: "${category}"...`);

    async function fetchProducts() {
      try {
        const res = await fetch(`https://dummyjson.com/products/category/${category}?limit=3`, { signal });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const json = await res.json();
        setProducts(json.products || []);
        setStatusMessage(`Datos cargados correctamente (${json.products?.length || 0} productos)`);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setStatusMessage('Petición cancelada limpiamente por AbortController (Cleanup).');
          setLoading(false);
          return;
        }
        setStatusMessage('Error al consultar la API');
        setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [category, abortTriggerCount]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            02. Fetch API con async/await y Limpieza con AbortController
          </h2>
          <p className="text-xs text-slate-500">
            Cancelación de peticiones HTTP en vuelo al desmontar o conmutar dependencias.
          </p>
        </div>
        <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded font-medium border border-green-200">
          Cleanup Activo
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="category-select" className="font-semibold text-slate-700">Categoría:</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="laptops">Laptops</option>
            <option value="smartphones">Smartphones</option>
            <option value="tablets">Tablets</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAbortTriggerCount((c) => c + 1)}
            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded font-medium cursor-pointer transition-colors"
          >
            Recargar
          </button>
          <button
            type="button"
            onClick={() => {
              setCategory((c) => (c === 'laptops' ? 'smartphones' : 'laptops'));
              setAbortTriggerCount((c) => c + 1);
            }}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium cursor-pointer transition-colors"
          >
            Trigger Abort (Cambio Rápido)
          </button>
        </div>
      </div>

      {/* Estado del request */}
      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-700">
        Estado: <strong>{statusMessage}</strong> {loading && '(cargando...)'}
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {products.map((p) => (
          <div key={p.id} className="border border-slate-200 rounded p-3 bg-white flex flex-col justify-between">
            <div>
              <div className="h-24 bg-slate-100 rounded flex items-center justify-center overflow-hidden mb-2">
                <img src={p.thumbnail} alt={p.title} className="object-contain h-full w-full" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-900">${p.price}</span>
              <span className="text-amber-700 font-semibold">★ {p.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
