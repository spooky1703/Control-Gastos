/**
 * Funciones de utilidad para cálculos y formateo
 */

import { Week, Expense, Category, CategoryTotals, CATEGORIES } from '@/types';

/**
 * Formatea un número como moneda mexicana
 * @param amount - Cantidad a formatear
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Calcula el total gastado en una semana
 * @param expenses - Lista de gastos
 */
export function calculateTotalSpent(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Calcula cuánto dinero queda
 * @param budget - Presupuesto inicial
 * @param spent - Total gastado
 */
export function calculateRemaining(budget: number, spent: number): number {
    return budget - spent;
}

/**
 * Calcula el porcentaje del presupuesto usado
 * @param budget - Presupuesto inicial
 * @param spent - Total gastado
 */
export function calculatePercentage(budget: number, spent: number): number {
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
}

/**
 * Agrupa gastos por categoría y suma totales
 * @param expenses - Lista de gastos
 */
export function getCategoryTotals(expenses: Expense[]): CategoryTotals {
    const totals: CategoryTotals = {
        comida: 0,
        transporte: 0,
        escuela: 0,
        gustos: 0,
        emergencias: 0,
    };

    expenses.forEach((expense) => {
        totals[expense.category] += expense.amount;
    });

    return totals;
}

/**
 * Obtiene la fecha de inicio de la semana actual (Lunes)
 */
export function getWeekStartDate(date: Date = new Date()): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar a Lunes
    d.setDate(diff);
    return d.toISOString().split('T')[0];
}

/**
 * Obtiene la fecha de fin de la semana (Domingo)
 */
export function getWeekEndDate(startDate: string): string {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
}

/**
 * Formatea una fecha para mostrar
 * @param dateString - Fecha en formato ISO
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
    }).format(date);
}

/**
 * Formatea el rango de fechas de una semana
 */
export function formatWeekRange(startDate: string, endDate: string): string {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    const formatOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
    };

    const startStr = new Intl.DateTimeFormat('es-MX', formatOptions).format(start);
    const endStr = new Intl.DateTimeFormat('es-MX', formatOptions).format(end);

    return `${startStr} - ${endStr}`;
}

/**
 * Obtiene el color basado en el porcentaje gastado
 * Verde (0-50%), Amarillo (50-80%), Rojo (80-100%)
 */
export function getProgressColor(percentage: number): string {
    if (percentage <= 50) return '#22c55e'; // green
    if (percentage <= 80) return '#f59e0b'; // amber
    return '#ef4444'; // red
}

/**
 * Obtiene todas las categorías como array para iteración
 */
export function getAllCategories(): Category[] {
    return Object.keys(CATEGORIES) as Category[];
}
