/**
 * Utilidades para persistencia en LocalStorage
 * Maneja guardado, carga y validación de datos
 */

import { AppState } from '@/types';

// Clave única para almacenar datos en LocalStorage
const STORAGE_KEY = 'expense-tracker-data';

/**
 * Guarda el estado completo de la app en LocalStorage
 * @param state - Estado a persistir
 */
export function saveToStorage(state: AppState): void {
    try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
        console.error('Error guardando en LocalStorage:', error);
    }
}

/**
 * Carga el estado desde LocalStorage
 * @returns Estado guardado o null si no existe/es inválido
 */
export function loadFromStorage(): AppState | null {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (!serialized) return null;

        const parsed = JSON.parse(serialized);

        // Validación básica de estructura
        if (!parsed.weeks || !Array.isArray(parsed.weeks)) {
            return null;
        }

        return parsed as AppState;
    } catch (error) {
        console.error('Error cargando desde LocalStorage:', error);
        return null;
    }
}

/**
 * Genera un ID único para semanas y gastos
 * Usa timestamp + random para evitar colisiones
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Limpia todos los datos de la app (útil para debug)
 */
export function clearStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
}
