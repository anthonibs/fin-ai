"use client";
import { useState } from "react";
import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../ui/button";

import UpsertTransactionDialog from "./upsert-transaction-dialog";

const AddTransactionButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        className="hover:bg-primary/90 flex cursor-pointer items-center justify-center rounded-full text-[14px] transition-colors duration-200"
        onClick={() => setIsDialogOpen(true)}
      >
        Adicionar transação
        <ArrowDownUpIcon />
      </Button>

      <UpsertTransactionDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};

export default AddTransactionButton;
