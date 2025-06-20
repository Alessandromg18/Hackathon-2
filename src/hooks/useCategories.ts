import { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import type { ExpenseCategory } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await expenseService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};
