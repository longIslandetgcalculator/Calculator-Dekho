import { ToolCategory } from './types';
import { 
  Calculator, Percent, Ruler, Scale, RefreshCw, 
  Calendar, Activity, Zap, Layers, DollarSign 
} from 'lucide-react';

export const TOOLS_DATA: ToolCategory[] = [
  {
    id: 'algebra',
    name: 'Algebra',
    icon: 'Percent',
    tools: [
      { id: 'percentage', name: 'Percentage', description: 'Simple, Increase, Decrease', icon: 'Percent', category: 'algebra' },
      { id: 'average', name: 'Average', description: 'Mean, Median, Mode', icon: 'Calculator', category: 'algebra' },
      { id: 'ratio', name: 'Ratio', description: 'Solve proportions', icon: 'Divide', category: 'algebra' },
      { id: 'solver', name: 'Equation Solver', description: 'Linear & Quadratic', icon: 'Function', category: 'algebra' },
    ]
  },
  {
    id: 'geometry',
    name: 'Geometry',
    icon: 'Layers',
    tools: [
      { id: 'shapes_2d', name: '2D Shapes', description: 'Area & Perimeter', icon: 'Square', category: 'geometry' },
      { id: 'shapes_3d', name: '3D Bodies', description: 'Volume & Surface Area', icon: 'Box', category: 'geometry' },
    ]
  },
  {
    id: 'converters',
    name: 'Unit Converters',
    icon: 'RefreshCw',
    tools: [
      { id: 'length', name: 'Length', description: 'm, ft, in, cm, km', icon: 'Ruler', category: 'converters' },
      { id: 'weight', name: 'Weight/Mass', description: 'kg, lb, oz, g', icon: 'Scale', category: 'converters' },
      { id: 'temp', name: 'Temperature', description: 'C, F, K', icon: 'Thermometer', category: 'converters' },
      { id: 'area', name: 'Area', description: 'sq m, acre, hectare', icon: 'Grid', category: 'converters' },
      { id: 'speed', name: 'Speed', description: 'km/h, mph, m/s', icon: 'Gauge', category: 'converters' },
      { id: 'digital', name: 'Digital Storage', description: 'Bit, Byte, KB, MB', icon: 'HardDrive', category: 'converters' },
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'DollarSign',
    tools: [
      { id: 'currency', name: 'Currency', description: '160+ Currencies', icon: 'Coins', category: 'finance' },
      { id: 'loan', name: 'Loan / EMI', description: 'Calculate payments', icon: 'Banknote', category: 'finance' },
      { id: 'tip', name: 'Tip Split', description: 'Bill splitter', icon: 'Users', category: 'finance' },
      { id: 'tax', name: 'Sales Tax', description: 'VAT / GST', icon: 'Tag', category: 'finance' },
    ]
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'Activity',
    tools: [
      { id: 'bmi', name: 'BMI', description: 'Body Mass Index', icon: 'Activity', category: 'health' },
      { id: 'body_fat', name: 'Body Fat', description: 'Estimate percentage', icon: 'UserCheck', category: 'health' },
    ]
  },
  {
    id: 'date',
    name: 'Date & Time',
    icon: 'Calendar',
    tools: [
      { id: 'age', name: 'Age Calculator', description: 'Years, months, days', icon: 'Calendar', category: 'date' },
      { id: 'date_diff', name: 'Date Difference', description: 'Time between dates', icon: 'Clock', category: 'date' },
    ]
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    icon: 'Zap',
    tools: [
      { id: 'ohm', name: "Ohm's Law", description: 'Voltage, Current, Resistance', icon: 'Zap', category: 'misc' },
      { id: 'mileage', name: 'Fuel Mileage', description: 'MPG, Km/L', icon: 'Truck', category: 'misc' },
    ]
  }
];

export const APP_BRANDING = "Created by https://calculatordekho.com";
