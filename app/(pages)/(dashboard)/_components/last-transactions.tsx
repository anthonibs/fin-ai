import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { Transaction } from "@prisma/client";
import { getPriceColor, getAmountPrefix } from "@/app/_components/_utils/currency";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transactions";

type LastTransactionsProps = {
  lastTransactions: Transaction[];
};

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="font-bold">Últimas Transações</CardTitle>

        <Button variant={"outline"} asChild className="rounded-full px-3 py-1 text-xs font-bold">
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>

      <ScrollArea className="-mr-4 h-full overflow-y-auto pr-5">
        <CardContent>
          {lastTransactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between py-2">
              <div className="flex gap-3">
                <div className="flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-white/3 shadow-sm">
                  <span className="mt-0.5 opacity-84">
                    {TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}
                  </span>
                </div>

                <div>
                  <p className="text-md font-bold">{transaction.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(transaction.date)}
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
    </Card>
  );
};

export default LastTransactions;
