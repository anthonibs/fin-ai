import { DataTable } from "../_components/ui/data-table";
import { db } from "../_lib/prisma";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/shared/add-transaction-button";
import Navbar from "../_components/shared/navbar";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

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

  return (
    <>
      <Navbar />

      <section className="space-y-6 p-6">
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>

          <AddTransactionButton />
        </header>

        <DataTable
          columns={transactionColumns}
          data={JSON.parse(JSON.stringify(transactionsRaw))}
        />
      </section>
    </>
  );
};

export default TransactionsPage;
