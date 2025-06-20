export interface ExpenseCategory {
  id: number;
  name: string;
}

export interface ExpenseSummary {
  id: number;
  date: string;
  category: {
    id: number;
    name: string;
  };
  amount: number;
}

export interface Expense {
  id: number;
  date: string;
  category: {
    id: number;
    name: string;
  };
  amount: number;
  description: string;
}

export interface NewExpense {
  amount: number;
  category: {
    id: number;
  };
  date: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  result: {
    token: string;
    username: string;
  };
}

export interface LoginCredentials {
  email: string;
  passwd: string;
}

export interface RegisterCredentials {
  email: string;
  passwd: string;
}

export interface ExpenseSummaryOriginal {
  id: number;
  expenseCategory: {
    id: number;
    name: string;
  };
  year: number;
  month: number;
  amount: number;
}

export interface ExpenseDetail {
  id: number;
  date: string;
  category: {
    id: number;
    name: string;
  };
  amount: number;
}
