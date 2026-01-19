'use client';

/**
 * Página principal - Control de Gastos
 * Layout con cards elevadas y espaciado equilibrado
 */

import { useExpenses } from '@/context/ExpenseContext';
import WeekSelector from '@/components/WeekSelector';
import Dashboard from '@/components/Dashboard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import CategoryBreakdown from '@/components/CategoryBreakdown';

export default function Home() {
  const { isLoading, currentWeek } = useExpenses();

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'var(--gray-600)',
              borderTopColor: 'var(--accent)',
            }}
          />
          <p style={{ color: 'var(--gray-500)' }}>
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen py-12 px-6"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      {/* Header: Selector de semana */}
      <WeekSelector />

      {/* Contenido principal */}
      {currentWeek && (
        <>
          {/* Dashboard */}
          <Dashboard />

          {/* Grid: Formulario y Categorías */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Formulario */}
            <div className="lg:mt-0 mt-0">
              <ExpenseForm />
            </div>

            {/* Categorías */}
            <div className="lg:mt-0 mt-0">
              <CategoryBreakdown />
            </div>
          </div>

          {/* Lista de gastos */}
          <ExpenseList />
        </>
      )}

      {/* Footer */}
      <footer
        className="mt-16 pt-8 text-center"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p
          className="text-sm"
          style={{ color: 'var(--gray-500)' }}
        >
          Los datos se guardan localmente en tu navegador
        </p>
      </footer>
    </main>
  );
}
