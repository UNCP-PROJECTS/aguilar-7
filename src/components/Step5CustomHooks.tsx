import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';

interface QuoteResponse {
  quotes: Array<{ id: number; quote: string; author: string }>;
}

export const Step5CustomHooks: React.FC = () => {
  // IA: Lógica repetida en múltiples componentes (duplicación de código)
  // Solución manual: Encapsular lógica en Custom Hooks reutilizables (useFetch, useLocalStorage, useDebounce)

  const { data, loading, error, refetch } = useFetch<QuoteResponse>(
    'https://dummyjson.com/quotes?limit=2'
  );

  const [notes, setNotes] = useLocalStorage<string>(
    'uncp_notes',
    'Hooks llamados únicamente en el nivel superior (Top Level) de componentes funcionales.'
  );

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            05. Custom Hooks: useFetch, useLocalStorage y useDebounce
          </h2>
          <p className="text-xs text-slate-500">
            Composición de lógica reutilizable cumpliendo estrictamente las Reglas de Hooks.
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium border border-slate-200">
          Reglas de Hooks OK
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hook 1: useFetch */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. useFetch&lt;T&gt;
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-2">
              Encapsula ciclo asíncrono y AbortController.
            </p>

            {loading && <div className="text-xs text-blue-600 font-medium">Cargando datos con useFetch...</div>}
            {error && <div className="text-xs text-red-600 font-medium">{error}</div>}

            {data && !loading && (
              <div className="space-y-2">
                {data.quotes?.map((q) => (
                  <div key={q.id} className="p-2 bg-white border border-slate-200 rounded text-xs text-slate-700">
                    <p className="italic">"{q.quote}"</p>
                    <span className="text-[10px] text-slate-500 block mt-1 font-semibold">— {q.author}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={refetch}
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer transition-colors"
          >
            Reconsultar API (Refetch)
          </button>
        </div>

        {/* Hook 2: useLocalStorage */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. useLocalStorage&lt;T&gt;
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-2">
              Persistencia automática en el navegador.
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none font-mono"
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500">
            <span>Persiste al recargar</span>
            <button
              type="button"
              onClick={() => setNotes('')}
              className="text-red-600 hover:underline cursor-pointer font-medium"
            >
              Borrar
            </button>
          </div>
        </div>

        {/* Hook 3: useDebounce */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. useDebounce&lt;T&gt;
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-2">
              Retrasa el valor (350 ms) para evitar spam de peticiones.
            </p>

            <input
              type="text"
              placeholder="Escribe para probar debounce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 mb-2"
            />

            <div className="space-y-1 text-xs">
              <div className="p-1.5 bg-white border border-slate-200 rounded text-slate-600">
                Inmediato: <strong>{searchTerm || '—'}</strong>
              </div>
              <div className="p-1.5 bg-blue-50 border border-blue-200 rounded text-blue-900 font-medium">
                Estabilizado: <strong>{debouncedSearch || '—'}</strong>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            {searchTerm !== debouncedSearch ? 'Estabilizando entrada...' : 'Listo'}
          </div>
        </div>
      </div>
    </div>
  );
};
