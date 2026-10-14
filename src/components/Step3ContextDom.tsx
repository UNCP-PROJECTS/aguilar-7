import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const Step3ContextDom: React.FC = () => {
  // IA: Contexto monolítico gigante que re-renderiza todo el árbol ante cualquier cambio
  // Solución manual: Separar ThemeContext y NotificationContext en dominios independientes

  const { theme, toggleTheme } = useTheme();
  const { notify } = useNotification();

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            03. useContext Multi-Dominio (Separación de Responsabilidades)
          </h2>
          <p className="text-xs text-slate-500">
            Dos contextos independientes por dominio para evitar re-renderizados cruzados.
          </p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-medium border border-blue-200">
          Sin Prop Drilling
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dominio 1: ThemeContext */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dominio A: ThemeContext
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Administra el tema visual de la aplicación.
            </p>
          </div>
          <div className="text-xs text-slate-700">
            Tema activo: <strong className="font-mono uppercase">{theme}</strong>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer transition-colors"
          >
            Conmutar Tema ({theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'})
          </button>
        </div>

        {/* Dominio 2: NotificationContext */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dominio B: NotificationContext
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Administra la cola de alertas y toasts globales.
            </p>
          </div>
          <div className="text-xs text-slate-700">
            Disparar alerta sin alterar el ThemeContext:
          </div>
          <div className="flex flex-wrap gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => notify('Operación completada exitosamente', 'success')}
              className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-medium cursor-pointer transition-colors"
            >
              Éxito
            </button>
            <button
              type="button"
              onClick={() => notify('Advertencia: verifique los parámetros', 'warning')}
              className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-medium cursor-pointer transition-colors"
            >
              Alerta
            </button>
            <button
              type="button"
              onClick={() => notify('Información técnica de React Hooks', 'info')}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-medium cursor-pointer transition-colors"
            >
              Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
