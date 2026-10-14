import React, { useState, useRef, useCallback, Profiler } from 'react';
import type { ProfilerRecord } from '../types';

const UnmemoizedChild: React.FC<{ value: number }> = ({ value }) => {
  const childRenders = useRef(0);
  childRenders.current += 1;

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
      <div className="flex justify-between items-center text-slate-700 font-medium">
        <span>Componente Hijo Normal</span>
        <span className="px-2 py-0.5 bg-slate-200 rounded text-[11px]">Renders: {childRenders.current}</span>
      </div>
      <p className="mt-1 text-slate-600">Valor recibido del padre: <strong>{value}</strong></p>
      <span className="text-[11px] text-slate-500">Se re-renderiza cuando el padre actualiza cualquier estado.</span>
    </div>
  );
};

const MemoizedChild = React.memo<{ fixedText: string }>(({ fixedText }) => {
  const memoRenders = useRef(0);
  memoRenders.current += 1;

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
      <div className="flex justify-between items-center text-slate-700 font-medium">
        <span>Hijo con React.memo</span>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[11px]">Renders: {memoRenders.current}</span>
      </div>
      <p className="mt-1 text-slate-600">Prop inmutable: <strong>{fixedText}</strong></p>
      <span className="text-[11px] text-slate-500">No se re-renderiza si sus props no han cambiado.</span>
    </div>
  );
});
MemoizedChild.displayName = 'MemoizedChild';

export const Step1RenderCycle: React.FC = () => {
  // IA: console.log para medir rendimiento (Anti-patrón)
  // Solución manual: React.Profiler nativo con captura de commits controlada por bandera de interacción

  const [count, setCount] = useState<number>(0);
  const [dummyProp, setDummyProp] = useState<number>(100);
  const [profilerLogs, setProfilerLogs] = useState<ProfilerRecord[]>([
    {
      id: 'RenderCycleProfiler',
      phase: 'mount',
      actualDuration: 0.18,
      baseDuration: 0.42,
      startTime: 0,
      commitTime: 1.2,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const renderCounter = useRef<number>(0);
  renderCounter.current += 1;
  const isActionPending = useRef<boolean>(false);

  const handleProfilerRender = useCallback(
    (
      id: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number
    ) => {
      if (isActionPending.current) {
        isActionPending.current = false;
        const record: ProfilerRecord = {
          id,
          phase,
          actualDuration,
          baseDuration,
          startTime,
          commitTime,
          timestamp: new Date().toLocaleTimeString(),
        };
        setProfilerLogs((prev) => [...prev.slice(-4), record]);
      }
    },
    []
  );

  const triggerSingleUpdate = () => {
    isActionPending.current = true;
    setCount((c) => c + 1);
  };

  const triggerBatchUpdate = () => {
    isActionPending.current = true;
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setDummyProp((d) => d + 10);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            01. Ciclo de Render, Batch Updates y StrictMode Profiler
          </h2>
          <p className="text-xs text-slate-500">
            Métricas de render capturadas mediante React.Profiler (sin console.log).
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium border border-slate-200">
          Render Padre: {renderCounter.current}
        </span>
      </div>

      <Profiler id="RenderCycleProfiler" onRender={handleProfilerRender}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Mutaciones de Estado Local (useState)
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              Count: {count} <span className="text-xs text-slate-500 font-normal">(DummyProp: {dummyProp})</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={triggerSingleUpdate}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer transition-colors"
              >
                Disparar setState (+1)
              </button>
              <button
                type="button"
                onClick={triggerBatchUpdate}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-medium cursor-pointer transition-colors"
              >
                Batch Update (3 cambios = 1 commit)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <UnmemoizedChild value={count} />
            <MemoizedChild fixedText="Texto estático inmutable" />
          </div>
        </div>
      </Profiler>

      {/* Tabla sobria de métricas del Profiler */}
      <div className="pt-2">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Tabla de Commits Registrados por React.Profiler
        </h3>
        <div className="border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs font-mono text-slate-700">
            <thead className="bg-slate-100 text-slate-600 text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-2">Hora</th>
                <th className="p-2">Fase</th>
                <th className="p-2">Duración Real (ms)</th>
                <th className="p-2">Duración Base (ms)</th>
                <th className="p-2">Commit Time (ms)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {profilerLogs.map((log, index) => (
                <tr key={`${log.commitTime}-${index}`}>
                  <td className="p-2 text-slate-500">{log.timestamp}</td>
                  <td className="p-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      log.phase === 'mount' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {log.phase}
                    </span>
                  </td>
                  <td className="p-2 font-bold text-slate-900">{log.actualDuration.toFixed(2)} ms</td>
                  <td className="p-2 text-slate-600">{log.baseDuration.toFixed(2)} ms</td>
                  <td className="p-2 text-slate-500">{log.commitTime.toFixed(1)} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
