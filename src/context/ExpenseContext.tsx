'use client';

/**
 * Context Provider para el estado global de la app
 * Maneja semanas, gastos, límites y persistencia en LocalStorage
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    ReactNode,
} from 'react';
import { Week, Expense, Category, CategoryTotals, CategoryLimits, LimitWarning } from '@/types';
import { saveToStorage, loadFromStorage, generateId } from '@/lib/storage';
import {
    calculateTotalSpent,
    calculateRemaining,
    calculatePercentage,
    getCategoryTotals,
    getWeekStartDate,
    getWeekEndDate,
    getAllCategories,
} from '@/lib/utils';

// Tipo del contexto con todas las funciones y estado
interface ExpenseContextType {
    // Estado
    weeks: Week[];
    currentWeek: Week | null;
    isLoading: boolean;

    // Valores calculados
    totalSpent: number;
    remaining: number;
    percentageUsed: number;
    categoryTotals: CategoryTotals;

    // Límites
    categoryLimits: CategoryLimits;
    limitWarnings: LimitWarning[];

    // Acciones
    createWeek: (initialBudget: number, limits?: CategoryLimits) => void;
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
    deleteExpense: (expenseId: string) => void;
    selectWeek: (weekId: string) => void;
    updateWeekBudget: (weekId: string, newBudget: number) => void;
    updateCategoryLimits: (limits: CategoryLimits) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

interface ExpenseProviderProps {
    children: ReactNode;
}

export function ExpenseProvider({ children }: ExpenseProviderProps) {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [currentWeekId, setCurrentWeekId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos de LocalStorage al montar
    useEffect(() => {
        const savedState = loadFromStorage();
        if (savedState) {
            setWeeks(savedState.weeks);
            setCurrentWeekId(savedState.currentWeekId);
        }
        setIsLoading(false);
    }, []);

    // Guardar en LocalStorage cuando cambia el estado
    useEffect(() => {
        if (!isLoading) {
            saveToStorage({ weeks, currentWeekId });
        }
    }, [weeks, currentWeekId, isLoading]);

    // Obtener la semana actual
    const currentWeek = useMemo(() => {
        return weeks.find((w) => w.id === currentWeekId) || null;
    }, [weeks, currentWeekId]);

    // Valores calculados
    const totalSpent = useMemo(() => {
        return currentWeek ? calculateTotalSpent(currentWeek.expenses) : 0;
    }, [currentWeek]);

    const remaining = useMemo(() => {
        return currentWeek ? calculateRemaining(currentWeek.initialBudget, totalSpent) : 0;
    }, [currentWeek, totalSpent]);

    const percentageUsed = useMemo(() => {
        return currentWeek ? calculatePercentage(currentWeek.initialBudget, totalSpent) : 0;
    }, [currentWeek, totalSpent]);

    const categoryTotals = useMemo(() => {
        return currentWeek ? getCategoryTotals(currentWeek.expenses) : getCategoryTotals([]);
    }, [currentWeek]);

    // Límites de la semana actual
    const categoryLimits = useMemo(() => {
        return currentWeek?.categoryLimits || {};
    }, [currentWeek]);

    // Calcular advertencias de límites excedidos o cercanos (>80%)
    const limitWarnings = useMemo((): LimitWarning[] => {
        if (!currentWeek?.categoryLimits) return [];

        const warnings: LimitWarning[] = [];
        const categories = getAllCategories();

        categories.forEach((cat) => {
            const limit = currentWeek.categoryLimits?.[cat];
            if (limit && limit > 0) {
                const spent = categoryTotals[cat];
                const percentage = (spent / limit) * 100;

                // Advertir si está al 80% o más del límite
                if (percentage >= 80) {
                    warnings.push({
                        category: cat,
                        limit,
                        spent,
                        percentage,
                    });
                }
            }
        });

        // Ordenar por porcentaje (más excedidos primero)
        return warnings.sort((a, b) => b.percentage - a.percentage);
    }, [currentWeek, categoryTotals]);

    // Crear nueva semana con límites opcionales
    const createWeek = useCallback((initialBudget: number, limits?: CategoryLimits) => {
        const startDate = getWeekStartDate();
        const endDate = getWeekEndDate(startDate);

        const newWeek: Week = {
            id: generateId(),
            startDate,
            endDate,
            initialBudget,
            expenses: [],
            categoryLimits: limits,
        };

        setWeeks((prev) => [newWeek, ...prev]);
        setCurrentWeekId(newWeek.id);
    }, []);

    // Agregar gasto
    const addExpense = useCallback(
        (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
            if (!currentWeekId) return;

            const newExpense: Expense = {
                ...expenseData,
                id: generateId(),
                createdAt: new Date().toISOString(),
            };

            setWeeks((prev) =>
                prev.map((week) =>
                    week.id === currentWeekId
                        ? { ...week, expenses: [newExpense, ...week.expenses] }
                        : week
                )
            );
        },
        [currentWeekId]
    );

    // Eliminar gasto
    const deleteExpense = useCallback(
        (expenseId: string) => {
            if (!currentWeekId) return;

            setWeeks((prev) =>
                prev.map((week) =>
                    week.id === currentWeekId
                        ? {
                            ...week,
                            expenses: week.expenses.filter((e) => e.id !== expenseId),
                        }
                        : week
                )
            );
        },
        [currentWeekId]
    );

    // Seleccionar semana
    const selectWeek = useCallback((weekId: string) => {
        setCurrentWeekId(weekId);
    }, []);

    // Actualizar presupuesto
    const updateWeekBudget = useCallback((weekId: string, newBudget: number) => {
        setWeeks((prev) =>
            prev.map((week) =>
                week.id === weekId ? { ...week, initialBudget: newBudget } : week
            )
        );
    }, []);

    // Actualizar límites de categorías de la semana actual
    const updateCategoryLimits = useCallback(
        (limits: CategoryLimits) => {
            if (!currentWeekId) return;

            setWeeks((prev) =>
                prev.map((week) =>
                    week.id === currentWeekId
                        ? { ...week, categoryLimits: limits }
                        : week
                )
            );
        },
        [currentWeekId]
    );

    const value = useMemo(
        () => ({
            weeks,
            currentWeek,
            isLoading,
            totalSpent,
            remaining,
            percentageUsed,
            categoryTotals,
            categoryLimits,
            limitWarnings,
            createWeek,
            addExpense,
            deleteExpense,
            selectWeek,
            updateWeekBudget,
            updateCategoryLimits,
        }),
        [
            weeks,
            currentWeek,
            isLoading,
            totalSpent,
            remaining,
            percentageUsed,
            categoryTotals,
            categoryLimits,
            limitWarnings,
            createWeek,
            addExpense,
            deleteExpense,
            selectWeek,
            updateWeekBudget,
            updateCategoryLimits,
        ]
    );

    return (
        <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
    );
}

export function useExpenses() {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpenses debe usarse dentro de un ExpenseProvider');
    }
    return context;
}
