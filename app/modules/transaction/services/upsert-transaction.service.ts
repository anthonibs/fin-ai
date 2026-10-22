import {
  PrismaClient,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";

export interface UpsertTransactionParams {
  id?: string;
  name: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date | string;
}

export class UpsertTransactionService {
  constructor(private readonly db: PrismaClient) {}

  public async execute(params: UpsertTransactionParams, userId: string): Promise<void> {
    if (params.id) {
      const { id, ...data } = params;
      const result = await this.db.transaction.updateMany({
        where: {
          id,
          userId,
        },
        data,
      });

      if (result.count === 0) {
        throw new Error("Transaction not found");
      }

      return;
    }

    await this.db.transaction.create({
      data: {
        ...params,
        userId,
      },
    });
  }
}
