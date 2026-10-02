import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isMatch } from "date-fns";
import Navbar from "@/app/_components/shared/navbar";
import { getDashboard } from "@/app/_actions/get-dashboard";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import LastTransactions from "./_components/last-transactions";
import TransactionsPierChart from "./_components/transactions-pier-chart";
import ExpensesPerCategory from "./_components/expenses-per-category";

type DashboardPageProps = {
  searchParams: Promise<{
    month?: string;
  }>;
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const currentMonth = resolvedSearchParams.month;
  const monthIsInvalid = !currentMonth || !isMatch(currentMonth, "MM");

  if (monthIsInvalid) {
    return redirect("/?month=01");
  }

  const dashboardData = await getDashboard({
    month: currentMonth,
    userId,
  });

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <Navbar />

      <main className="flex flex-1 flex-col space-y-6 overflow-hidden p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Dashboard</h1>
          <TimeSelect />
        </header>

        <section
          aria-label="Dashboard metrics and overview"
          className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[2fr_1fr]"
        >
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards {...dashboardData} />

            <div className="grid h-full grid-cols-1 gap-6 overflow-hidden pr-1 md:grid-cols-3">
              <div className="h-full md:col-span-1">
                <TransactionsPierChart
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
      </main>
    </div>
  );
};

export default DashboardPage;
