import { db } from "@/app/_lib/prisma";
import { TransactionMonthTransactionsService } from "@/app/modules/transaction/services/transaction-month-transactions.service";
import { auth, clerkClient } from "@clerk/nextjs/server";

const MAX_FREE_MONTHLY_TRANSACTIONS = 10;

export const getTransactionMonthTransactions = async (params: {
  userId: string;
}): Promise<{ transactionsCount: number }> => {
  const service = new TransactionMonthTransactionsService(db);
  return service.execute(params.userId);
};

export const canUserAddTransaction = async (): Promise<boolean> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  if (user.publicMetadata?.subscriptionPlan === "premium") {
    return true;
  }

  const { transactionsCount } = await getTransactionMonthTransactions({ userId });

  return transactionsCount < MAX_FREE_MONTHLY_TRANSACTIONS;
};
