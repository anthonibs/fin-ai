import { PrismaClient } from "@prisma/client";

export class DeleteTransactionService {
  constructor(private readonly db: PrismaClient) {}

  public async execute(transactionId: string, userId: string): Promise<void> {
    await this.db.transaction.deleteMany({
      where: {
        id: transactionId,
        userId,
      },
    });
  }
}
