/**
 * Tipos principales para la app de control de gastos
 * Estética japonesa minimalista
 */

// Categorías disponibles para clasificar gastos
export type Category = 'comida' | 'transporte' | 'escuela' | 'gustos' | 'emergencias';

// Información de cada categoría para UI
export interface CategoryInfo {
  label: string;
  kanji: string;
  color: string;
}

// Mapeo de categorías con propiedades visuales
export const CATEGORIES: Record<Category, CategoryInfo> = {
  comida: { label: 'Comida', kanji: '食', color: '#5C5C56' },
  transporte: { label: 'Transporte', kanji: '道', color: '#5C5C56' },
  escuela: { label: 'Escuela', kanji: '学', color: '#5C5C56' },
  gustos: { label: 'Gustos', kanji: '楽', color: '#5C5C56' },
  emergencias: { label: 'Emergencias', kanji: '急', color: '#C73E1D' },
};

// Representa un gasto individual
export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description?: string;
  date: string;
  createdAt: string;
}

// Límites por categoría (opcional por categoría)
export type CategoryLimits = Partial<Record<Category, number>>;

// Representa una semana con su presupuesto, gastos y límites
export interface Week {
  id: string;
  startDate: string;
  endDate: string;
  initialBudget: number;
  expenses: Expense[];
  categoryLimits?: CategoryLimits; // Límites opcionales por categoría
}

// Estado global de la aplicación
export interface AppState {
  weeks: Week[];
  currentWeekId: string | null;
}

// Tipo para los totales por categoría
export type CategoryTotals = Record<Category, number>;

// Información de alerta de límite excedido
export interface LimitWarning {
  category: Category;
  limit: number;
  spent: number;
  percentage: number;
}
