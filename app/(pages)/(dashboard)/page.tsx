import { redirect } from "next/navigation";
import { isMatch } from "date-fns";
import { requireAuth } from "@/app/_lib/auth";
import { getDashboard } from "@/app/_actions/get-dashboard";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import LastTransactions from "./_components/last-transactions";
import TransactionsPierChart from "./_components/transactions-pier-chart";
import ExpensesPerCategory from "./_components/expenses-per-category";
import { getTransactionQuota } from "@/app/_actions/get-transaction";
import AiReportButton from "./_components/ai-report-button";
import AddTransactionButton from "@/app/_components/shared/add-transaction-button";

type DashboardPageProps = {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const userId = await requireAuth();

  const resolvedSearchParams = await searchParams;
  const currentMonth = resolvedSearchParams.month;
  const currentYear = resolvedSearchParams.year;
  const monthIsInvalid = !currentMonth || !isMatch(currentMonth, "MM");
  const yearIsInvalid = currentYear !== undefined && !isMatch(currentYear, "yyyy");

  if (monthIsInvalid || yearIsInvalid) {
    return redirect(`/?month=${new Date().getMonth() + 1}`);
  }

  const [{ transactionsCount, hasPremiumPlan, canUserAddTransaction }, dashboardData] =
    await Promise.all([
      getTransactionQuota(),
      getDashboard({
        userId,
        month: currentMonth,
        year: currentYear,
      }),
    ]);

  return (
    <section className="flex h-full flex-1 flex-col space-y-6 overflow-hidden">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Dashboard Financeiro
          </h1>

          <p className="text-foreground/80">Visão consolidada das suas finanças e movimentações.</p>
        </div>

        <div className="flex gap-3">
          <TimeSelect />
          <AiReportButton month={currentMonth} hasPremiumPlan={hasPremiumPlan} />
          <AddTransactionButton userCanAddTransaction={canUserAddTransaction} />
        </div>
      </header>

      <section
        aria-label="Dashboard metrics and overview"
        className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[2fr_1fr]"
      >
        <div className="flex flex-col gap-6 overflow-hidden">
          <SummaryCards {...dashboardData} transactionsCount={transactionsCount} />

          <div className="grid h-full grid-cols-1 gap-6 overflow-hidden pr-1 md:grid-cols-3">
            <div className="h-full md:col-span-1">
              <TransactionsPierChart
                month={currentMonth}
                depositsTotal={dashboardData.depositsTotal}
                investmentsTotal={dashboardData.investmentsTotal}
                expensesTotal={dashboardData.expensesTotal}
                typesPercentage={dashboardData.typesPercentage}
              />
            </div>

            <div className="h-full overflow-hidden md:col-span-2">
              <ExpensesPerCategory expensesPerCategory={dashboardData.totalExpensesPerCategory} />
            </div>
          </div>
        </div>

        <aside aria-label="Last transactions activity" className="flex flex-col overflow-hidden">
          <LastTransactions lastTransactions={dashboardData.lastTransactions} />
        </aside>
      </section>
    </section>
  );
};

export default DashboardPage;
