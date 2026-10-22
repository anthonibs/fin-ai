import { transactionColumns } from "./_columns";
import AddTransactionButton from "@/app/_components/shared/add-transaction-button";
import { DataTable } from "@/app/_components/ui/data-table";
import { db } from "@/app/_lib/prisma";
import { requireAuth } from "@/app/_lib/auth";
import { canUserAddTransaction } from "@/app/_actions/get-transaction";

const TransactionsPage = async () => {
  const userId = await requireAuth();

  const transactionsRaw = await db.transaction.findMany({
    where: {
      userId: userId,
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <section className="h-full space-y-6 p-6">
      <header className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie e audite todos os fluxos financeiros registrados na sua conta.
          </p>
        </div>

        <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
      </header>

      <div className="flex flex-col pb-8">
        <DataTable
          columns={transactionColumns}
          data={JSON.parse(JSON.stringify(transactionsRaw))}
        />
      </div>
    </section>
  );
};

export default TransactionsPage;
