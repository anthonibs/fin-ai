import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";

const getDashboard = async ({ month }: { month: string }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const monthNumber = Number(month);
  const currentMonthIndex =
    !isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12
      ? monthNumber - 1
      : currentDate.getMonth();

  const where = {
    date: {
      gte: new Date(currentYear, currentMonthIndex, 1),
      lt: new Date(currentYear, currentMonthIndex + 1, 1),
    },
  };

  const [depositsResult, investmentsResult, expensesResult] = await Promise.all([
    db.transaction.aggregate({
      where: { type: "DEPOSIT", ...where },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { type: "INVESTMENT", ...where },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { type: "EXPENSE", ...where },
      _sum: { amount: true },
    }),
  ]);

  const depositsTotal = Number(depositsResult._sum.amount) || 0;
  const investimentsTotal = Number(investmentsResult._sum.amount) || 0;
  const expensesTotal = Number(expensesResult._sum.amount) || 0;

  const balance = depositsTotal - investimentsTotal - expensesTotal;

  const transactionsTotal = await db.transaction.aggregate({
    where: { ...where },
    _sum: { amount: true },
  });

  const typesPercentage = {
    [TransactionType.DEPOSIT]: Math.round(
      (depositsTotal / Number(transactionsTotal._sum.amount)) * 100
    ),
    [TransactionType.INVESTMENT]: Math.round(
      (investimentsTotal / Number(transactionsTotal._sum.amount)) * 100
    ),
    [TransactionType.EXPENSE]: Math.round(
      (expensesTotal / Number(transactionsTotal._sum.amount)) * 100
    ),
  };

  return {
    depositsTotal,
    investimentsTotal,
    expensesTotal,
    balance,
  };
};

export default getDashboard;
