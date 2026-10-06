import { PiggyBankIcon, WalletIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import SummaryCard from "./summary-card";

type SummaryCardsProps = {
  balance: number;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  userCanAddTransaction?: boolean;
};

const SummaryCards = async ({
  balance,
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  userCanAddTransaction,
}: SummaryCardsProps) => {
  return (
    <div className="space-y-6">
      <SummaryCard
        title="Saldo"
        amount={balance}
        userCanAddTransaction={userCanAddTransaction}
        size="large"
        icon={<WalletIcon size={16} />}
      />

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
    </div>
  );
};

export default SummaryCards;
