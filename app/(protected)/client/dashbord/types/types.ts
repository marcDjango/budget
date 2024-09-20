
export interface Expense {
    id: string;
    name: string;
    amount: number;
    paid: boolean;
  }
  
 export interface FixedExpense {
    id: string;
    name: string;
    amount: number;
    category: string;
    paid: boolean;
  }
  
 export interface MonthlyExpense {
    id: string;
    month: number;
    year: number;
    amount: number;
  }