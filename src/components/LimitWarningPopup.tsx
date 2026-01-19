'use client';

/**
 * LimitWarningPopup - Popup de advertencia cuando se exceden límites
 * Aparece al cargar la app si hay categorías cerca o sobre el límite
 */

import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/types';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/lib/utils';

export default function LimitWarningPopup() {
    const { limitWarnings, isLoading } = useExpenses();
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    // Mostrar popup cuando hay advertencias y la app ya cargó
    useEffect(() => {
        if (!isLoading && limitWarnings.length > 0 && !hasShown) {
            // Pequeño delay para que la UI cargue primero
            const timer = setTimeout(() => {
                setIsVisible(true);
                setHasShown(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isLoading, limitWarnings, hasShown]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible || limitWarnings.length === 0) return null;

    // Separar entre excedidos (>100%) y cerca del límite (80-100%)
    const exceeded = limitWarnings.filter((w) => w.percentage >= 100);
    const nearLimit = limitWarnings.filter((w) => w.percentage >= 80 && w.percentage < 100);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            style={{
                background: 'rgba(12, 12, 14, 0.9)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <div
                className="w-full max-w-md animate-fade-in"
                style={{
                    background: 'linear-gradient(135deg, var(--background-card) 0%, rgba(26, 26, 30, 0.95) 100%)',
                    border: exceeded.length > 0 ? '1px solid rgba(212, 81, 61, 0.4)' : '1px solid var(--border)',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: exceeded.length > 0
                        ? '0 8px 32px rgba(212, 81, 61, 0.2)'
                        : 'var(--shadow-lg)',
                }}
            >
                {/* Icono de advertencia */}
                <div
                    className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{
                        background: exceeded.length > 0
                            ? 'rgba(212, 81, 61, 0.15)'
                            : 'rgba(212, 161, 61, 0.15)',
                    }}
                >
                    <span
                        className="text-3xl"
                        style={{ fontFamily: 'serif' }}
                    >
                        {exceeded.length > 0 ? '警' : '注'}
                    </span>
                </div>

                {/* Título */}
                <h3
                    className="text-xl text-center mb-2"
                    style={{
                        fontFamily: 'Georgia, serif',
                        color: exceeded.length > 0 ? 'var(--accent)' : 'var(--foreground)',
                    }}
                >
                    {exceeded.length > 0 ? '¡Límites excedidos!' : 'Atención'}
                </h3>
                <p
                    className="text-center mb-6"
                    style={{ color: 'var(--gray-400)' }}
                >
                    {exceeded.length > 0
                        ? 'Has superado el límite en algunas categorías'
                        : 'Estás cerca del límite en algunas categorías'
                    }
                </p>

                {/* Lista de advertencias */}
                <div className="space-y-3 mb-6">
                    {/* Excedidos primero */}
                    {exceeded.map((warning) => {
                        const info = CATEGORIES[warning.category];
                        return (
                            <div
                                key={warning.category}
                                className="flex items-center justify-between p-3 rounded-lg"
                                style={{
                                    background: 'rgba(212, 81, 61, 0.1)',
                                    border: '1px solid rgba(212, 81, 61, 0.2)',
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg" style={{ fontFamily: 'serif', color: 'var(--accent)' }}>
                                        {info.kanji}
                                    </span>
                                    <span style={{ color: 'var(--foreground)' }}>{info.label}</span>
                                </div>
                                <div className="text-right">
                                    <p style={{ color: 'var(--accent)', fontWeight: 500 }}>
                                        {formatCurrency(warning.spent)} / {formatCurrency(warning.limit)}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--accent)' }}>
                                        +{Math.round(warning.percentage - 100)}% excedido
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Cerca del límite */}
                    {nearLimit.map((warning) => {
                        const info = CATEGORIES[warning.category];
                        return (
                            <div
                                key={warning.category}
                                className="flex items-center justify-between p-3 rounded-lg"
                                style={{
                                    background: 'rgba(212, 161, 61, 0.1)',
                                    border: '1px solid rgba(212, 161, 61, 0.2)',
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg" style={{ fontFamily: 'serif', color: '#D4A13D' }}>
                                        {info.kanji}
                                    </span>
                                    <span style={{ color: 'var(--foreground)' }}>{info.label}</span>
                                </div>
                                <div className="text-right">
                                    <p style={{ color: '#D4A13D' }}>
                                        {formatCurrency(warning.spent)} / {formatCurrency(warning.limit)}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
                                        {Math.round(warning.percentage)}% usado
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={handleClose}
                    className="btn-primary w-full"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
}
