import React, { useState, useEffect, useCallback } from 'react';
import { Delete, RotateCcw, Copy, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const CalculatorEngine: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isSci, setIsSci] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToHistory, decimalPrecision } = useApp();

  // Basic parser
  const safeEvaluate = (expression: string): number => {
    try {
      // Replace symbols for JS
      let sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**')
        .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(');

      // eslint-disable-next-line no-new-func
      return new Function('return ' + sanitized)();
    } catch (e) {
      return NaN;
    }
  };

  const handleInput = (char: string) => {
    setDisplay(prev => {
      if (prev === '0' || prev === 'Error') return char;
      return prev + char;
    });
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const backspace = () => {
    setDisplay(prev => {
      if (prev.length === 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  };

  const calculate = () => {
    const result = safeEvaluate(display);
    if (isNaN(result) || !isFinite(result)) {
      setDisplay('Error');
      return;
    }

    // Format result
    const formatted = parseFloat(result.toFixed(decimalPrecision)).toString();
    
    addToHistory({
      id: Date.now().toString(),
      expression: display,
      result: formatted,
      timestamp: Date.now()
    });

    setEquation(display + ' =');
    setDisplay(formatted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ScientificBtn = ({ label, val }: { label: string, val: string }) => (
    <button
      onClick={() => handleInput(val)}
      className="p-3 bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
    >
      {label}
    </button>
  );

  const CalcButton = ({ label, type = 'num', onClick, wide = false, className }: { label: React.ReactNode, type?: 'num' | 'op' | 'action', onClick?: () => void, wide?: boolean, className?: string }) => {
    let bgClass = 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white'; // default num
    if (type === 'op') bgClass = 'bg-indigo-100 dark:bg-slate-600 text-indigo-700 dark:text-indigo-300 font-bold';
    if (type === 'action') bgClass = 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none';

    return (
      <button
        onClick={onClick || (() => handleInput(label as string))}
        className={`${wide ? 'col-span-2' : ''} ${bgClass} h-16 rounded-2xl text-xl font-medium shadow-sm active:scale-95 transition-all flex items-center justify-center ${className || ''}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto">
      {/* Display */}
      <div className="flex-1 flex flex-col justify-end items-end p-6 bg-transparent">
        <div className="text-slate-400 text-sm mb-2 h-6">{equation}</div>
        <div className="text-5xl font-light text-slate-800 dark:text-white break-all text-right">{display}</div>
        
        <div className="flex gap-4 mt-4 opacity-60">
           <button onClick={handleCopy} className="text-xs flex items-center gap-1 hover:text-indigo-500">
             {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
           </button>
        </div>
      </div>

      {/* Controls Toggle */}
      <div className="px-6 pb-2 flex justify-between items-center">
        <button 
          onClick={() => setIsSci(!isSci)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider px-3 py-1 bg-indigo-50 dark:bg-slate-800 rounded-full"
        >
          {isSci ? 'Standard' : 'Scientific'}
        </button>
        <button onClick={clear} className="text-red-500 p-2">
            <RotateCcw size={20} />
        </button>
      </div>

      {/* Scientific Keypad */}
      {isSci && (
        <div className="grid grid-cols-5 gap-2 px-4 mb-2 animate-fade-in">
          <ScientificBtn label="sin" val="sin(" />
          <ScientificBtn label="cos" val="cos(" />
          <ScientificBtn label="tan" val="tan(" />
          <ScientificBtn label="π" val="π" />
          <ScientificBtn label="e" val="e" />
          <ScientificBtn label="ln" val="ln(" />
          <ScientificBtn label="log" val="log(" />
          <ScientificBtn label="(" val="(" />
          <ScientificBtn label=")" val=")" />
          <ScientificBtn label="^" val="^" />
          <ScientificBtn label="√" val="√(" />
          <ScientificBtn label="!" val="!" />
        </div>
      )}

      {/* Main Keypad */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-t-3xl border-t border-slate-100 dark:border-slate-700">
        <CalcButton label="C" type="op" onClick={clear} />
        <CalcButton label="÷" type="op" />
        <CalcButton label="×" type="op" />
        <CalcButton label={<Delete size={24}/>} type="op" onClick={backspace} />

        <CalcButton label="7" />
        <CalcButton label="8" />
        <CalcButton label="9" />
        <CalcButton label="-" type="op" />

        <CalcButton label="4" />
        <CalcButton label="5" />
        <CalcButton label="6" />
        <CalcButton label="+" type="op" />

        <CalcButton label="1" />
        <CalcButton label="2" />
        <CalcButton label="3" />
        <CalcButton label="=" type="action" onClick={calculate}  className="row-span-2 h-full"/> 
        {/* Note: row-span isn't simple in pure grid without changing structure, keeping simple grid */}
        
        <div className="col-span-4 grid grid-cols-4 gap-3">
             <CalcButton label="." />
            <CalcButton label="0" />
            <CalcButton label="00" />
             <CalcButton label="=" type="action" onClick={calculate} />
        </div>
       
      </div>
    </div>
  );
};

export default CalculatorEngine;