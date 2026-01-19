'use client';

/**
 * ProgressRing - Indicador visual circular con glow
 * Línea más visible, efecto de brillo sutil
 */

import { useMemo } from 'react';

interface ProgressRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

export default function ProgressRing({
    percentage,
    size = 180,
    strokeWidth = 4,
}: ProgressRingProps) {
    const { radius, circumference, strokeDashoffset } = useMemo(() => {
        const r = (size - strokeWidth) / 2;
        const c = 2 * Math.PI * r;
        const offset = c - (percentage / 100) * c;

        return {
            radius: r,
            circumference: c,
            strokeDashoffset: offset,
        };
    }, [percentage, size, strokeWidth]);

    // Color basado en porcentaje
    const getColor = () => {
        if (percentage > 80) return '#D4513D';
        if (percentage > 60) return '#D4A13D';
        return '#5DB86A';
    };

    const strokeColor = getColor();

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Círculo de fondo */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth={strokeWidth}
                />
                {/* Círculo de progreso con glow */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: 'stroke-dashoffset 500ms ease-out, stroke 400ms ease-in-out',
                        filter: `drop-shadow(0 0 8px ${strokeColor}50)`,
                    }}
                />
            </svg>
            {/* Porcentaje en el centro */}
            <div className="absolute flex flex-col items-center justify-center">
                <span
                    className="text-4xl font-light tracking-tight"
                    style={{
                        fontFamily: 'Georgia, serif',
                        color: strokeColor,
                        transition: 'color 400ms ease-in-out',
                        textShadow: `0 0 20px ${strokeColor}30`,
                    }}
                >
                    {Math.round(percentage)}%
                </span>
                <span
                    className="text-xs tracking-widest uppercase mt-1"
                    style={{ color: 'var(--gray-400)' }}
                >
                    usado
                </span>
            </div>
        </div>
    );
}
