'use client';

/**
 * Dashboard - Panel de estadísticas con profundidad visual
 * Cards con gradientes sutiles y sombras
 */

import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/lib/utils';
import ProgressRing from './ProgressRing';

export default function Dashboard() {
    const { currentWeek, totalSpent, remaining, percentageUsed } = useExpenses();

    if (!currentWeek) return null;

    const isOverBudget = remaining < 0;

    return (
        <section className="mt-12">
            {/* Grid con cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Presupuesto */}
                <div className="stat-card">
                    <p
                        className="text-xs tracking-widest uppercase mb-3"
                        style={{ color: 'var(--gray-300)' }}
                    >
                        Presupuesto
                    </p>
                    <p
                        className="text-3xl font-light"
                        style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
                    >
                        {formatCurrency(currentWeek.initialBudget)}
                    </p>
                </div>

                {/* Gastado */}
                <div className="stat-card">
                    <p
                        className="text-xs tracking-widest uppercase mb-3"
                        style={{ color: 'var(--gray-300)' }}
                    >
                        Gastado
                    </p>
                    <p
                        className="text-3xl font-light"
                        style={{ fontFamily: 'Georgia, serif', color: 'var(--gray-200)' }}
                    >
                        {formatCurrency(totalSpent)}
                    </p>
                </div>

                {/* Restante - con glow si excede */}
                <div
                    className={isOverBudget ? 'card-accent' : 'stat-card'}
                    style={{ padding: '1.5rem' }}
                >
                    <p
                        className="text-xs tracking-widest uppercase mb-3"
                        style={{ color: isOverBudget ? 'var(--accent)' : 'var(--gray-300)' }}
                    >
                        Restante
                    </p>
                    <p
                        className="text-3xl font-light"
                        style={{
                            fontFamily: 'Georgia, serif',
                            color: isOverBudget ? 'var(--accent)' : 'var(--foreground)',
                        }}
                    >
                        {formatCurrency(remaining)}
                    </p>
                    {isOverBudget && (
                        <p
                            className="text-xs mt-2"
                            style={{ color: 'var(--accent)' }}
                        >
                            Presupuesto excedido
                        </p>
                    )}
                </div>
            </div>

            {/* Progress Ring con card */}
            <div
                className="card flex items-center justify-center py-10"
                style={{ borderRadius: '16px' }}
            >
                <ProgressRing percentage={percentageUsed} size={180} strokeWidth={4} />
            </div>
        </section>
    );
}
