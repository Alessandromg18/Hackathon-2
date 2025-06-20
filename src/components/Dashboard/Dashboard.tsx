import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useExpenses } from '../../hooks/useExpenses';
import { useExpenseForm } from '../../hooks/useExpenseForm';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseFilters } from './ExpenseFilters';
import { ExpenseTable } from './ExpenseTable';

export const Dashboard: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { categories, loading: categoriesLoading } = useCategories();
  
  const { 
    expenses, 
    loading: expensesLoading, 
    error: expensesError, 
    filters,
    handleShowAllChange,
    handleShowFullSummaryChange,
    handleFilterChange,
    handleDeleteExpense,
    refreshData
  } = useExpenses({ defaultCategory: categories[0]?.id });

  const {
    formData,
    isSubmitting,
    updateAmount,
    updateCategory,
    updateField,
    handleSubmit
  } = useExpenseForm({
    categories,
    onSuccess: () => {
      refreshData();
      setError(null);
    },
    onError: (errorMessage) => {
      setError(errorMessage);
    }
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const isLoading = categoriesLoading || expensesLoading;
  const displayError = error || expensesError;

  const getTableTitle = () => {
    let title = "Gastos";
    if (filters.showFullSummary) {
      title += " (Todos los registros)";
    } else if (filters.showAll) {
      title += ` (Por período: ${filters.month}/${filters.year})`;
    }
    return title;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : displayError ? (
            <ErrorMessage error={displayError} />
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

              {/* Formulario de nuevo gasto */}
              <ExpenseForm
                formData={formData}
                categories={categories}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onAmountChange={updateAmount}
                onCategoryChange={updateCategory}
                onDateChange={(date) => updateField('date', date)}
              />

              {/* Filtros */}
              <ExpenseFilters
                filters={filters}
                categories={categories}
                showFilters={showFilters}
                onToggleFilters={toggleFilters}
                onShowAllChange={handleShowAllChange}
                onShowFullSummaryChange={handleShowFullSummaryChange}
                onFilterChange={handleFilterChange}
              />

              {/* Tabla de gastos */}
              <ExpenseTable
                expenses={expenses}
                onDelete={handleDeleteExpense}
                showDateAsMonthYear={filters.showFullSummary}
                title={getTableTitle()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
