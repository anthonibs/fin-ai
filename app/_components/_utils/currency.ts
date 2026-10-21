import { Transaction, TransactionType } from "@prisma/client";

export const formatCurrency = (amount: number) => {
  return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
};

export const getPriceColor = (transaction: Transaction) => {
  if (transaction.type === TransactionType.EXPENSE) {
    return "text-rose-600 dark:text-rose-400";
  }
  if (transaction.type === TransactionType.DEPOSIT) {
    return "text-emerald-600 dark:text-emerald-400";
  }
  return "text-blue-600 dark:text-blue-400";
};

export const getAmountPrefix = (transaction: Transaction) => {
  let prefix = "";

  if (transaction.type === TransactionType.EXPENSE) {
    prefix = "-";
  }
  if (transaction.type === TransactionType.DEPOSIT) {
    prefix = "+";
  }
  return `${prefix} ${formatCurrency(Number(transaction.amount) || 0)}`;
};
