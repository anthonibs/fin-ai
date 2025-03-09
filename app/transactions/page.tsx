import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../_components/ui/button";

import { DataTable } from "../_components/ui/data-table";
import { db } from "../_lib/prisma";
import { transactionColumns } from "./_columns";

const TransactionsPage = async () => {
  const transactions = await db.transaction.findMany({});

  return (
    <section className="space-y-6 p-6">
      <header className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Transação</h1>

        <Button className="flex items-center justify-center rounded-full text-[14px]">
          Adicionar transação
          <ArrowDownUpIcon />
        </Button>
      </header>

      <DataTable columns={transactionColumns} data={transactions} />
    </section>
  );
};

export default TransactionsPage;
