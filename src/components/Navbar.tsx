import React from 'react';
import { ExternalLink } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'all', label: 'Todos los Pasos' },
    { id: 'step1', label: '01. Ciclo & Profiler' },
    { id: 'step2', label: '02. Fetch & Abort' },
    { id: 'step3', label: '03. useContext' },
    { id: 'step4', label: '04. Optimizaciones' },
    { id: 'step5', label: '05. Custom Hooks' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white font-bold text-xs px-2 py-1 rounded">
              UNCP FIS
            </span>
            <span className="font-semibold text-slate-900 text-sm">
              Práctica 07 — React Hooks y Profiler
            </span>
          </div>

          <a
            href="https://drive.google.com/drive/folders/14dovgrEN9naRPYoCg83PSeoR8Sl9B1NT?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 border border-blue-200 bg-blue-50 px-2.5 py-1 rounded transition-colors"
          >
            <span>Video en Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tabs de navegación */}
        <div className="flex items-center gap-1 border-t border-slate-100 py-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
