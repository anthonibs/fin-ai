import { TransactionType } from "@prisma/client";

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
}
