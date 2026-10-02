import { PiggyBankIcon, WalletIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import SummaryCard from "./summary-card";
import TransactionsPierChart from "./transactions-pier-chart";
import {
  TotalExpensePerCategory,
  TransactionTypePercentages,
} from "@/app/modules/dashboard/types/dashboard.types";
import ExpensesPerCategory from "./expenses-per-category";

type SummaryCardsProps = {
  balance: number;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  totalTransactionsAmount: number;
  typesPercentage: TransactionTypePercentages;
  totalExpensesPerCategory: TotalExpensePerCategory[];
};

const SummaryCards = async ({
  balance,
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
  totalExpensesPerCategory,
}: SummaryCardsProps) => {
  return (
    <div className="space-y-6">
      <SummaryCard title="Saldo" amount={balance} size="large" icon={<WalletIcon size={16} />} />

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          title="Investido"
          amount={investmentsTotal}
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

      <div className="grid grid-cols-3 grid-rows-1 gap-6">
        <TransactionsPierChart
          depositsTotal={depositsTotal}
          investmentsTotal={investmentsTotal}
          expensesTotal={expensesTotal}
          typesPercentage={typesPercentage}
        />

        <ExpensesPerCategory expensesPerCategory={totalExpensesPerCategory} />
      </div>
    </div>
  );
};

export default SummaryCards;
