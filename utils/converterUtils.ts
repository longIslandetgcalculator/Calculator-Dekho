// Conversion factors relative to a base unit
export const CONVERSION_DATA: Record<string, Record<string, number>> = {
  length: {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
  },
  area: {
    'sq m': 1,
    'sq ft': 0.092903,
    'sq in': 0.00064516,
    'acre': 4046.86,
    'hectare': 10000,
  },
  speed: {
    'm/s': 1,
    'km/h': 0.277778,
    'mph': 0.44704,
    'knots': 0.514444
  },
  digital: {
    'byte': 1,
    'kb': 1024,
    'mb': 1048576,
    'gb': 1073741824,
    'tb': 1099511627776
  }
};

// Simple Mock Currency Data (In a real app, fetch from API)
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.4,
  INR: 83.3,
  CAD: 1.36,
  AUD: 1.52,
  CNY: 7.23,
  BRL: 5.05,
  RUB: 92.5
};

export const convertUnit = (val: number, from: string, to: string, type: string): number => {
  if (type === 'temp') {
    // Temperature has offsets, handle separately
    let celsius = val;
    if (from === 'F') celsius = (val - 32) * 5/9;
    if (from === 'K') celsius = val - 273.15;
    
    if (to === 'C') return celsius;
    if (to === 'F') return (celsius * 9/5) + 32;
    if (to === 'K') return celsius + 273.15;
    return val;
  }

  const factors = CONVERSION_DATA[type];
  if (!factors) return val;
  
  const baseValue = val * factors[from];
  return baseValue / factors[to];
};
