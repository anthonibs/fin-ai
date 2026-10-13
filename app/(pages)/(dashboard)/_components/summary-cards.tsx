import { TransactionType } from "@prisma/client";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react";
import { TransactionTypePercentages } from "@/app/modules/dashboard/types/dashboard.types";
import SummaryCard from "./summary-card";
import SummaryMainCard from "./summary-main-cards";

type SummaryCardsProps = {
  transactionsCount: number;
  balance: number;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  typesPercentage: TransactionTypePercentages;
  isExpenseWithinBudget: boolean;
};

const SummaryCards = ({
  balance,
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  transactionsCount,
  typesPercentage,
  isExpenseWithinBudget,
}: SummaryCardsProps) => {
  const formatPercentageBadge = (value: number) => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value}%`;
  };

  const investmentPercentage = typesPercentage[TransactionType.INVESTMENT];
  const invText = `${formatPercentageBadge(investmentPercentage)} este mês`;

  const depText = `${transactionsCount} ${
    transactionsCount === 1 ? "transação registrada" : "transações registradas"
  }`;

  const budgetStatusLabel = isExpenseWithinBudget ? "Dentro do orçamento" : "Fora do orçamento";

  return (
    <div className="space-y-6">
      <SummaryMainCard
        title="Saldo Total Consolidado"
        amount={balance}
        icon={<WalletIcon size={16} />}
      />

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          title="Investido"
          amount={investmentsTotal}
          icon={<PiggyBankIcon size={14} />}
          valueColor="text-foreground"
          labelProps={{
            label: invText,
            labelColor:
              investmentPercentage > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground",
          }}
        />

        <SummaryCard
          title="Receita"
          amount={depositsTotal}
          icon={<TrendingUpIcon size={14} className="text-emerald-600 dark:text-emerald-400" />}
          valueColor="text-emerald-600 dark:text-emerald-400"
          labelProps={{
            label: depText,
            labelColor: "text-muted-foreground",
          }}
        />

        <SummaryCard
          title="Despesa"
          amount={expensesTotal}
          icon={<TrendingDownIcon size={14} className="text-rose-600 dark:text-rose-400" />}
          valueColor="text-rose-600 dark:text-rose-400"
          labelProps={{
            label: budgetStatusLabel,
            labelColor: isExpenseWithinBudget
              ? "text-muted-foreground"
              : "text-rose-600 dark:text-rose-400",
          }}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
