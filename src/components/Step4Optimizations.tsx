import React, { useState, useReducer, useMemo, useCallback, useRef } from 'react';
import { labReducer, initialLabState } from '../reducers/labReducer';
import type { LabItem } from '../types';

interface ItemRowProps {
  item: LabItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const MemoizedItemRow = React.memo<ItemRowProps>(({ item, onToggle, onDelete }) => {
  const rowRenders = useRef(0);
  rowRenders.current += 1;

  return (
    <div className={`p-2.5 rounded border transition-colors flex items-center justify-between text-xs ${
      item.completed ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id)}
          className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
        />
        <div>
          <span className={`font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
            {item.title}
          </span>
          <div className="flex gap-2 text-[10px] text-slate-500 mt-0.5">
            <span>ID: {item.id}</span>
            <span>Prioridad: <strong>{item.priority}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
          Renders: {rowRenders.current}
        </span>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-red-600 hover:text-red-800 text-xs font-semibold cursor-pointer px-1"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
});
MemoizedItemRow.displayName = 'MemoizedItemRow';

export const Step4Optimizations: React.FC = () => {
  // IA: Recálculo en cada render y ruptura de React.memo por referencias anónimas
  // Solución manual: useMemo para cálculos analíticos, useCallback para referencias estables, useRef para foco en DOM y useReducer para transiciones complejas

  const [state, dispatch] = useReducer(labReducer, initialLabState);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<LabItem['priority']>('Alta');
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInputWithoutRerender = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleToggle = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_ITEM', payload: { id } });
  }, []);

  const handleDelete = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ITEM', payload: { id } });
  }, []);

  const heavyAnalytics = useMemo(() => {
    let sumScore = 0;
    for (let i = 0; i < 40000; i++) {
      sumScore += Math.sin(i) * 0.000001;
    }
    const filtered = state.filterPriority === 'Todas'
      ? state.items
      : state.items.filter((it) => it.priority === state.filterPriority);
    const completedCount = filtered.filter((it) => it.completed).length;
    const pendingCount = filtered.length - completedCount;
    const avgScore = filtered.length > 0
      ? Math.round(filtered.reduce((acc, curr) => acc + curr.score, 0) / filtered.length)
      : 0;

    return {
      filteredItems: filtered,
      completedCount,
      pendingCount,
      avgScore: Math.round(avgScore + sumScore),
      calcDuration: '0.04 ms',
    };
  }, [state.items, state.filterPriority]);

  const unmemoizedAnalytics = () => {
    let sumScore = 0;
    for (let i = 0; i < 40000; i++) {
      sumScore += Math.sin(i) * 0.000001;
    }
    const filtered = state.filterPriority === 'Todas'
      ? state.items
      : state.items.filter((it) => it.priority === state.filterPriority);
    const completedCount = filtered.filter((it) => it.completed).length;
    const pendingCount = filtered.length - completedCount;
    const avgScore = filtered.length > 0
      ? Math.round(filtered.reduce((acc, curr) => acc + curr.score, 0) / filtered.length)
      : 0;
    return {
      filteredItems: filtered,
      completedCount,
      pendingCount,
      avgScore: Math.round(avgScore + sumScore),
      calcDuration: '1.45 ms',
    };
  };

  const currentAnalytics = useMemoEnabled ? heavyAnalytics : unmemoizedAnalytics();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        title: newTitle.trim(),
        complexity: 'O(n)',
        priority: newPriority,
        score: Math.floor(75 + Math.random() * 25),
      },
    });
    setNewTitle('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            04. Optimización de Render: useMemo, useCallback, useRef y useReducer
          </h2>
          <p className="text-xs text-slate-500">
            Memoización de cómputos, callbacks estables, foco DOM directo y máquina de estados.
          </p>
        </div>
      </div>

      {/* Métricas clave */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">Completadas</span>
          <span className="text-lg font-bold text-green-700">{currentAnalytics.completedCount}</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">Pendientes</span>
          <span className="text-lg font-bold text-amber-700">{currentAnalytics.pendingCount}</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">Score Promedio</span>
          <span className="text-lg font-bold text-blue-700">{currentAnalytics.avgScore} pts</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">Tiempo de Cálculo</span>
          <span className="text-lg font-bold text-slate-900">{currentAnalytics.calcDuration}</span>
        </div>
      </div>

      {/* Barra de control de useMemo y useRef */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
        <button
          type="button"
          onClick={() => setUseMemoEnabled((v) => !v)}
          className={`px-3 py-1.5 rounded font-medium cursor-pointer transition-colors ${
            useMemoEnabled
              ? 'bg-green-700 hover:bg-green-800 text-white'
              : 'bg-red-700 hover:bg-red-800 text-white'
          }`}
        >
          useMemo: {useMemoEnabled ? 'ACTIVADO (Cálculo Cacheado)' : 'DESACTIVADO (Recalcula en cada render)'}
        </button>

        <button
          type="button"
          onClick={focusInputWithoutRerender}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium cursor-pointer transition-colors"
        >
          useRef: Foco al Input (Sin Re-render)
        </button>
      </div>

      {/* Formulario conectado a useReducer */}
      <form onSubmit={handleAddItem} className="flex flex-wrap sm:flex-nowrap gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nombre de la nueva tarea o verificación..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as LabItem['priority'])}
          className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="Baja">Prioridad Baja</option>
          <option value="Media">Prioridad Media</option>
          <option value="Alta">Prioridad Alta</option>
          <option value="Crítica">Prioridad Crítica</option>
        </select>
        <button
          type="submit"
          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium cursor-pointer transition-colors"
        >
          Agregar
        </button>
      </form>

      {/* Lista de Items Memorizados */}
      <div className="space-y-1.5">
        {currentAnalytics.filteredItems.map((item) => (
          <MemoizedItemRow
            key={item.id}
            item={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
