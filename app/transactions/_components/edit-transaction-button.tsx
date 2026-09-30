"use client";
import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { TransactionDTO } from "../_columns";

import UpsertTransactionDialog from "@/app/_components/shared/upsert-transaction-dialog";
import { Button } from "@/app/_components/ui/button";

type EditTransactionButtonProps = {
  transaction: TransactionDTO;
};

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!transaction) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <PencilIcon />
      </Button>

      <UpsertTransactionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        defaultValues={{
          ...transaction,
          amount: Number(transaction.amount),
        }}
        transactionId={transaction.id}
      />
    </>
  );
};

export default EditTransactionButton;
