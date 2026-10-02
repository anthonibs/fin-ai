import { Transaction, TransactionType } from "@prisma/client";

export interface GetDashboardParams {
  userId: string;
  month: string;
  year?: string;
}

export type TransactionTypePercentages = Record<TransactionType, number>;

export interface DashboardMetrics {
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  balance: number;
  totalTransactionsAmount: number;
  typesPercentage: TransactionTypePercentages;
  totalExpensesPerCategory: TotalExpensePerCategory[];
  lastTransactions: Transaction[];
}

export interface TotalExpensePerCategory {
  category: string;
  totalAmount: number;
  percentageOfTotal: number;
}
