import { transactionColumns } from "./_columns";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import AddTransactionButton from "@/app/_components/shared/add-transaction-button";
import { DataTable } from "@/app/_components/ui/data-table";
import { db } from "@/app/_lib/prisma";
import { canUserAddTransaction } from "@/app/_actions/get-transaction";

const TransactionsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const transactionsRaw = await db.transaction.findMany({
    where: {
      userId: userId,
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <section className="h-full space-y-6 p-6">
      <header className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Transações</h1>

        <AddTransactionButton userCanAddTransaction={!userCanAddTransaction} />
      </header>

      <div className="flex h-[calc(100vh-200px)] flex-col">
        <DataTable
          columns={transactionColumns}
          data={JSON.parse(JSON.stringify(transactionsRaw))}
        />
      </div>
    </section>
  );
};

export default TransactionsPage;
