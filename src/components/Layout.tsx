import React from 'react';
import { Navbar } from './Navbar';
import { ToastContainer } from './ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 text-center">
        UNCP FIS · IS093A Desarrollo de Aplicaciones Web · José Pablo Osorio Mallqui
      </footer>

      <ToastContainer />
    </div>
  );
};
