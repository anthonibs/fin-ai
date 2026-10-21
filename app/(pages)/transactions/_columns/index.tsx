"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { Prisma, TransactionCategory, TransactionPaymentMethod } from "@prisma/client";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  TRANSACTION_CATEGORY_LABEL,
  TRANSACTION_PAYMENT_METHOD_LABEL,
} from "@/app/_constants/transactions";
import EditTransactionButton from "../_components/edit-transaction-button";
import { getAmountPrefix, getPriceColor } from "@/app/_components/_utils/currency";

export type TransactionColumn = {
  id: string;
  name: string;
  type: "DEPOSIT" | "EXPENSE" | "INVESTMENT";
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
  amount: Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

const TRANSACTION_TYPE_CONFIG = {
  DEPOSIT: {
    label: "Ganho",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400 ",
  },
  EXPENSE: {
    label: "Despesa",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
    dotClass: "bg-red-400",
  },
  INVESTMENT: {
    label: "Investimento",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-400",
  },
};

export const transactionColumns: ColumnDef<TransactionColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row: { original: transaction } }) => (
      <span className="font-medium text-white">{transaction.name}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => {
      const config = TRANSACTION_TYPE_CONFIG[transaction.type];
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${config.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} aria-hidden="true" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row: { original: transaction } }) => (
      <span className="text-muted-foreground">
        {TRANSACTION_CATEGORY_LABEL[transaction.category]}
      </span>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Método",
    cell: ({ row: { original: transaction } }) => (
      <span className="text-muted-foreground">
        {TRANSACTION_PAYMENT_METHOD_LABEL[transaction.paymentMethod]}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Data",
    filterFn: (row, columnId, filterValue: [string, string]) => {
      if (!filterValue) return true;
      const [from, to] = filterValue;
      if (!from && !to) return true;
      const rowTime = new Date(row.getValue(columnId)).getTime();
      if (from) {
        const fromTime = new Date(`${from}T00:00:00`).getTime();
        if (rowTime < fromTime) return false;
      }
      if (to) {
        const toTime = new Date(`${to}T23:59:59.999`).getTime();
        if (rowTime > toTime) return false;
      }
      return true;
    },
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: transaction } }) => {
      return (
        <p className={`text-sm font-bold ${getPriceColor(transaction)}`}>
          {getAmountPrefix(transaction)}
        </p>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => (
      <div className="flex items-center justify-end gap-1">
        <EditTransactionButton transaction={transaction} />

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400">
          <TrashIcon size={16} />
        </Button>
      </div>
    ),
  },
];
