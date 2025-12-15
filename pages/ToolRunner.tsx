import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ChevronDown } from 'lucide-react';
import { TOOLS_DATA, APP_BRANDING } from '../constants';
import { useApp } from '../contexts/AppContext';
import { convertUnit, CURRENCY_RATES, CONVERSION_DATA } from '../utils/converterUtils';
import { ToolItem } from '../types';

// --- Generic Components ---

const InputField = ({ label, value, onChange, placeholder = "0", type="number" }: any) => (
  <div className="flex flex-col gap-1 mb-3">
    <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-lg font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }: any) => (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
      <div className="relative">
        <select 
            value={value} 
            onChange={e => onChange(e.target.value)}
            className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-lg font-medium appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
        >
            {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={20} />
      </div>
    </div>
  );

const ResultCard = ({ title, value, sub }: any) => (
  <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg mt-4 animate-fade-in">
    <p className="text-indigo-200 text-xs font-bold uppercase mb-1">{title}</p>
    <p className="text-3xl font-bold break-words">{value}</p>
    {sub && <p className="text-indigo-200 text-sm mt-1">{sub}</p>}
  </div>
);

const ActionButton = ({ onClick, label }: any) => (
    <button 
        onClick={onClick}
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all mt-2"
    >
        {label}
    </button>
);

// --- ALGEBRA TOOLS ---

const AverageCalculator = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
  
    const calculate = () => {
      // Robust parsing: split by commas, spaces, or semicolons, ignore empty strings
      const nums = input.split(/[\s,;]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(Number)
        .filter(n => !isNaN(n));

      if (nums.length === 0) {
          setResult(null);
          return;
      }
  
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = sum / nums.length;
      
      const sorted = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  
      const counts: any = {};
      nums.forEach(n => counts[n] = (counts[n] || 0) + 1);
      
      let maxFreq = 0;
      for (const n in counts) {
          if (counts[n] > maxFreq) maxFreq = counts[n];
      }

      let modes: number[] = [];
      if (maxFreq > 1) {
          for (const n in counts) {
              if (counts[n] === maxFreq) modes.push(Number(n));
          }
      }

      const modeStr = (modes.length === 0 || modes.length === nums.length)
        ? 'No Mode'
        : modes.sort((a,b) => a-b).join(', ');
  
      setResult({
          count: nums.length,
          sum,
          mean,
          median,
          mode: modeStr,
          min: sorted[0],
          max: sorted[sorted.length - 1]
      });
    };
  
    return (
      <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Enter Numbers</label>
          <div className="text-xs text-slate-400 mb-1">Separate with commas or spaces (e.g. 10, 20, 30)</div>
          <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 h-32 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              placeholder="10, 20, 30..."
          />
          <ActionButton onClick={calculate} label="Calculate Statistics" />
          
          {result && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 animate-fade-in-up">
                  <div className="bg-indigo-50 dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 uppercase mb-1">Mean (Average)</p>
                      <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{result.mean.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 uppercase mb-1">Median</p>
                      <p className="text-2xl font-bold text-slate-700 dark:text-white">{result.median.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 col-span-full">
                      <p className="text-xs text-slate-500 uppercase mb-1">Mode</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-white">{result.mode}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 uppercase mb-1">Sum</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-white">{result.sum.toLocaleString()}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 uppercase mb-1">Range</p>
                       <p className="text-lg font-bold text-slate-700 dark:text-white">{(result.max - result.min).toLocaleString()}</p>
                  </div>
                  <div className="col-span-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl flex justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>Min: {result.min}</span>
                      <span>Max: {result.max}</span>
                      <span>Count: {result.count}</span>
                  </div>
              </div>
          )}
      </div>
    );
};

const RatioCalculator = () => {
    // A/B = C/D
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    const [d, setD] = useState(''); 
    
    const solve = () => {
        const va = parseFloat(a), vb = parseFloat(b), vc = parseFloat(c), vd = parseFloat(d);
        if (!isNaN(va) && !isNaN(vb) && !isNaN(vc) && a && b && c) {
            setD(((vb * vc) / va).toString());
        } else if (!isNaN(va) && !isNaN(vb) && !isNaN(vd) && a && b && d) {
            setC(((va * vd) / vb).toString());
        } else if (!isNaN(va) && !isNaN(vc) && !isNaN(vd) && a && c && d) {
            setB(((va * vd) / vc).toString());
        } else if (!isNaN(vb) && !isNaN(vc) && !isNaN(vd) && b && c && d) {
            setA(((vb * vc) / vd).toString());
        }
    };

    const reset = () => { setA(''); setB(''); setC(''); setD(''); };

    return (
        <div className="space-y-4">
             <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-sm text-slate-500 mb-2">
                Enter any 3 values to calculate the 4th. (A / B = C / x)
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                    <InputField placeholder="A" value={a} onChange={setA} />
                    <div className="h-px bg-slate-300 dark:bg-slate-600"></div>
                    <InputField placeholder="B" value={b} onChange={setB} />
                </div>
                <div className="text-2xl font-bold text-slate-400">=</div>
                <div className="flex-1 space-y-2">
                    <InputField placeholder="C" value={c} onChange={setC} />
                    <div className="h-px bg-slate-300 dark:bg-slate-600"></div>
                    <InputField placeholder="D" value={d} onChange={setD} />
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={reset} className="flex-1 p-3 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold dark:text-white">Reset</button>
                <button onClick={solve} className="flex-[2] p-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none">Calculate</button>
            </div>
        </div>
    );
};

const EquationSolver = () => {
    const [type, setType] = useState('linear');
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const solve = () => {
        const valA = parseFloat(a);
        const valB = parseFloat(b);
        
        if (isNaN(valA) || isNaN(valB)) return;

        if (type === 'linear') {
            if (valA === 0) setResult("Invalid (a cannot be 0)");
            else setResult(`x = ${(-valB / valA).toFixed(4)}`);
        } else {
            const valC = parseFloat(c);
            if (isNaN(valC)) return;

            const delta = valB * valB - 4 * valA * valC;
            if (delta < 0) {
                setResult("No real roots");
            } else if (delta === 0) {
                const x = -valB / (2 * valA);
                setResult(`x = ${x.toFixed(4)}`);
            } else {
                const x1 = (-valB + Math.sqrt(delta)) / (2 * valA);
                const x2 = (-valB - Math.sqrt(delta)) / (2 * valA);
                setResult(`x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`);
            }
        }
    };

    return (
        <div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                <button onClick={() => {setType('linear'); setResult(null);}} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === 'linear' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600' : 'text-slate-500'}`}>Linear</button>
                <button onClick={() => {setType('quad'); setResult(null);}} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === 'quad' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600' : 'text-slate-500'}`}>Quadratic</button>
            </div>
            <div className="space-y-4">
                <p className="text-center font-mono text-slate-500 mb-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    {type === 'linear' ? 'ax + b = 0' : 'ax² + bx + c = 0'}
                </p>
                <InputField label="a" value={a} onChange={setA} />
                <InputField label="b" value={b} onChange={setB} />
                {type === 'quad' && <InputField label="c" value={c} onChange={setC} />}
                <ActionButton onClick={solve} label="Solve" />
                {result && <ResultCard title="Result" value={result} />}
            </div>
        </div>
    );
};

const PercentageCalculator = () => {
    const [val, setVal] = useState('');
    const [percent, setPercent] = useState('');
    const [mode, setMode] = useState<'simple' | 'increase' | 'decrease' | 'fraction'>('simple');
  
    const v = parseFloat(val);
    const p = parseFloat(percent);
    let res: number | null = null;
    let formulaDisplay = '';
  
    if (!isNaN(v) && !isNaN(p)) {
      if (mode === 'simple') {
        res = (p * v) / 100;
        formulaDisplay = `${p}% of ${v}`;
      } else if (mode === 'increase') {
        const increase = (v * p) / 100;
        res = v + increase;
        formulaDisplay = `${v} + ${increase.toFixed(2)} (${p}%)`;
      } else if (mode === 'decrease') {
        const decrease = (v * p) / 100;
        res = v - decrease;
        formulaDisplay = `${v} - ${decrease.toFixed(2)} (${p}%)`;
      } else if (mode === 'fraction') {
        if (v !== 0) {
          res = (p / v) * 100;
          formulaDisplay = `${p} is ${res.toFixed(2)}% of ${v}`;
        }
      }
    }
  
    const modeLabels = {
      simple: 'Simple %',
      increase: '% Increase',
      decrease: '% Decrease',
      fraction: '% of Total'
    };
  
    const isFraction = mode === 'fraction';
  
    return (
      <div className="space-y-6">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {(Object.keys(modeLabels) as Array<keyof typeof modeLabels>).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                mode === m 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
  
        <div className="space-y-4">
          <div className="flex items-end gap-3">
             <div className="flex-1">
              <InputField 
                label={isFraction ? "Part Value" : "Percentage (%)"} 
                value={percent} 
                onChange={setPercent} 
                placeholder={isFraction ? "e.g. 25" : "e.g. 20"} 
              />
             </div>
             {!isFraction && <div className="pb-4 text-slate-500 font-bold w-6 text-center">%</div>}
          </div>
          <div className="flex items-end gap-3">
             <div className="pb-4 text-slate-500 font-bold w-6 text-center">
               {mode === 'simple' || mode === 'fraction' ? 'of' : 'on'}
             </div>
             <div className="flex-1">
              <InputField 
                label={isFraction ? "Total Value" : "Base Value"} 
                value={val} 
                onChange={setVal} 
                placeholder="e.g. 100" 
              />
             </div>
          </div>
        </div>
        
        {res !== null && (
          <ResultCard 
            title="Result" 
            value={res.toLocaleString(undefined, { maximumFractionDigits: 6 }) + (isFraction ? '%' : '')} 
            sub={formulaDisplay}
          />
        )}
      </div>
    );
};

// --- GEOMETRY TOOLS ---

const GeometryCalculator = ({ type }: { type: '2d' | '3d' }) => {
    const shapes2D = [
        { value: 'square', label: 'Square' },
        { value: 'rect', label: 'Rectangle' },
        { value: 'circle', label: 'Circle' },
        { value: 'triangle', label: 'Triangle' }
    ];
    const shapes3D = [
        { value: 'cube', label: 'Cube' },
        { value: 'sphere', label: 'Sphere' },
        { value: 'cylinder', label: 'Cylinder' },
        { value: 'cone', label: 'Cone' }
    ];

    const [shape, setShape] = useState(type === '2d' ? 'rect' : 'cylinder');
    const [v1, setV1] = useState(''); // side / length / radius
    const [v2, setV2] = useState(''); // width / height
    const [v3, setV3] = useState(''); // height (for triangle/trapezoid)
    
    const [res, setRes] = useState<any>(null);

    useEffect(() => { setV1(''); setV2(''); setV3(''); setRes(null); }, [shape]);

    const calculate = () => {
        const a = parseFloat(v1), b = parseFloat(v2), c = parseFloat(v3);
        let area = 0, perimeter = 0, volume = 0;

        if (type === '2d') {
            if (shape === 'square') {
                if (isNaN(a)) return;
                area = a * a; perimeter = 4 * a;
            } else if (shape === 'rect') {
                if (isNaN(a) || isNaN(b)) return;
                area = a * b; perimeter = 2 * (a + b);
            } else if (shape === 'circle') {
                if (isNaN(a)) return;
                area = Math.PI * a * a; perimeter = 2 * Math.PI * a;
            } else if (shape === 'triangle') {
                if (isNaN(a) || isNaN(b)) return;
                area = 0.5 * a * b; // base * height
                perimeter = a + b + Math.sqrt(a*a + b*b); 
            }
            setRes({ label1: 'Area', val1: area.toFixed(2), label2: 'Perimeter', val2: perimeter.toFixed(2) });
        } else {
            if (shape === 'cube') {
                 if (isNaN(a)) return;
                volume = a * a * a; area = 6 * a * a;
            } else if (shape === 'sphere') {
                 if (isNaN(a)) return;
                volume = (4/3) * Math.PI * Math.pow(a, 3); area = 4 * Math.PI * a * a;
            } else if (shape === 'cylinder') {
                 if (isNaN(a) || isNaN(b)) return;
                volume = Math.PI * a * a * b; area = 2 * Math.PI * a * (a + b);
            } else if (shape === 'cone') {
                 if (isNaN(a) || isNaN(b)) return;
                volume = Math.PI * a * a * (b/3);
                const s = Math.sqrt(a*a + b*b);
                area = Math.PI * a * (a + s);
            }
            setRes({ label1: 'Volume', val1: volume.toFixed(2), label2: 'Surface Area', val2: area.toFixed(2) });
        }
    };

    return (
        <div className="space-y-4">
            <SelectField 
                label="Select Shape" 
                value={shape} 
                onChange={setShape} 
                options={type === '2d' ? shapes2D : shapes3D} 
            />
            {shape === 'square' && <InputField label="Side Length" value={v1} onChange={setV1} />}
            {shape === 'rect' && (
                <>
                    <InputField label="Length" value={v1} onChange={setV1} />
                    <InputField label="Width" value={v2} onChange={setV2} />
                </>
            )}
            {shape === 'circle' && <InputField label="Radius" value={v1} onChange={setV1} />}
            {shape === 'triangle' && (
                <>
                    <InputField label="Base" value={v1} onChange={setV1} />
                    <InputField label="Height" value={v2} onChange={setV2} />
                </>
            )}

            {shape === 'cube' && <InputField label="Edge Length" value={v1} onChange={setV1} />}
            {shape === 'sphere' && <InputField label="Radius" value={v1} onChange={setV1} />}
            {(shape === 'cylinder' || shape === 'cone') && (
                <>
                    <InputField label="Radius" value={v1} onChange={setV1} />
                    <InputField label="Height" value={v2} onChange={setV2} />
                </>
            )}
            <ActionButton onClick={calculate} label="Calculate" />
            {res && (
                 <div className="grid grid-cols-2 gap-3 mt-4">
                     <ResultCard title={res.label1} value={res.val1} />
                     <ResultCard title={res.label2} value={res.val2} />
                 </div>
            )}
        </div>
    );
};

// --- FINANCE TOOLS ---

const LoanCalculator = () => {
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState('');
    const [years, setYears] = useState('');
    const [monthly, setMonthly] = useState<string | null>(null);
    const [total, setTotal] = useState<string | null>(null);

    const calculate = () => {
        const p = parseFloat(amount);
        const r = parseFloat(rate) / 100 / 12;
        const n = parseFloat(years) * 12;
        
        if (p && r && n) {
            const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            setMonthly(emi.toFixed(2));
            setTotal((emi * n).toFixed(2));
        }
    };

    return (
        <div className="space-y-4">
            <InputField label="Loan Amount" value={amount} onChange={setAmount} />
            <InputField label="Interest Rate (% per year)" value={rate} onChange={setRate} />
            <InputField label="Loan Term (Years)" value={years} onChange={setYears} />
            <ActionButton onClick={calculate} label="Calculate EMI" />
            
            {monthly && (
                <div className="space-y-3">
                    <ResultCard title="Monthly Payment (EMI)" value={monthly} />
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase">Total Payment</p>
                        <p className="text-xl font-bold dark:text-white">{total}</p>
                        <p className="text-xs text-slate-400 mt-1">Interest: {((parseFloat(total!) - parseFloat(amount)).toFixed(2))}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const TipCalculator = () => {
    const [bill, setBill] = useState('');
    const [tip, setTip] = useState('15');
    const [people, setPeople] = useState('1');

    const b = parseFloat(bill) || 0;
    const t = parseFloat(tip) || 0;
    const p = parseFloat(people) || 1;

    const tipAmount = (b * t) / 100;
    const total = b + tipAmount;
    const perPerson = total / p;

    return (
        <div className="space-y-4">
            <InputField label="Bill Amount" value={bill} onChange={setBill} />
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Tip Percentage: {tip}%</label>
                <input 
                    type="range" min="0" max="50" value={tip} 
                    onChange={e => setTip(e.target.value)}
                    className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span><span>15%</span><span>25%</span><span>50%</span>
                </div>
            </div>
            <InputField label="Split Between (People)" value={people} onChange={setPeople} />
            <div className="grid grid-cols-2 gap-4 mt-6">
                <ResultCard title="Tip Amount" value={tipAmount.toFixed(2)} />
                <ResultCard title="Total Bill" value={total.toFixed(2)} />
                <div className="col-span-2">
                    <ResultCard title="Per Person" value={perPerson.toFixed(2)} />
                </div>
            </div>
        </div>
    );
};

const TaxCalculator = () => {
    const [amount, setAmount] = useState('');
    const [tax, setTax] = useState('');
    
    const a = parseFloat(amount) || 0;
    const t = parseFloat(tax) || 0;
    const taxVal = (a * t) / 100;

    return (
        <div className="space-y-4">
            <InputField label="Initial Amount" value={amount} onChange={setAmount} />
            <InputField label="Tax Rate (%)" value={tax} onChange={setTax} />
            <div className="grid grid-cols-2 gap-3 mt-4">
                <ResultCard title="Tax Amount" value={taxVal.toFixed(2)} />
                <ResultCard title="Net Amount" value={(a + taxVal).toFixed(2)} sub="Amount + Tax" />
            </div>
        </div>
    );
};

const CurrencyConverter = () => {
  const currencies = Object.keys(CURRENCY_RATES);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState('1');

  const rate = (CURRENCY_RATES[to] / CURRENCY_RATES[from]);
  const result = parseFloat(amount) ? parseFloat(amount) * rate : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <span className="text-xs text-yellow-700 dark:text-yellow-400">
          Using offline rates. Last updated: Today
        </span>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-xs text-slate-500 mb-1">From</label>
           <select value={from} onChange={e => setFrom(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
             {currencies.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
        <div>
           <label className="block text-xs text-slate-500 mb-1">To</label>
           <select value={to} onChange={e => setTo(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
             {currencies.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
      </div>
      <InputField label="Amount" value={amount} onChange={setAmount} />
       <ResultCard 
         title="Converted Amount" 
         value={`${result.toFixed(2)} ${to}`} 
         sub={`1 ${from} = ${rate.toFixed(4)} ${to}`} 
      />
    </div>
  );
};

// --- HEALTH & MISC ---

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height); // assumed cm
    if (w && h) {
      const hM = h / 100;
      setBmi(w / (hM * hM));
    } else {
      setBmi(null);
    }
  }, [weight, height]);

  let category = '';
  if (bmi) {
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
  }

  return (
    <div className="space-y-4">
      <InputField label="Weight (kg)" value={weight} onChange={setWeight} />
      <InputField label="Height (cm)" value={height} onChange={setHeight} />
      {bmi !== null && (
        <ResultCard title="Your BMI" value={bmi.toFixed(1)} sub={category} />
      )}
    </div>
  );
};

const BodyFatCalculator = () => {
    const [waist, setWaist] = useState('');
    const [neck, setNeck] = useState('');
    const [height, setHeight] = useState('');
    const [res, setRes] = useState<string | null>(null);

    const calculate = () => {
        const h = parseFloat(height);
        const w = parseFloat(waist);
        const n = parseFloat(neck);
        if (h && w && n && w > n) {
            // US Navy Method (Men) Metric: 495 / (1.0324 - 0.19077 * log10(waist-neck) + 0.15456 * log10(height)) - 450
            const bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
            setRes(bf.toFixed(1) + '%');
        } else {
            setRes(null);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-xs text-slate-400 mb-2">US Navy Method (Men's Approximation)</p>
            <InputField label="Height (cm)" value={height} onChange={setHeight} />
            <InputField label="Waist (cm)" value={waist} onChange={setWaist} />
            <InputField label="Neck (cm)" value={neck} onChange={setNeck} />
            <ActionButton onClick={calculate} label="Calculate" />
            {res && <ResultCard title="Body Fat Percentage" value={res} />}
        </div>
    );
};

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<any>(null);

  useEffect(() => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAge({ years, months, days });
  }, [birthDate]);

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
      <input 
        type="date" 
        value={birthDate} 
        onChange={e => setBirthDate(e.target.value)} 
        className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 text-lg"
      />
      {age && (
        <ResultCard 
          title="Your Age" 
          value={`${age.years} Years`} 
          sub={`${age.months} Months, ${age.days} Days`} 
        />
      )}
    </div>
  );
};

const DateDiffCalculator = () => {
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    const [diff, setDiff] = useState<string | null>(null);

    const calculate = () => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setDiff(`${dayDiff} Days`);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase">Start Date</label>
            <input type="date" value={d1} onChange={e => setD1(e.target.value)} className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700" />
            
            <label className="block text-xs font-bold text-slate-500 uppercase">End Date</label>
            <input type="date" value={d2} onChange={e => setD2(e.target.value)} className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700" />
            
            <ActionButton onClick={calculate} label="Calculate Difference" />
            {diff && <ResultCard title="Time Difference" value={diff} />}
        </div>
    );
};

const OhmCalculator = () => {
    const [v, setV] = useState('');
    const [i, setI] = useState('');
    const [r, setR] = useState('');
    const reset = () => { setV(''); setI(''); setR(''); };

    const calculate = () => {
        const valV = parseFloat(v);
        const valI = parseFloat(i);
        const valR = parseFloat(r);
        
        if (!isNaN(valI) && !isNaN(valR) && v === '') setV((valI * valR).toString());
        else if (!isNaN(valV) && !isNaN(valR) && i === '') setI((valV / valR).toString());
        else if (!isNaN(valV) && !isNaN(valI) && r === '') setR((valV / valI).toString());
    }

    return (
        <div className="space-y-4">
             <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm text-slate-500 mb-4">
                Enter any two values to calculate the third.
            </div>
            <InputField label="Voltage (V)" value={v} onChange={setV} />
            <InputField label="Current (A)" value={i} onChange={setI} />
            <InputField label="Resistance (Ω)" value={r} onChange={setR} />
            <div className="flex gap-2 mt-4">
                <button onClick={reset} className="flex-1 p-3 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold dark:text-white">Reset</button>
                <button onClick={calculate} className="flex-[2] p-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg">Calculate</button>
            </div>
        </div>
    );
};

const MileageCalculator = () => {
    const [dist, setDist] = useState('');
    const [fuel, setFuel] = useState('');
    const [res, setRes] = useState<string | null>(null);

    const calculate = () => {
        const d = parseFloat(dist);
        const f = parseFloat(fuel);
        if (d && f) {
            setRes((d / f).toFixed(2) + ' km/L');
        }
    };

    return (
        <div className="space-y-4">
            <InputField label="Distance (km)" value={dist} onChange={setDist} />
            <InputField label="Fuel Used (Litres)" value={fuel} onChange={setFuel} />
            <ActionButton onClick={calculate} label="Calculate Mileage" />
            {res && <ResultCard title="Mileage" value={res} />}
        </div>
    );
};

const UnitConverter = ({ category }: { category: string }) => {
  const units = Object.keys(CONVERSION_DATA[category] || {});
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1] || units[0]);
  const [val, setVal] = useState('1');

  const result = parseFloat(val) ? convertUnit(parseFloat(val), from, to, category) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
        <div className="flex flex-col">
           <label className="text-xs text-slate-500 mb-1">From</label>
           <select value={from} onChange={e => setFrom(e.target.value)} className="p-2 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700">
             {units.map(u => <option key={u} value={u}>{u}</option>)}
           </select>
        </div>
        <div className="pt-4 text-slate-400">→</div>
        <div className="flex flex-col">
           <label className="text-xs text-slate-500 mb-1">To</label>
           <select value={to} onChange={e => setTo(e.target.value)} className="p-2 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700">
             {units.map(u => <option key={u} value={u}>{u}</option>)}
           </select>
        </div>
      </div>
      <InputField label="Value" value={val} onChange={setVal} />
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl text-center">
        <p className="text-slate-500 text-sm mb-2">Result</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-white">
          {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} <span className="text-base font-normal text-slate-500">{to}</span>
        </p>
      </div>
    </div>
  );
};

// --- Main Runner ---

const ToolRunner: React.FC = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { addRecentTool, favorites, toggleFavorite } = useApp();

  const toolItem: ToolItem | undefined = TOOLS_DATA
    .flatMap(c => c.tools)
    .find(t => t.id === toolId);

  useEffect(() => {
    if (toolId) addRecentTool(toolId);
  }, [toolId, addRecentTool]);

  if (!toolItem) {
    return <div className="p-8 text-center">Tool not found</div>;
  }

  const isFav = favorites.includes(toolItem.id);

  const renderToolContent = () => {
    switch (toolItem.id) {
      // Algebra
      case 'percentage': return <PercentageCalculator />;
      case 'average': return <AverageCalculator />;
      case 'ratio': return <RatioCalculator />;
      case 'solver': return <EquationSolver />;
      
      // Geometry
      case 'shapes_2d': return <GeometryCalculator type="2d" />;
      case 'shapes_3d': return <GeometryCalculator type="3d" />;

      // Finance
      case 'currency': return <CurrencyConverter />;
      case 'loan': return <LoanCalculator />;
      case 'tip': return <TipCalculator />;
      case 'tax': return <TaxCalculator />;
      
      // Health
      case 'bmi': return <BMICalculator />;
      case 'body_fat': return <BodyFatCalculator />;

      // Date
      case 'age': return <AgeCalculator />;
      case 'date_diff': return <DateDiffCalculator />;

      // Misc
      case 'ohm': return <OhmCalculator />;
      case 'mileage': return <MileageCalculator />;

      // Default Converters
      case 'length':
      case 'weight':
      case 'temp':
      case 'area':
      case 'speed':
      case 'digital':
        return <UnitConverter category={toolItem.id} />;
        
      default:
        return (
          <div className="text-center py-10 opacity-50">
            <p>Tool under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 z-20">
        <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all">
          <ArrowLeft size={24} className="text-slate-700 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-slate-800 dark:text-white">{toolItem.name}</h1>
        <button onClick={() => toggleFavorite(toolItem.id)} className="p-2 active:scale-95 transition-all">
          <Star size={24} className={isFav ? "fill-yellow-400 text-yellow-400" : "text-slate-400"} />
        </button>
      </div>

      <div className="p-4 max-w-lg mx-auto animate-fade-in-up">
         {renderToolContent()}
      </div>
      
       <div className="mt-8 text-center px-4">
        <p className="text-[10px] text-slate-300 dark:text-slate-600">{APP_BRANDING}</p>
      </div>
    </div>
  );
};

export default ToolRunner;