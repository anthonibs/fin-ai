"use client";

import { useState } from "react";
import Link from "next/link";
import { BotIcon, Loader2Icon } from "lucide-react";
import { AiReportMarkdown } from "./ai-report";
import { generateAiReport } from "../_actions/generate-ai-report";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

interface AiReportButtonProps {
  month: string;
  hasPremiumPlan: boolean;
}

export const AiReportButton = ({ month, hasPremiumPlan }: AiReportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setReport(null);
      setErrorMessage(null);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const aiReport = await generateAiReport({ month });
      setReport(aiReport);
    } catch (error) {
      console.error("Erro ao gerar relatório IA:", error);
      setErrorMessage("Não foi possível gerar o relatório no momento. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BotIcon className="h-4 w-4" />
          Relatório IA
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-162.5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BotIcon className="text-primary h-5 w-5" />
            Relatório de Finanças com IA
          </DialogTitle>
          <DialogDescription>
            {hasPremiumPlan
              ? "Gere uma análise detalhada dos seus gastos e receba dicas personalizadas para o mês selecionado."
              : "Você precisa de um plano Premium ativo para gerar relatórios financeiros inteligentes."}
          </DialogDescription>
        </DialogHeader>

        {hasPremiumPlan ? (
          <ScrollArea className="max-h-120 pr-3">
            {isLoading && (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-16 text-center">
                <Loader2Icon className="text-primary h-8 w-8 animate-spin" />
                <p className="text-sm font-medium">
                  Analisando suas transações e elaborando seus insights...
                </p>
              </div>
            )}

            {!isLoading && errorMessage && (
              <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-4 text-center text-sm">
                {errorMessage}
              </div>
            )}

            {!isLoading && !errorMessage && report && <AiReportMarkdown content={report} />}

            {!isLoading && !errorMessage && !report && (
              <div className="text-muted-foreground py-12 text-center text-sm">
                Clique no botão abaixo para consolidar seus dados deste mês.
              </div>
            )}
          </ScrollArea>
        ) : (
          <div className="border-border text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
            O recurso de inteligência artificial consolida transações, aponta padrões de gastos e
            traça estratégias de economia exclusivas para assinantes Premium.
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {!hasPremiumPlan ? (
            <>
              <DialogClose asChild>
                <Button variant="ghost">Voltar</Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription">Conhecer o Plano Premium</Link>
              </Button>
            </>
          ) : report ? (
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          ) : (
            <>
              <DialogClose asChild>
                <Button variant="ghost" disabled={isLoading}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button onClick={handleGenerateReport} disabled={isLoading} className="gap-2">
                {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
                {isLoading ? "Gerando..." : "Gerar Relatório"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
