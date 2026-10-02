import { PrismaClient, TransactionType } from "@prisma/client";
import {
  DashboardMetrics,
  GetDashboardParams,
  TransactionTypePercentages,
} from "../types/dashboard.types";

export class DashboardService {
  constructor(private readonly db: PrismaClient) {}

  public async execute({ userId, month, year }: GetDashboardParams): Promise<DashboardMetrics> {
    const { startDate, endDate } = this.resolveDateRange(month, year);

    const aggregates = await this.db.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalsMap: Record<TransactionType, number> = {
      [TransactionType.DEPOSIT]: 0,
      [TransactionType.INVESTMENT]: 0,
      [TransactionType.EXPENSE]: 0,
    };

    for (const group of aggregates) {
      totalsMap[group.type] = Number(group._sum.amount) || 0;
    }

    const depositsTotal = totalsMap[TransactionType.DEPOSIT];
    const investmentsTotal = totalsMap[TransactionType.INVESTMENT];
    const expensesTotal = totalsMap[TransactionType.EXPENSE];

    const totalTransactionsAmount = depositsTotal + investmentsTotal + expensesTotal;
    const balance = depositsTotal - investmentsTotal - expensesTotal;

    const typesPercentage: TransactionTypePercentages = {
      [TransactionType.DEPOSIT]: this.calculatePercentage(depositsTotal, totalTransactionsAmount),
      [TransactionType.INVESTMENT]: this.calculatePercentage(
        investmentsTotal,
        totalTransactionsAmount
      ),
      [TransactionType.EXPENSE]: this.calculatePercentage(expensesTotal, totalTransactionsAmount),
    };

    return {
      depositsTotal,
      investmentsTotal,
      expensesTotal,
      balance,
      totalTransactionsAmount,
      typesPercentage,
    };
  }

  private resolveDateRange(month: string, year?: string): { startDate: Date; endDate: Date } {
    const currentDate = new Date();
    const parsedYear = Number(year);
    const resolvedYear =
      !isNaN(parsedYear) && parsedYear > 1900 ? parsedYear : currentDate.getFullYear();

    const parsedMonth = Number(month);
    const resolvedMonthIndex =
      !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
        ? parsedMonth - 1
        : currentDate.getMonth();

    return {
      startDate: new Date(resolvedYear, resolvedMonthIndex, 1),
      endDate: new Date(resolvedYear, resolvedMonthIndex + 1, 1),
    };
  }

  private calculatePercentage(amount: number, total: number): number {
    if (total <= 0) return 0;
    return Math.round((amount / total) * 100);
  }
}
