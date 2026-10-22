"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteTransactionSchema } from "./schema";
import { DeleteTransactionService } from "@/app/modules/transaction/services/delete-transaction.service";

export const deleteTransaction = async (params: { id: string }) => {
  deleteTransactionSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const service = new DeleteTransactionService(db);
  await service.execute(params.id, userId);

  revalidatePath("/transactions");
  revalidatePath("/");
};
