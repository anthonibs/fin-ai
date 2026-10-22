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

export const hasUserPremiumPlan = async (userId: string): Promise<boolean> => {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  return user.publicMetadata?.subscriptionPlan === "premium";
};

export const canUserAddTransaction = async (): Promise<boolean> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (await hasUserPremiumPlan(userId)) {
    return true;
  }

  const { transactionsCount } = await getTransactionMonthTransactions({ userId });

  return transactionsCount < MAX_FREE_MONTHLY_TRANSACTIONS;
};

export const getTransactionQuota = async (
  userId: string
): Promise<{
  transactionsCount: number;
  hasPremiumPlan: boolean;
  canUserAddTransaction: boolean;
}> => {
  const [{ transactionsCount }, hasPremiumPlan] = await Promise.all([
    getTransactionMonthTransactions({ userId }),
    hasUserPremiumPlan(userId),
  ]);

  return {
    transactionsCount,
    hasPremiumPlan,
    canUserAddTransaction: hasPremiumPlan || transactionsCount < MAX_FREE_MONTHLY_TRANSACTIONS,
  };
};
