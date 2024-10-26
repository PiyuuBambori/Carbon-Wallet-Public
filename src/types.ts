export interface Transaction {
  id?: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}