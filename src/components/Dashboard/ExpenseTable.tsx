import React from 'react';
import type { ExpenseSummary } from '../../types';

interface ExpenseTableProps {
  expenses: ExpenseSummary[];
  onDelete: (id: number) => void;
  showDateAsMonthYear?: boolean;
  title?: string;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ 
  expenses, 
  onDelete, 
  showDateAsMonthYear = false,
  title = "Gastos"
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (showDateAsMonthYear) {
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit' 
      });
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="px-6 py-4 text-xl font-semibold text-gray-900">
        {title}
      </h2>
      <div className="min-w-full divide-y divide-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map(expense => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {expense.category.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    S/.{expense.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(expense.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
