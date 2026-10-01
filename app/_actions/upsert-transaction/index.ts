"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { TransactionCategory, TransactionPaymentMethod, TransactionType } from "@prisma/client";

type AddTransactionParams = {
  id?: string;
  name: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export const upsertTransaction = async (params: AddTransactionParams) => {
  addTransactionSchema.parse(params);
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  await db.transaction.upsert({
    where: {
      id: params.id ?? "",
    },
    update: {
      ...params,
      userId,
    },
    create: {
      ...params,
      userId,
      ...(params.id ? { id: params.id } : {}),
    },
  });
  revalidatePath("/transactions");
};
