import { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import type { ExpenseCategory, NewExpense } from '../types';

interface UseExpenseFormProps {
  categories: ExpenseCategory[];
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useExpenseForm = ({ categories, onSuccess, onError }: UseExpenseFormProps) => {
  const [formData, setFormData] = useState<NewExpense>({
    amount: 0,
    category: { id: 1 },
    date: new Date().toISOString().split('T')[0]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory = categories[0];
      setFormData(prev => ({
        ...prev,
        category: { id: defaultCategory.id }
      }));
    }
  }, [categories]);

  const updateField = (field: keyof NewExpense, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAmount = (value: string) => {
    if (value === '') {
      setFormData(prev => ({ ...prev, amount: 0 }));
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setFormData(prev => ({ ...prev, amount: num }));
      }
    }
  };

  const updateCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category: { id: categoryId }
    }));
  };

  const resetForm = () => {
    setFormData({
      amount: 0,
      category: { id: categories.length > 0 ? categories[0].id : 1 },
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await expenseService.create({
        amount: formData.amount,
        category: formData.category,
        date: formData.date
      });
      resetForm();
      onSuccess?.();
    } catch (err) {
      console.error('Error creating expense:', err);
      onError?.('Error creating expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    updateField,
    updateAmount,
    updateCategory,
    resetForm,
    handleSubmit
  };
};
