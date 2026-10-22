import { db } from "@/app/_lib/prisma";
import { TransactionMonthTransactionsService } from "@/app/modules/transaction/services/transaction-month-transactions.service";
import { auth, clerkClient } from "@clerk/nextjs/server";

const MAX_FREE_MONTHLY_TRANSACTIONS = 10;

export const getTransactionMonthTransactions = async (): Promise<{
  transactionsCount: number;
}> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const service = new TransactionMonthTransactionsService(db);
  return service.execute(userId);
};

export const hasUserPremiumPlan = async (): Promise<boolean> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  return user.publicMetadata?.subscriptionPlan === "premium";
};

export const canUserAddTransaction = async (): Promise<boolean> => {
  if (await hasUserPremiumPlan()) {
    return true;
  }

  const { transactionsCount } = await getTransactionMonthTransactions();

  return transactionsCount < MAX_FREE_MONTHLY_TRANSACTIONS;
};

export const getTransactionQuota = async (): Promise<{
  transactionsCount: number;
  hasPremiumPlan: boolean;
  canUserAddTransaction: boolean;
}> => {
  const [{ transactionsCount }, hasPremiumPlan] = await Promise.all([
    getTransactionMonthTransactions(),
    hasUserPremiumPlan(),
  ]);

  return {
    transactionsCount,
    hasPremiumPlan,
    canUserAddTransaction: hasPremiumPlan || transactionsCount < MAX_FREE_MONTHLY_TRANSACTIONS,
  };
};
