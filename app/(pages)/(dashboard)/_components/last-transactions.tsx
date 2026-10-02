import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { Transaction, TransactionType } from "@prisma/client";
import { formatCurrency } from "@/app/_components/_utils/currency";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transactions";

type LastTransactionsProps = {
  lastTransactions: Transaction[];
};

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  const getPriceColor = (transaction: Transaction) => {
    if (transaction.type === TransactionType.EXPENSE) {
      return "text-red-500";
    }
    if (transaction.type === TransactionType.DEPOSIT) {
      return "text-green-500";
    }
    return "text-white";
  };

  const getAmountPrefix = (transaction: Transaction) => {
    let prefix = "";

    if (transaction.type === TransactionType.EXPENSE) {
      prefix = "-";
    }
    if (transaction.type === TransactionType.DEPOSIT) {
      prefix = "+";
    }
    return `${prefix} ${formatCurrency(Number(transaction.amount) || 0)}`;
  };

  return (
    <ScrollArea className="h-full rounded-xl border">
      <CardHeader className="flex items-center justify-between py-6">
        <CardTitle className="font-bold">Últimas Transações</CardTitle>

        <Button variant={"outline"} asChild className="rounded-full font-bold">
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {lastTransactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between py-2">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/3">
                {TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}
              </div>

              <div>
                <p className="text-md font-bold">{transaction.name}</p>
                <p className="text-muted-foreground text-sm">
                  {Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
                    transaction.createdAt
                  )}
                </p>
              </div>
            </div>

            <p className={`text-sm font-bold ${getPriceColor(transaction)}`}>
              {getAmountPrefix(transaction)}
            </p>
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  );
};

export default LastTransactions;
