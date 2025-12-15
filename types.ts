export type Theme = 'light' | 'dark';

export interface CalculatorHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: ToolItem[];
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  category: string;
  isFavorite?: boolean;
}

export interface AppState {
  theme: Theme;
  history: CalculatorHistoryItem[];
  favorites: string[]; // Tool IDs
  recentTools: string[]; // Tool IDs
  decimalPrecision: number;
}

export interface UnitDefinition {
  name: string;
  factor: number; // Conversion factor to base unit
  offset?: number; // For temperature
}

export interface CurrencyRate {
  code: string;
  rate: number; // Against USD
  name: string;
}
