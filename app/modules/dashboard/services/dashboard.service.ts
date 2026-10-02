import { PrismaClient, Transaction, TransactionCategory, TransactionType } from "@prisma/client";
import {
  DashboardMetrics,
  GetDashboardParams,
  TotalExpensePerCategory,
  TransactionTypePercentages,
} from "../types/dashboard.types";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface GroupByTypeResult {
  type: TransactionType;
  _sum: {
    amount: number | null;
  };
}

interface GroupByCategoryResult {
  category: TransactionCategory;
  _sum: {
    amount: number | null;
  };
}

export class DashboardService {
  constructor(private readonly db: PrismaClient) {}

  public async execute({ userId, month, year }: GetDashboardParams): Promise<DashboardMetrics> {
    const { startDate, endDate } = this.resolveDateRange(month, year);

    const [aggregatesByType, aggregatesByCategory] = await Promise.all([
      this.fetchAggregatesByType(userId, startDate, endDate),
      this.fetchAggregatesByCategory(userId, startDate, endDate),
    ]);

    const lastTransactions = await this.fetchAggregatesLastTransactions(
      userId,
      startDate,
      endDate,
      10
    );

    const { depositsTotal, investmentsTotal, expensesTotal, totalTransactionsAmount, balance } =
      this.calculateTypeTotals(aggregatesByType);

    const typesPercentage = this.calculateTypePercentages(
      depositsTotal,
      investmentsTotal,
      expensesTotal,
      totalTransactionsAmount
    );

    const totalExpensesPerCategory = this.buildExpensesByCategory(
      aggregatesByCategory,
      expensesTotal
    );

    return {
      depositsTotal,
      investmentsTotal,
      expensesTotal,
      balance,
      totalTransactionsAmount,
      typesPercentage,
      totalExpensesPerCategory,
      lastTransactions,
    };
  }

  private async fetchAggregatesByType(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<GroupByTypeResult[]> {
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
    return aggregates.map((group) => ({
      type: group.type,
      _sum: {
        amount: Number(group._sum.amount) || 0,
      },
    }));
  }

  private async fetchAggregatesByCategory(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<GroupByCategoryResult[]> {
    const aggregates = await this.db.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    });
    return aggregates.map((group) => ({
      category: group.category,
      _sum: {
        amount: Number(group._sum.amount) || 0,
      },
    }));
  }

  private fetchAggregatesLastTransactions(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<Transaction[]> {
    return this.db.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });
  }

  private calculateTypeTotals(aggregates: GroupByTypeResult[]): {
    depositsTotal: number;
    investmentsTotal: number;
    expensesTotal: number;
    totalTransactionsAmount: number;
    balance: number;
  } {
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

    return {
      depositsTotal,
      investmentsTotal,
      expensesTotal,
      totalTransactionsAmount,
      balance,
    };
  }

  private calculateTypePercentages(
    depositsTotal: number,
    investmentsTotal: number,
    expensesTotal: number,
    totalTransactionsAmount: number
  ): TransactionTypePercentages {
    return {
      [TransactionType.DEPOSIT]: this.calculatePercentage(depositsTotal, totalTransactionsAmount),
      [TransactionType.INVESTMENT]: this.calculatePercentage(
        investmentsTotal,
        totalTransactionsAmount
      ),
      [TransactionType.EXPENSE]: this.calculatePercentage(expensesTotal, totalTransactionsAmount),
    };
  }

  private buildExpensesByCategory(
    groups: GroupByCategoryResult[],
    totalExpensesAmount: number
  ): TotalExpensePerCategory[] {
    return groups.map((group) => {
      const categoryTotal = Number(group._sum.amount) || 0;
      return {
        category: group.category,
        totalAmount: categoryTotal,
        percentageOfTotal: this.calculatePercentage(categoryTotal, totalExpensesAmount),
      };
    });
  }

  private resolveDateRange(month: string, year?: string): DateRange {
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
