import { DataTable } from "../_components/ui/data-table";
import { db } from "../_lib/prisma";
import { transactionColumns, TransactionDTO } from "./_columns";
import AddTransactionButton from "../_components/shared/add-transaction-button";

const TransactionsPage = async () => {
  const transactionsRaw = await db.transaction.findMany();

  const transactions: TransactionDTO[] = transactionsRaw.map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
  }));

  return (
    <section className="space-y-6 p-6">
      <header className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Transação</h1>

        <AddTransactionButton />
      </header>

      <DataTable columns={transactionColumns} data={JSON.parse(JSON.stringify(transactions))} />
    </section>
  );
};

export default TransactionsPage;
