import React, { useState, useMemo } from 'react';
import { TOOLS_DATA } from '../constants';
import { Search, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ToolsGrid: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useApp();

  const filteredTools = useMemo(() => {
    if (!query) return null;
    const allTools = TOOLS_DATA.flatMap(c => c.tools);
    return allTools.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase()) || 
      t.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const allTools = useMemo(() => TOOLS_DATA.flatMap(c => c.tools), []);
  const favoriteTools = useMemo(() => allTools.filter(t => favorites.includes(t.id)), [allTools, favorites]);

  const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <Icon className={className} />;
  };

  const ToolCard: React.FC<{ tool: any }> = ({ tool }) => {
    const isFav = favorites.includes(tool.id);
    
    return (
      <div 
        onClick={() => {
          navigate(`/tool/${tool.id}`);
        }}
        className="group flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-all h-32 relative cursor-pointer"
      >
        <button 
            onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.id);
            }}
            className="absolute top-1 right-1 p-2 rounded-full z-10 active:scale-110 transition-transform"
        >
            <Heart 
                size={18} 
                className={`transition-colors ${isFav ? "text-red-500 fill-red-500" : "text-slate-200 dark:text-slate-700 hover:text-red-400"}`} 
            />
        </button>

        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-3">
          <IconRenderer name={tool.icon} className="w-6 h-6" />
        </div>
        <span className="font-medium text-sm text-slate-700 dark:text-slate-200 text-center leading-tight">
          {tool.name}
        </span>
      </div>
    );
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto">
      {/* Search Bar */}
      <div className="relative mb-6 sticky top-0 z-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          placeholder="Search 75+ tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Favorites Section */}
      {!query && favoriteTools.length > 0 && (
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3 px-1">
             <Heart className="w-5 h-5 text-red-500 fill-red-500" />
             <h3 className="font-bold text-slate-800 dark:text-white">Favorites</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {favoriteTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {query && filteredTools && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-500 mb-3">Search Results</h3>
          <div className="grid grid-cols-3 gap-3">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          {filteredTools.length === 0 && (
             <p className="text-center text-slate-400 py-8">No tools found.</p>
          )}
        </div>
      )}

      {/* Categories */}
      {!query && TOOLS_DATA.map(category => (
        <div key={category.id} className="mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3 px-1">
             <IconRenderer name={category.icon} className="w-5 h-5 text-indigo-500" />
             <h3 className="font-bold text-slate-800 dark:text-white">{category.name}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {category.tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      ))}
      
      {/* Footer Branding */}
      <div className="text-center mt-10 mb-6">
        <p className="text-xs text-slate-400">All-In-One Calculator Pro</p>
        <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">Created by https://calculatordekho.com</p>
      </div>
    </div>
  );
};

export default ToolsGrid;