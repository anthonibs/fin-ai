"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

import UpsertTransactionDialog from "./upsert-transaction-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type AddTransactionButtonProps = {
  userCanAddTransaction?: boolean;
};
const AddTransactionButton = ({ userCanAddTransaction }: AddTransactionButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="inline-block">
            <Button
              className="text-md text-foreground inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 font-bold shadow-md shadow-emerald-600/20 transition-colors duration-200 hover:bg-emerald-500"
              onClick={() => setIsDialogOpen(true)}
              disabled={userCanAddTransaction}
            >
              <Plus />
              Adicionar transação
            </Button>
          </span>
        </TooltipTrigger>

        {userCanAddTransaction && (
          <TooltipContent>Você não pode adicionar mais transações este mês.</TooltipContent>
        )}
      </Tooltip>

      <UpsertTransactionDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};

export default AddTransactionButton;
