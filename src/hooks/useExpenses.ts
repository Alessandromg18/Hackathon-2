import { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import type { ExpenseSummary } from '../types';

interface Filters {
  year: number;
  month: number;
  category: number | null;
  showAll: boolean;
  showFullSummary: boolean;
}

interface UseExpensesProps {
  defaultCategory?: number;
}

export const useExpenses = ({ defaultCategory }: UseExpensesProps = {}) => {
  const [expenses, setExpenses] = useState<ExpenseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    category: null,
    showAll: false,
    showFullSummary: false
  });

  useEffect(() => {
    if (defaultCategory && (filters.category === null || !filters.category) && !filters.showAll && !filters.showFullSummary) {
      setFilters(prev => ({
        ...prev,
        category: defaultCategory
      }));
    }
  }, [defaultCategory]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let expensesData;
      
      if (filters.showFullSummary) {
        expensesData = await expenseService.getFullSummary();
      } else if (filters.showAll) {
        expensesData = await expenseService.getAllExpensesForDate(filters.year, filters.month);
      } else {
        expensesData = await expenseService.getDetail(filters.year, filters.month, filters.category || defaultCategory || 1);
      }
      
      setExpenses(expensesData);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Error loading expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters, defaultCategory]);

  const handleShowAllChange = (showAll: boolean) => {
    setFilters(prev => ({
      ...prev,
      showAll,
      showFullSummary: false,
      category: showAll ? null : defaultCategory || 1
    }));
  };

  const handleShowFullSummaryChange = (showFullSummary: boolean) => {
    setFilters(prev => ({
      ...prev,
      showFullSummary,
      showAll: false,
      category: showFullSummary ? null : defaultCategory || 1
    }));
  };

  const handleFilterChange = (field: keyof Filters, value: string | number | null) => {
    if (filters.showAll || filters.showFullSummary) return;
    
    setFilters(prev => ({
      ...prev,
      [field]: field === 'category' ? (value ?? null) : value
    }));
  };

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) return;

    try {
      await expenseService.delete(id);
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Error deleting expense');
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    expenses,
    loading,
    error,
    filters,
    handleShowAllChange,
    handleShowFullSummaryChange,
    handleFilterChange,
    handleDeleteExpense,
    refreshData
  };
};
