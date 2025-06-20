import { useState, useEffect } from 'react';
import { expenseService } from '../../services/api';
import type { ExpenseSummary } from '../../types';

export const ExpensesSummary = () => {
  const [summary, setSummary] = useState<ExpenseSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [showAllExpenses, setShowAllExpenses] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await expenseService.getSummary();
      setSummary(data);
    };
    fetchSummary();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div>
      <h1>Resumen de Gastos</h1>

      <div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={showAllExpenses}
              onChange={(e) => {
                setShowAllExpenses(e.target.checked);
                if (e.target.checked) {
                  setSelectedCategory(null);
                }
              }}
              style={{ marginRight: '8px' }}
            />
            Ver gastos por período específico
          </label>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(Number(e.target.value));
            setSelectedMonth(new Date(Number(e.target.value), 0).getMonth() + 1);
          }}
          disabled={selectedCategory !== null && !showAllExpenses}
          style={{
            cursor: selectedCategory !== null && !showAllExpenses ? 'not-allowed' : 'pointer',
            opacity: selectedCategory !== null && !showAllExpenses ? 0.5 : 1,
            backgroundColor: selectedCategory !== null && !showAllExpenses ? '#f0f0f0' : 'white',
            border: selectedCategory !== null && !showAllExpenses ? '1px solid #ccc' : '1px solid #ddd',
          }}
        >
          {Array.from({ length: 5 }, (_, i) => selectedYear - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          disabled={selectedCategory !== null && !showAllExpenses}
          style={{
            cursor: selectedCategory !== null && !showAllExpenses ? 'not-allowed' : 'pointer',
            opacity: selectedCategory !== null && !showAllExpenses ? 0.5 : 1,
            backgroundColor: selectedCategory !== null && !showAllExpenses ? '#f0f0f0' : 'white',
            border: selectedCategory !== null && !showAllExpenses ? '1px solid #ccc' : '1px solid #ddd',
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div>
        {summary
          .filter(item => {
            const date = new Date(item.date);
            return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
          })
          .map((item) => (
            <div
              key={item.id}
              onClick={() => handleCategoryClick(item.category.id)}
              style={{
                cursor: item.category.id === selectedCategory ? 'not-allowed' : 'pointer',
                opacity: item.category.id === selectedCategory ? 0.5 : 1,
              }}
            >
              <h3>{item.category.name}</h3>
              <p>S/. {item.amount.toFixed(2)}</p>
            </div>
          ))}
      </div>

      {selectedCategory && (
        <div>
          <h2>Detalles de Gastos</h2>
        </div>
      )}
    </div>
  );
};
