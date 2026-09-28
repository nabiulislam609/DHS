import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { FrontendView } from './components/frontend/FrontendView';
import { AdminPanel } from './components/admin/AdminPanel';
import { DedicatedResultsPage } from './components/frontend/DedicatedResultsPage';
import { DedicatedNoticesPage } from './components/frontend/DedicatedNoticesPage';
import { DedicatedTeachersPage } from './components/frontend/DedicatedTeachersPage';
import { DedicatedStaffPage } from './components/frontend/DedicatedStaffPage';
import { Shield, Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const { viewMode, currentFrontendPage, setViewMode } = useSchool();

  // Full-page dedicated routes
  if (currentFrontendPage === 'results') {
    return <DedicatedResultsPage />;
  }

  if (currentFrontendPage === 'notices') {
    return <DedicatedNoticesPage />;
  }

  if (currentFrontendPage === 'teachers') {
    return <DedicatedTeachersPage />;
  }

  if (currentFrontendPage === 'staff') {
    return <DedicatedStaffPage />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Switch between original Frontend Website and original Admin Dashboard */}
      {viewMode === 'frontend' ? <FrontendView /> : <AdminPanel />}

      {/* Floating Toggle Button for Instant 1-Click Switch */}
      <div className="fixed bottom-5 right-5 z-50 no-print">
        {viewMode === 'frontend' ? (
          <button
            onClick={() => setViewMode('backend')}
            className="flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2.5 rounded-full shadow-2xl font-bold text-xs border-2 border-white transition-all transform hover:scale-105 cursor-pointer active:scale-95"
            title="এডমিন ড্যাশবোর্ডে প্রবেশ করুন"
          >
            <Shield className="w-4 h-4 text-emerald-200" />
            <span>এডমিন ড্যাশবোর্ড</span>
          </button>
        ) : (
          <button
            onClick={() => setViewMode('frontend')}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-full shadow-2xl font-bold text-xs border-2 border-white transition-all transform hover:scale-105 cursor-pointer active:scale-95"
            title="লাইভ ওয়েবসাইট দেখুন"
          >
            <Globe className="w-4 h-4 text-blue-200" />
            <span>ওয়েবসাইট ভিউ</span>
          </button>
        )}
      </div>
    </div>
  );
};

export function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}

export default App;
