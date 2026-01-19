'use client';

/**
 * CategoryBreakdown - Visualización con barras, límites visibles
 * Muestra progreso hacia el límite establecido por categoría
 */

import { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { CATEGORIES } from '@/types';
import { formatCurrency, getAllCategories } from '@/lib/utils';
import LimitSettings from './LimitSettings';

export default function CategoryBreakdown() {
    const { currentWeek, categoryTotals, categoryLimits } = useExpenses();
    const [showLimitSettings, setShowLimitSettings] = useState(false);

    if (!currentWeek) return null;

    const categories = getAllCategories();

    // Mostrar todas las categorías que tienen gastos O tienen límite
    const categoriesToShow = categories.filter(
        (cat) => categoryTotals[cat] > 0 || (categoryLimits[cat] && categoryLimits[cat]! > 0)
    );

    // Ordenar: primero las que exceden límite, luego por monto
    const sortedCategories = categoriesToShow.sort((a, b) => {
        const aLimit = categoryLimits[a] || Infinity;
        const bLimit = categoryLimits[b] || Infinity;
        const aExceeds = categoryTotals[a] / aLimit;
        const bExceeds = categoryTotals[b] / bLimit;
        if (aExceeds >= 1 && bExceeds < 1) return -1;
        if (bExceeds >= 1 && aExceeds < 1) return 1;
        return categoryTotals[b] - categoryTotals[a];
    });

    const hasAnyLimits = Object.keys(categoryLimits).length > 0;

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h2
                    className="text-xl"
                    style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
                >
                    Por categoría
                </h2>
                {/* Botón para configurar límites */}
                <button
                    onClick={() => setShowLimitSettings(true)}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all duration-300"
                    style={{
                        color: 'var(--gray-400)',
                        border: '1px solid var(--border)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-hover)';
                        e.currentTarget.style.color = 'var(--gray-200)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--gray-400)';
                    }}
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
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        />
                    </svg>
                    Límites
                </button>
            </div>

            <div
                className="card"
                style={{ padding: '1.5rem', borderRadius: '16px' }}
            >
                {sortedCategories.length === 0 ? (
                    <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '1rem' }}>
                        No hay gastos ni límites configurados
                    </p>
                ) : (
                    <div className="space-y-5">
                        {sortedCategories.map((category) => {
                            const info = CATEGORIES[category];
                            const amount = categoryTotals[category];
                            const limit = categoryLimits[category];
                            const hasLimit = limit && limit > 0;

                            // Porcentaje: sobre el límite si existe, sino sobre el total gastado
                            const percentage = hasLimit
                                ? (amount / limit) * 100
                                : 0;

                            const isExceeded = hasLimit && amount >= limit;
                            const isNearLimit = hasLimit && percentage >= 80 && percentage < 100;
                            const isEmergency = category === 'emergencias';

                            // Color basado en estado
                            const getBarColor = () => {
                                if (isExceeded) return 'var(--accent)';
                                if (isNearLimit) return '#D4A13D';
                                if (isEmergency) return 'var(--accent)';
                                return 'var(--gray-400)';
                            };

                            return (
                                <div key={category} className="space-y-2">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="text-lg"
                                                style={{
                                                    fontFamily: 'serif',
                                                    color: isExceeded ? 'var(--accent)' : isNearLimit ? '#D4A13D' : 'var(--gray-300)',
                                                }}
                                            >
                                                {info.kanji}
                                            </span>
                                            <span style={{ color: 'var(--gray-200)' }}>
                                                {info.label}
                                            </span>
                                            {/* Indicador de estado */}
                                            {isExceeded && (
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded"
                                                    style={{
                                                        background: 'rgba(212, 81, 61, 0.2)',
                                                        color: 'var(--accent)',
                                                    }}
                                                >
                                                    Excedido
                                                </span>
                                            )}
                                            {isNearLimit && (
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded"
                                                    style={{
                                                        background: 'rgba(212, 161, 61, 0.2)',
                                                        color: '#D4A13D',
                                                    }}
                                                >
                                                    Casi al límite
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="font-light"
                                                style={{
                                                    fontFamily: 'Georgia, serif',
                                                    color: isExceeded ? 'var(--accent)' : isNearLimit ? '#D4A13D' : 'var(--foreground)',
                                                }}
                                            >
                                                {formatCurrency(amount)}
                                            </span>
                                            {hasLimit && (
                                                <span style={{ color: 'var(--gray-500)' }}>
                                                    / {formatCurrency(limit)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Barra de progreso */}
                                    {hasLimit && (
                                        <div
                                            className="h-2 rounded-full overflow-hidden"
                                            style={{ background: 'var(--background-elevated)' }}
                                        >
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.min(percentage, 100)}%`,
                                                    background: `linear-gradient(90deg, ${getBarColor()} 0%, ${getBarColor()}CC 100%)`,
                                                    boxShadow: isExceeded || isNearLimit
                                                        ? `0 0 8px ${getBarColor()}50`
                                                        : 'none',
                                                    transition: 'width 500ms ease-out',
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Barra sutil si no hay límite pero hay gasto */}
                                    {!hasLimit && amount > 0 && (
                                        <div
                                            className="h-1 rounded-full"
                                            style={{
                                                background: 'var(--border)',
                                                opacity: 0.5,
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Nota si no hay límites */}
                {!hasAnyLimits && sortedCategories.length > 0 && (
                    <p
                        className="text-sm mt-4 pt-4 text-center"
                        style={{
                            color: 'var(--gray-500)',
                            borderTop: '1px solid var(--border)',
                        }}
                    >
                        Configura límites para recibir alertas
                    </p>
                )}
            </div>

            {/* Modal de configuración de límites */}
            <LimitSettings
                isOpen={showLimitSettings}
                onClose={() => setShowLimitSettings(false)}
            />
        </section>
    );
}
