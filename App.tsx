import React, { useEffect, useRef } from 'react';
import { MemoryRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Calculator, LayoutGrid, Settings } from 'lucide-react';
import { AppProvider } from './contexts/AppContext';

// Pages
import CalculatorEngine from './components/CalculatorEngine';
import ToolsGrid from './components/ToolsGrid';
import ToolRunner from './pages/ToolRunner';
import SettingsPage from './pages/Settings';

const TabBar = () => {
  const Tab = ({ to, icon: Icon, label }: any) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`
      }
    >
      <Icon size={24} strokeWidth={2.5} />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around items-center px-2 pb-2 pt-1 z-50 shadow-lg safe-area-bottom">
      <Tab to="/" label="Tools" icon={LayoutGrid} />
      <Tab to="/calculator" label="Calculator" icon={Calculator} />
      <Tab to="/settings" label="Settings" icon={Settings} />
    </nav>
  );
};

const AppShell = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Scroll to top whenever path changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-dark-bg transition-colors duration-200">
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-[70px]">
        <Routes>
          <Route path="/" element={<ToolsGrid />} />
          <Route path="/calculator" element={<CalculatorEngine />} />
          <Route path="/tool/:toolId" element={<ToolRunner />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <TabBar />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    </AppProvider>
  );
};

export default App;