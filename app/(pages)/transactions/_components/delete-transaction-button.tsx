"use client";

import { useState } from "react";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { deleteTransaction } from "@/app/_actions/delete-transaction";

type DeleteTransactionButtonProps = {
  transactionId: string;
  transactionName: string;
};

const DeleteTransactionButton = ({
  transactionId,
  transactionName,
}: DeleteTransactionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);

      await deleteTransaction({ id: transactionId });
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      setErrorMessage("Não foi possível excluir a transação. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground cursor-pointer hover:text-red-400"
        onClick={() => setIsOpen(true)}
        aria-label={`Excluir transação ${transactionName}`}
      >
        <TrashIcon size={16} />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir transação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a transação{" "}
              <span className="text-foreground font-semibold">{transactionName}</span>? Essa ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
              {errorMessage}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground mr-2" disabled={isDeleting}>
                Cancelar
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteTransactionButton;
