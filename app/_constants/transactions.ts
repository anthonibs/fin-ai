import { TransactionCategory, TransactionPaymentMethod, TransactionType } from "@prisma/client";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  [TransactionType.EXPENSE]: "Despesa",
  [TransactionType.DEPOSIT]: "Depósito",
  [TransactionType.INVESTMENT]: "Investimento",
};

export const TRANSACTION_CATEGORY_LABEL: Record<TransactionCategory, string> = {
  [TransactionCategory.FOOD]: "Alimentação",
  [TransactionCategory.EDUCATION]: "Educação",
  [TransactionCategory.ENTERTAINMENT]: "Entretenimento",
  [TransactionCategory.HEALTH]: "Saúde",
  [TransactionCategory.HOUSING]: "Moradia",
  [TransactionCategory.OTHER]: "Outros",
  [TransactionCategory.SALARY]: "Salário",
  [TransactionCategory.TRANSPORTATION]: "Transporte",
  [TransactionCategory.UTILITIES]: "Utilidades",
};

export const TRANSACTION_PAYMENT_METHOD_LABEL: Record<TransactionPaymentMethod, string> = {
  [TransactionPaymentMethod.BANK_SLIP]: "Boleto Bancário",
  [TransactionPaymentMethod.BANK_TRANSFER]: "Transferência Bancária",
  [TransactionPaymentMethod.CASH]: "Dinheiro",
  [TransactionPaymentMethod.CREDIT_CARD]: "Cartão de Crédito",
  [TransactionPaymentMethod.DEBIT_CARD]: "Cartão de Débito",
  [TransactionPaymentMethod.OTHER]: "Outro",
  [TransactionPaymentMethod.PIX]: "Pix",
};

const mapLabelRecordToOptions = <T extends string>(
  record: Record<T, string>
): SelectOption<T>[] => {
  return (Object.keys(record) as T[]).map((key) => ({
    value: key,
    label: record[key],
  }));
};

export const TRANSACTION_TYPE_OPTIONS: SelectOption<TransactionType>[] =
  mapLabelRecordToOptions(TRANSACTION_TYPE_LABEL);

export const PAYMENT_METHOD_OPTIONS: SelectOption<TransactionPaymentMethod>[] =
  mapLabelRecordToOptions(TRANSACTION_PAYMENT_METHOD_LABEL);

export const TRANSACTION_CATEGORY_OPTIONS: SelectOption<TransactionCategory>[] =
  mapLabelRecordToOptions(TRANSACTION_CATEGORY_LABEL);
