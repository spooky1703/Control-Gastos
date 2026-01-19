'use client';

/**
 * ExpenseList - Lista de gastos con cards elevadas
 * Hover effects sutiles, bordes con gradiente
 */

import { useExpenses } from '@/context/ExpenseContext';
import { CATEGORIES } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ExpenseList() {
    const { currentWeek, deleteExpense } = useExpenses();

    if (!currentWeek) return null;

    const { expenses } = currentWeek;

    return (
        <section className="mt-12">
            <div className="flex items-baseline justify-between mb-6">
                <h2
                    className="text-xl"
                    style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
                >
                    Gastos
                </h2>
                {expenses.length > 0 && (
                    <span
                        className="text-sm"
                        style={{ color: 'var(--gray-400)' }}
                    >
                        {expenses.length} {expenses.length === 1 ? 'registro' : 'registros'}
                    </span>
                )}
            </div>

            {expenses.length === 0 ? (
                // Estado vacío
                <div
                    className="card py-16 text-center"
                    style={{ borderRadius: '16px' }}
                >
                    <p
                        className="text-4xl mb-4"
                        style={{ fontFamily: 'serif', color: 'var(--gray-500)' }}
                    >
                        空
                    </p>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Sin gastos registrados
                    </p>
                    <p
                        className="text-sm mt-1"
                        style={{ color: 'var(--gray-500)' }}
                    >
                        Agrega tu primer gasto arriba
                    </p>
                </div>
            ) : (
                // Lista de gastos
                <div className="space-y-3">
                    {expenses.map((expense) => {
                        const categoryInfo = CATEGORIES[expense.category];
                        const isEmergency = expense.category === 'emergencias';

                        return (
                            <div
                                key={expense.id}
                                className="group card flex items-center gap-5 p-4"
                                style={{ borderRadius: '12px' }}
                            >
                                {/* Kanji de categoría */}
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: isEmergency
                                            ? 'rgba(212, 81, 61, 0.1)'
                                            : 'var(--background-elevated)',
                                        border: isEmergency
                                            ? '1px solid rgba(212, 81, 61, 0.2)'
                                            : '1px solid var(--border)',
                                    }}
                                >
                                    <span
                                        className="text-xl"
                                        style={{
                                            fontFamily: 'serif',
                                            color: isEmergency ? 'var(--accent)' : 'var(--gray-300)',
                                        }}
                                    >
                                        {categoryInfo.kanji}
                                    </span>
                                </div>

                                {/* Descripción y fecha */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className="truncate font-medium"
                                        style={{ color: 'var(--foreground)' }}
                                    >
                                        {expense.description || categoryInfo.label}
                                    </p>
                                    <p
                                        className="text-sm mt-0.5"
                                        style={{ color: 'var(--gray-400)' }}
                                    >
                                        {categoryInfo.label} • {formatDate(expense.date)}
                                    </p>
                                </div>

                                {/* Monto */}
                                <p
                                    className="text-lg font-light"
                                    style={{
                                        fontFamily: 'Georgia, serif',
                                        color: isEmergency ? 'var(--accent)' : 'var(--foreground)',
                                    }}
                                >
                                    -{formatCurrency(expense.amount)}
                                </p>

                                {/* Botón eliminar */}
                                <button
                                    onClick={() => deleteExpense(expense.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-300"
                                    style={{
                                        color: 'var(--gray-400)',
                                        background: 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--accent)';
                                        e.currentTarget.style.background = 'rgba(212, 81, 61, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--gray-400)';
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                    title="Eliminar"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
