import { PiggyBankIcon, WalletIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import SummaryCard from "./summary-card";
import { db } from "@/app/_lib/prisma";

type SummaryCardsProps = {
  month?: string;
};

const SummaryCards = async ({ month }: SummaryCardsProps) => {
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

  const balance = depositsTotal - expensesTotal;

  return (
    <div className="space-y-6">
      <SummaryCard title="Saldo" amount={balance} size="large" icon={<WalletIcon size={16} />} />

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          title="Investido"
          amount={investimentsTotal}
          icon={<PiggyBankIcon size={14} />}
        />

        <SummaryCard
          title="Receita"
          amount={depositsTotal}
          icon={<TrendingUpIcon size={14} className="text-primary" />}
        />
        <SummaryCard
          title="Despesa"
          amount={expensesTotal}
          icon={<TrendingDownIcon size={14} className="text-red-500" />}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
