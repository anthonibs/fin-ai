"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import {
  UpsertTransactionParams,
  UpsertTransactionService,
} from "@/app/modules/transaction/services/upsert-transaction.service";
import { canUserAddTransaction } from "@/app/_actions/get-transaction";

type AddTransactionParams = UpsertTransactionParams & {
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export const upsertTransaction = async (params: AddTransactionParams) => {
  addTransactionSchema.parse(params);
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!params.id && !(await canUserAddTransaction())) {
    throw new Error("Monthly transaction limit reached");
  }

  const service = new UpsertTransactionService(db);
  await service.execute(params, userId);

  revalidatePath("/transactions");
  revalidatePath("/");
};
