import React from 'react';
import type { ExpenseCategory } from '../../types';

interface Filters {
  year: number;
  month: number;
  category: number | null;
  showAll: boolean;
  showFullSummary: boolean;
}

interface ExpenseFiltersProps {
  filters: Filters;
  categories: ExpenseCategory[];
  showFilters: boolean;
  onToggleFilters: () => void;
  onShowAllChange: (showAll: boolean) => void;
  onShowFullSummaryChange: (showFullSummary: boolean) => void;
  onFilterChange: (field: keyof Filters, value: string | number | null) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  categories,
  showFilters,
  onToggleFilters,
  onShowAllChange,
  onShowFullSummaryChange,
  onFilterChange
}) => {
  const handleShowAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onShowAllChange(checked);
    if (checked && filters.showFullSummary) {
      onShowFullSummaryChange(false);
    }
  };

  const handleShowFullSummaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onShowFullSummaryChange(checked);
    if (checked && filters.showAll) {
      onShowAllChange(false);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('year', parseInt(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('month', parseInt(e.target.value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('category', e.target.value ? parseInt(e.target.value) : null);
  };

  const isDisabled = filters.showAll || filters.showFullSummary;

  return (
    <>
      {/* Filters Toggle */}
      <button 
        onClick={onToggleFilters}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-6"
      >
        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-3">
                Ver todos los tipos de gastos en el periodo actual:
              </label>
              <input
                type="checkbox"
                checked={filters.showAll}
                onChange={handleShowAllChange}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-3">
                Mostrar todos los registros:
              </label>
              <input
                type="checkbox"
                checked={filters.showFullSummary}
                onChange={handleShowFullSummaryChange}
                className="rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año:
                </label>
                <input
                  type="number"
                  value={filters.year}
                  onChange={handleYearChange}
                  disabled={isDisabled}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mes:
                </label>
                <select
                  value={filters.month}
                  onChange={handleMonthChange}
                  disabled={isDisabled}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría:
              </label>
              <select
                value={filters.category || ''}
                onChange={handleCategoryChange}
                disabled={isDisabled}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
