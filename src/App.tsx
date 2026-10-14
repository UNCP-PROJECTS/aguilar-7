import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Layout } from './components/Layout';
import { Step1RenderCycle } from './components/Step1RenderCycle';
import { Step2ApiFetch } from './components/Step2ApiFetch';
import { Step3ContextDom } from './components/Step3ContextDom';
import { Step4Optimizations } from './components/Step4Optimizations';
import { Step5CustomHooks } from './components/Step5CustomHooks';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTabState] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'all';
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    const url = new URL(window.location.href);
    if (tab === 'all') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', tab);
    }
    window.history.pushState({}, '', url.toString());
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-8">
        {(activeTab === 'all' || activeTab === 'step1') && (
          <Step1RenderCycle />
        )}

        {(activeTab === 'all' || activeTab === 'step2') && (
          <Step2ApiFetch />
        )}

        {(activeTab === 'all' || activeTab === 'step3') && (
          <Step3ContextDom />
        )}

        {(activeTab === 'all' || activeTab === 'step4') && (
          <Step4Optimizations />
        )}

        {(activeTab === 'all' || activeTab === 'step5') && (
          <Step5CustomHooks />
        )}
      </div>
    </Layout>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
