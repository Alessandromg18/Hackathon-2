import axios from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  ExpenseCategory, 
  ExpenseSummary,
  ExpenseSummaryOriginal,
  ExpenseDetail
} from '../types';

const API_BASE_URL = 'http://198.211.105.95:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout al conectar con el servidor');
    }
    if (!error.response) {
      throw new Error('Error de conexión con el servidor');
    }
    throw error;
  }
);


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    (config.headers = config.headers || {});
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const mapSummaryToDetail = (summaryData: ExpenseSummaryOriginal[]): ExpenseDetail[] => {
  return summaryData.map(item => ({
    id: item.id,
    date: `${item.year}-${item.month.toString().padStart(2, '0')}-01`, // Formato YYYY-MM-DD, usando día 1 como predeterminado
    category: {
      id: item.expenseCategory.id,
      name: item.expenseCategory.name
    },
    amount: item.amount
  }));
};

export const authService = {
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthResponse>('/authentication/register', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/authentication/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error('Credenciales inválidas');
    }
  },
};

export const expenseService = {
  getDetail: async (year: number, month: number, categoryId: number) => {
    const params = new URLSearchParams();
    params.append('year', year.toString());
    params.append('month', month.toString());
    params.append('categoryId', categoryId.toString());
    
    const response = await api.get<ExpenseSummary[]>(`/expenses/detail?${params}`);
    return response.data;
  },

  getAllExpensesForDate: async (year: number, month: number) => {
    const categoryIds = Array.from({ length: 20 }, (_, i) => i + 1);
    const allExpenses: ExpenseSummary[] = [];

    for (const categoryId of categoryIds) {
      try {
        const expenses = await expenseService.getDetail(year, month, categoryId);
        allExpenses.push(...expenses);
      } catch (error) {
        console.error(`Error fetching expenses for category ${categoryId}:`, error);
        continue;
      }
    }

    return allExpenses;
  },

  create: async (expense: { amount: number; category: { id: number }; date: string }) => {
    const response = await api.post<ExpenseSummary>('/expenses', expense);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/expenses/${id}`);
  },

  getCategories: async () => {
    const response = await api.get<ExpenseCategory[]>('/expenses_category');
    return response.data;
  },

  getSummary: async (year?: number, month?: number, categoryId?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    if (categoryId) params.append('categoryId', categoryId.toString());
    
    const response = await api.get<ExpenseSummary[]>(`/expenses_summary?${params}`);
    return response.data;
  },

  getFullSummaryRaw: async () => {
    const response = await api.get<ExpenseSummaryOriginal[]>('/expenses_summary');
    return response.data;
  },

  getFullSummary: async (): Promise<ExpenseDetail[]> => {
    const response = await api.get<ExpenseSummaryOriginal[]>('/expenses_summary');
    return mapSummaryToDetail(response.data);
  },
};

export const categoryService = {
  getAll: async () => {
    const response = await api.get<ExpenseCategory[]>('/expenses_category');
    return response.data;
  }
};
