'use client';

/**
 * LimitSettings - Modal para configurar límites por categoría
 * Permite establecer montos máximos de gasto por categoría
 */

import { useState, useEffect } from 'react';
import { Category, CATEGORIES, CategoryLimits } from '@/types';
import { useExpenses } from '@/context/ExpenseContext';
import { getAllCategories, formatCurrency } from '@/lib/utils';

interface LimitSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LimitSettings({ isOpen, onClose }: LimitSettingsProps) {
    const { categoryLimits, updateCategoryLimits, currentWeek } = useExpenses();
    const [limits, setLimits] = useState<CategoryLimits>({});
    const categories = getAllCategories();

    // Inicializar con límites existentes
    useEffect(() => {
        if (isOpen) {
            setLimits(categoryLimits || {});
        }
    }, [isOpen, categoryLimits]);

    const handleSave = () => {
        // Filtrar límites vacíos o cero
        const cleanLimits: CategoryLimits = {};
        Object.entries(limits).forEach(([key, value]) => {
            if (value && value > 0) {
                cleanLimits[key as Category] = value;
            }
        });
        updateCategoryLimits(cleanLimits);
        onClose();
    };

    const handleLimitChange = (category: Category, value: string) => {
        const numValue = parseFloat(value);
        setLimits((prev) => ({
            ...prev,
            [category]: isNaN(numValue) ? undefined : numValue,
        }));
    };

    if (!isOpen || !currentWeek) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            style={{
                background: 'rgba(12, 12, 14, 0.85)',
                backdropFilter: 'blur(8px)',
            }}
            onClick={onClose}
        >
            <div
                className="card w-full max-w-lg animate-fade-in"
                style={{ padding: '2rem', borderRadius: '20px' }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3
                    className="text-2xl mb-2"
                    style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
                >
                    Límites por categoría
                </h3>
                <p
                    className="mb-6"
                    style={{ color: 'var(--gray-400)' }}
                >
                    Establece un gasto máximo para cada categoría. Recibirás una alerta al acercarte al límite.
                </p>

                <div className="space-y-4 mb-8">
                    {categories.map((cat) => {
                        const info = CATEGORIES[cat];
                        const isEmergency = cat === 'emergencias';

                        return (
                            <div
                                key={cat}
                                className="flex items-center gap-4"
                            >
                                {/* Kanji y nombre */}
                                <div className="flex items-center gap-3 w-32">
                                    <span
                                        className="text-xl"
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

                                {/* Input de límite */}
                                <div className="flex-1 relative">
                                    <span
                                        className="absolute left-3 top-1/2 -translate-y-1/2"
                                        style={{ color: 'var(--gray-500)' }}
                                    >
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="10"
                                        placeholder="Sin límite"
                                        value={limits[cat] || ''}
                                        onChange={(e) => handleLimitChange(cat, e.target.value)}
                                        className="w-full pl-8"
                                        style={{ padding: '0.75rem 1rem 0.75rem 2rem' }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="btn-secondary flex-1"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-primary flex-1"
                    >
                        Guardar límites
                    </button>
                </div>
            </div>
        </div>
    );
}
