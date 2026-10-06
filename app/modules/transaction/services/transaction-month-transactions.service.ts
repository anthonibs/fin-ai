import { PrismaClient } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";

export class TransactionMonthTransactionsService {
  constructor(private readonly db: PrismaClient) {}

  public async execute(userId: string): Promise<{ transactionsCount: number }> {
    return {
      transactionsCount: await this.fetchTransactionsCount(userId),
    };
  }

  private async fetchTransactionsCount(userId: string): Promise<number> {
    const transactionsCount = await this.db.transaction.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date()),
        },
      },
    });

    return transactionsCount;
  }
}
