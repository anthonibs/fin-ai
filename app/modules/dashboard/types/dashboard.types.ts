import { Transaction, TransactionCategory, TransactionType } from "@prisma/client";

export type TransactionTypePercentages = Record<TransactionType, number>;

export interface TotalExpensePerCategory {
  category: TransactionCategory;
  totalAmount: number;
  percentageOfTotal: number;
}

export interface GetDashboardParams {
  userId: string;
  month: string;
  year?: string;
  expenseBudgetLimitPercent?: number;
}

export interface DashboardMetrics {
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  balance: number;
  totalTransactionsAmount: number;
  typesPercentage: TransactionTypePercentages;
  totalExpensesPerCategory: TotalExpensePerCategory[];
  lastTransactions: Transaction[];
  isExpenseWithinBudget: boolean;
}
