'use client';

/**
 * CategoryBreakdown - Visualización con barras y profundidad
 * Gradientes sutiles, sombras en las barras de progreso
 */

import { useExpenses } from '@/context/ExpenseContext';
import { CATEGORIES } from '@/types';
import { formatCurrency, getAllCategories } from '@/lib/utils';

export default function CategoryBreakdown() {
    const { currentWeek, categoryTotals, totalSpent } = useExpenses();

    if (!currentWeek) return null;

    const categories = getAllCategories();

    const categoriesWithExpenses = categories
        .filter((cat) => categoryTotals[cat] > 0)
        .sort((a, b) => categoryTotals[b] - categoryTotals[a]);

    if (categoriesWithExpenses.length === 0) return null;

    return (
        <section className="mt-12">
            <h2
                className="text-xl mb-6"
                style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
            >
                Por categoría
            </h2>

            <div
                className="card"
                style={{ padding: '1.5rem', borderRadius: '16px' }}
            >
                <div className="space-y-5">
                    {categoriesWithExpenses.map((category) => {
                        const info = CATEGORIES[category];
                        const amount = categoryTotals[category];
                        const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                        const isEmergency = category === 'emergencias';

                        return (
                            <div key={category} className="space-y-2">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="text-lg"
                                            style={{
                                                fontFamily: 'serif',
                                                color: isEmergency ? 'var(--accent)' : 'var(--gray-300)',
                                            }}
                                        >
                                            {info.kanji}
                                        </span>
                                        <span style={{ color: 'var(--gray-200)' }}>
                                            {info.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="text-sm"
                                            style={{ color: 'var(--gray-500)' }}
                                        >
                                            {Math.round(percentage)}%
                                        </span>
                                        <span
                                            className="font-light"
                                            style={{
                                                fontFamily: 'Georgia, serif',
                                                color: isEmergency ? 'var(--accent)' : 'var(--foreground)',
                                            }}
                                        >
                                            {formatCurrency(amount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Barra de progreso con gradiente */}
                                <div
                                    className="h-2 rounded-full overflow-hidden"
                                    style={{ background: 'var(--background-elevated)' }}
                                >
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${percentage}%`,
                                            background: isEmergency
                                                ? 'linear-gradient(90deg, var(--accent) 0%, #B8442F 100%)'
                                                : 'linear-gradient(90deg, var(--gray-400) 0%, var(--gray-500) 100%)',
                                            boxShadow: isEmergency
                                                ? '0 0 8px rgba(212, 81, 61, 0.3)'
                                                : 'none',
                                            transition: 'width 500ms ease-out',
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
