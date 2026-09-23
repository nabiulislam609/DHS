import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { FrontendView } from './components/frontend/FrontendView';
import { AdminPanel } from './components/admin/AdminPanel';
import { Shield, Globe } from 'lucide-react';

const MainApp: React.FC = () => {
  const { viewMode, setViewMode } = useSchool();

  return (
    <div className="relative">
      {/* Floating Toggle Button between Frontend & Backend for convenience */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setViewMode(viewMode === 'frontend' ? 'backend' : 'frontend')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl font-bold text-xs transition transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20 bg-emerald-800 hover:bg-emerald-900 text-white"
          title={viewMode === 'frontend' ? 'অ্যাডমিন প্যানেল এ যান' : 'ওয়েবসাইট ভিউ এ যান'}
        >
          {viewMode === 'frontend' ? (
            <>
              <Shield className="w-4 h-4 text-amber-300" />
              <span>এডমিন প্যানেল</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 text-emerald-300" />
              <span>ওয়েবসাইট দেখুন</span>
            </>
          )}
        </button>
      </div>

      {/* Main View Router */}
      {viewMode === 'frontend' ? <FrontendView /> : <AdminPanel />}
    </div>
  );
};

export function App() {
  return (
    <SchoolProvider>
      <MainApp />
    </SchoolProvider>
  );
}

export default App;
