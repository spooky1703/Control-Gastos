'use client';

/**
 * Context Provider para el estado global de la app
 * Maneja semanas, gastos y persistencia en LocalStorage
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
import { Week, Expense, Category, CategoryTotals } from '@/types';
import { saveToStorage, loadFromStorage, generateId } from '@/lib/storage';
import {
    calculateTotalSpent,
    calculateRemaining,
    calculatePercentage,
    getCategoryTotals,
    getWeekStartDate,
    getWeekEndDate,
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

    // Acciones
    createWeek: (initialBudget: number) => void;
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
    deleteExpense: (expenseId: string) => void;
    selectWeek: (weekId: string) => void;
    updateWeekBudget: (weekId: string, newBudget: number) => void;
}

// Contexto con valor inicial undefined para detectar uso fuera del provider
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Props del provider
interface ExpenseProviderProps {
    children: ReactNode;
}

export function ExpenseProvider({ children }: ExpenseProviderProps) {
    // Estado principal
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

    // Valores calculados basados en la semana actual
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

    // Crear nueva semana
    const createWeek = useCallback((initialBudget: number) => {
        const startDate = getWeekStartDate();
        const endDate = getWeekEndDate(startDate);

        const newWeek: Week = {
            id: generateId(),
            startDate,
            endDate,
            initialBudget,
            expenses: [],
        };

        setWeeks((prev) => [newWeek, ...prev]);
        setCurrentWeekId(newWeek.id);
    }, []);

    // Agregar gasto a la semana actual
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

    // Seleccionar una semana diferente
    const selectWeek = useCallback((weekId: string) => {
        setCurrentWeekId(weekId);
    }, []);

    // Actualizar presupuesto de una semana
    const updateWeekBudget = useCallback((weekId: string, newBudget: number) => {
        setWeeks((prev) =>
            prev.map((week) =>
                week.id === weekId ? { ...week, initialBudget: newBudget } : week
            )
        );
    }, []);

    // Valor del contexto memoizado
    const value = useMemo(
        () => ({
            weeks,
            currentWeek,
            isLoading,
            totalSpent,
            remaining,
            percentageUsed,
            categoryTotals,
            createWeek,
            addExpense,
            deleteExpense,
            selectWeek,
            updateWeekBudget,
        }),
        [
            weeks,
            currentWeek,
            isLoading,
            totalSpent,
            remaining,
            percentageUsed,
            categoryTotals,
            createWeek,
            addExpense,
            deleteExpense,
            selectWeek,
            updateWeekBudget,
        ]
    );

    return (
        <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
    );
}

// Hook personalizado para usar el contexto
export function useExpenses() {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpenses debe usarse dentro de un ExpenseProvider');
    }
    return context;
}
