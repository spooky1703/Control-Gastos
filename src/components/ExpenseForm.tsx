'use client';

/**
 * ExpenseForm - Formulario con inputs estilizados oscuros
 * Cards elevadas, botones con gradiente
 */

import { useState, FormEvent } from 'react';
import { Category, CATEGORIES } from '@/types';
import { useExpenses } from '@/context/ExpenseContext';
import { getAllCategories } from '@/lib/utils';

export default function ExpenseForm() {
    const { addExpense, currentWeek } = useExpenses();

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<Category>('comida');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!currentWeek) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        setIsSubmitting(true);

        addExpense({
            amount: numAmount,
            category,
            description: description.trim() || undefined,
            date: new Date().toISOString().split('T')[0],
        });

        setAmount('');
        setDescription('');
        setCategory('comida');

        setTimeout(() => setIsSubmitting(false), 300);
    };

    const categories = getAllCategories();

    return (
        <section className="mt-12">
            <h2
                className="text-xl mb-6"
                style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
            >
                Nuevo gasto
            </h2>

            <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Monto */}
                    <div>
                        <label
                            htmlFor="amount"
                            className="block text-xs tracking-widest uppercase mb-3"
                            style={{ color: 'var(--gray-300)' }}
                        >
                            Monto
                        </label>
                        <div className="relative">
                            <span
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: 'var(--gray-400)' }}
                            >
                                $
                            </span>
                            <input
                                id="amount"
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8"
                                style={{ fontSize: '1.25rem' }}
                                required
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label
                            className="block text-xs tracking-widest uppercase mb-3"
                            style={{ color: 'var(--gray-300)' }}
                        >
                            Categoría
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {categories.map((cat) => {
                                const info = CATEGORIES[cat];
                                const isSelected = category === cat;
                                const isEmergency = cat === 'emergencias';

                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className="flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-300"
                                        style={{
                                            background: isSelected
                                                ? 'linear-gradient(135deg, var(--background-card) 0%, var(--background-elevated) 100%)'
                                                : 'transparent',
                                            border: isSelected
                                                ? (isEmergency ? '1px solid rgba(212, 81, 61, 0.4)' : '1px solid var(--border-hover)')
                                                : '1px solid transparent',
                                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                                        }}
                                        title={info.label}
                                    >
                                        <span
                                            className="text-xl mb-1"
                                            style={{
                                                fontFamily: 'serif',
                                                color: isSelected
                                                    ? (isEmergency ? 'var(--accent)' : 'var(--foreground)')
                                                    : 'var(--gray-400)',
                                                transition: 'color 300ms ease-in-out',
                                            }}
                                        >
                                            {info.kanji}
                                        </span>
                                        <span
                                            className="text-xs"
                                            style={{
                                                color: isSelected ? 'var(--gray-200)' : 'var(--gray-500)',
                                                transition: 'color 300ms ease-in-out',
                                            }}
                                        >
                                            {info.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-xs tracking-widest uppercase mb-3"
                            style={{ color: 'var(--gray-300)' }}
                        >
                            Nota <span style={{ color: 'var(--gray-500)' }}>(opcional)</span>
                        </label>
                        <input
                            id="description"
                            type="text"
                            placeholder="Breve descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={50}
                            className="w-full"
                        />
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !amount}
                        className="btn-primary w-full"
                    >
                        {isSubmitting ? 'Agregando...' : 'Agregar gasto'}
                    </button>
                </form>
            </div>
        </section>
    );
}
