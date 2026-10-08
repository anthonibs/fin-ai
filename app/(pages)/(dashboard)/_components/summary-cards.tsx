import { PiggyBankIcon, WalletIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import SummaryCard from "./summary-card";
import SummaryMainCard from "./summary-main-cards";

type SummaryCardsProps = {
  balance: number;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
};

const SummaryCards = async ({
  balance,
  depositsTotal,
  investmentsTotal,
  expensesTotal,
}: SummaryCardsProps) => {
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
          label="+4.2% este mês"
        />

        <SummaryCard
          title="Receita"
          amount={depositsTotal}
          icon={<TrendingUpIcon size={14} className="text-emerald-600 dark:text-emerald-400" />}
          label="12 entradas registradas"
          valueColor="text-emerald-600 dark:text-emerald-400"
        />
        <SummaryCard
          title="Despesa"
          amount={expensesTotal}
          icon={<TrendingDownIcon size={14} className="text-rose-600 dark:text-rose-400" />}
          label="Dentro do orçamento"
          valueColor="text-rose-600 dark:text-rose-400"
        />
      </div>
    </div>
  );
};

export default SummaryCards;
