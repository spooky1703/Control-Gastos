'use client';

/**
 * WeekSelector - Navegación con modales elegantes
 * Sombras, gradientes sutiles, transiciones suaves
 */

import { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { formatWeekRange, formatCurrency } from '@/lib/utils';

export default function WeekSelector() {
    const { weeks, currentWeek, createWeek, selectWeek } = useExpenses();

    const [showNewWeek, setShowNewWeek] = useState(false);
    const [budget, setBudget] = useState('');
    const [showWeekList, setShowWeekList] = useState(false);

    const handleCreateWeek = () => {
        const numBudget = parseFloat(budget);
        if (isNaN(numBudget) || numBudget <= 0) return;

        createWeek(numBudget);
        setBudget('');
        setShowNewWeek(false);
    };

    return (
        <header>
            {/* Título y navegación */}
            <div className="flex items-end justify-between">
                <div>
                    <h1
                        className="text-3xl mb-2"
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontWeight: 400,
                            letterSpacing: '0.02em',
                            color: 'var(--foreground)',
                        }}
                    >
                        Control de Gastos
                    </h1>
                    {currentWeek && (
                        <p style={{ color: 'var(--gray-400)' }}>
                            {formatWeekRange(currentWeek.startDate, currentWeek.endDate)}
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    {/* Botón semanas anteriores */}
                    {weeks.length > 1 && (
                        <button
                            onClick={() => setShowWeekList(!showWeekList)}
                            className="btn-secondary p-3"
                            title="Semanas anteriores"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Botón nueva semana */}
                    <button
                        onClick={() => setShowNewWeek(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <span>Nueva semana</span>
                    </button>
                </div>
            </div>

            {/* Lista de semanas */}
            {showWeekList && weeks.length > 1 && (
                <div
                    className="card mt-6"
                    style={{ padding: '1.5rem', borderRadius: '16px' }}
                >
                    <p
                        className="text-xs tracking-widest uppercase mb-4"
                        style={{ color: 'var(--gray-400)' }}
                    >
                        Historial
                    </p>
                    <div className="space-y-2">
                        {weeks.map((week) => {
                            const isSelected = week.id === currentWeek?.id;
                            return (
                                <button
                                    key={week.id}
                                    onClick={() => {
                                        selectWeek(week.id);
                                        setShowWeekList(false);
                                    }}
                                    className="w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-300"
                                    style={{
                                        background: isSelected
                                            ? 'linear-gradient(135deg, var(--background-elevated) 0%, var(--background-card) 100%)'
                                            : 'transparent',
                                        border: isSelected ? '1px solid var(--border-hover)' : '1px solid transparent',
                                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                                    }}
                                >
                                    <span style={{ color: isSelected ? 'var(--foreground)' : 'var(--gray-300)' }}>
                                        {formatWeekRange(week.startDate, week.endDate)}
                                    </span>
                                    <span style={{ color: 'var(--gray-500)' }}>
                                        {formatCurrency(week.initialBudget)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal nueva semana */}
            {showNewWeek && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-6"
                    style={{
                        background: 'rgba(12, 12, 14, 0.85)',
                        backdropFilter: 'blur(8px)',
                    }}
                    onClick={() => setShowNewWeek(false)}
                >
                    <div
                        className="card w-full max-w-md animate-fade-in"
                        style={{ padding: '2rem', borderRadius: '20px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            className="text-2xl mb-2"
                            style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
                        >
                            Nueva semana
                        </h3>
                        <p
                            className="mb-8"
                            style={{ color: 'var(--gray-400)' }}
                        >
                            ¿Cuál es tu presupuesto para esta semana?
                        </p>

                        <div className="mb-8">
                            <label
                                className="block text-xs tracking-widest uppercase mb-3"
                                style={{ color: 'var(--gray-400)' }}
                            >
                                Presupuesto
                            </label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-lg"
                                    style={{ color: 'var(--gray-500)' }}
                                >
                                    $
                                </span>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    autoFocus
                                    className="w-full pl-10 text-2xl"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowNewWeek(false);
                                    setBudget('');
                                }}
                                className="btn-secondary flex-1"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateWeek}
                                disabled={!budget || parseFloat(budget) <= 0}
                                className="btn-primary flex-1"
                            >
                                Crear semana
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Estado inicial sin semanas */}
            {weeks.length === 0 && !showNewWeek && (
                <div
                    className="card mt-12 py-16 text-center"
                    style={{ borderRadius: '20px' }}
                >
                    <p
                        className="text-5xl mb-6"
                        style={{ fontFamily: 'serif', color: 'var(--gray-500)' }}
                    >
                        始
                    </p>
                    <h3
                        className="text-2xl mb-3"
                        style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
                    >
                        Comienza tu semana
                    </h3>
                    <p
                        className="mb-8"
                        style={{ color: 'var(--gray-400)' }}
                    >
                        Registra tu presupuesto y comienza a organizar tus gastos
                    </p>
                    <button
                        onClick={() => setShowNewWeek(true)}
                        className="btn-primary"
                    >
                        Crear primera semana
                    </button>
                </div>
            )}
        </header>
    );
}
