import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Moon, Sun, Trash2, Github, Info, Globe } from 'lucide-react';
import { APP_BRANDING } from '../constants';

const Settings: React.FC = () => {
  const { theme, setTheme, clearHistory, decimalPrecision, setDecimalPrecision } = useApp();

  const Section = ({ title, children }: any) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const Row = ({ label, action }: any) => (
    <div className="flex justify-between items-center">
      <span className="text-slate-700 dark:text-slate-200 font-medium">{label}</span>
      {action}
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Settings</h1>

      <Section title="Appearance">
        <Row 
          label="App Theme" 
          action={
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              <button 
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
              >
                <Sun size={20} />
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-slate-700 shadow text-indigo-400' : 'text-slate-400'}`}
              >
                <Moon size={20} />
              </button>
            </div>
          }
        />
      </Section>

      <Section title="Calculator">
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-200 font-medium">Decimal Precision</span>
                <span className="font-bold text-indigo-600">{decimalPrecision}</span>
            </div>
            <input 
                type="range" min="0" max="10" 
                value={decimalPrecision}
                onChange={(e) => setDecimalPrecision(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
        <button 
          onClick={clearHistory}
          className="w-full flex items-center justify-between text-red-500 font-medium active:opacity-70"
        >
          Clear History <Trash2 size={18} />
        </button>
      </Section>

      <Section title="About">
        <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                All-In-One Calculator Pro is a complete suite of tools for daily use. 
                Completely free, offline-first, and private.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-500">
                <Info size={16} /> Version 1.0.0
            </div>
             <a href="https://calculatordekho.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                <Globe size={16} /> Visit Website
            </a>
        </div>
      </Section>

       <div className="mt-8 text-center space-y-2">
          <p className="font-bold text-slate-800 dark:text-white">All-In-One Calculator Pro</p>
          <p className="text-xs text-slate-400">{APP_BRANDING}</p>
      </div>
    </div>
  );
};

export default Settings;
