"use client";
import { useState } from "react";
import { ArrowDownUpIcon } from "lucide-react";
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
        <TooltipTrigger>
          <Button
            className="hover:bg-primary/90 flex cursor-pointer items-center justify-center rounded-full text-[14px] transition-colors duration-200"
            onClick={() => setIsDialogOpen(true)}
            disabled={userCanAddTransaction}
          >
            Adicionar transação
            <ArrowDownUpIcon />
          </Button>
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
