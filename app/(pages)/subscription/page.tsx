import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckIcon, Sparkles, XIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Progress } from "@/app/_components/ui/progress";
import { Button } from "@/app/_components/ui/button";
import { getTransactionMonthTransactions } from "@/app/_actions/get-transaction";
import AcquirePlanButton from "./_components/acquire-plan-button";

const MAX_FREE_TRANSACTIONS = 10;

const BASIC_DISABLED_FEATURES = [
  "Relatório com IA indisponível",
  "Sincronização Open Banking automática",
  "Exportação avançada em relatórios CSV",
];

const PRO_FEATURES = [
  "Transações ilimitadas por mês",
  "Relatório financeiro com Inteligência Artificial",
  "Sincronização bancária Open Banking em tempo real",
  "Exportação avançada em relatórios (CSV, Excel, PDF)",
  "Suporte prioritário e múltiplas contas integradas",
];

const SubscriptionPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const [user, { transactionsCount: currentMonthTransactionsCount }] = await Promise.all([
    clerkClient().then((clerk) => clerk.users.getUser(userId)),
    getTransactionMonthTransactions({ userId }),
  ]);

  const hasPremiumPlan = user?.publicMetadata?.subscriptionPlan === "premium";

  const usagePercentage = Math.min(
    Math.round((currentMonthTransactionsCount / MAX_FREE_TRANSACTIONS) * 100),
    100
  );
  const isLimitReached = currentMonthTransactionsCount >= MAX_FREE_TRANSACTIONS;

  return (
    <section className="space-y-6 p-6">
      <header>
        <Badge className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-900/24 px-4 py-1.5 text-xs font-medium text-emerald-400 shadow-sm">
          <Sparkles className="h-4 w-4 shrink-0" />
          Gerenciamento de Assinatura
        </Badge>

        <h1 className="text-3xl font-bold">Assinatura & Planos</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Gerencie seu plano atual, acompanhe métodos de faturamento e libere recursos avançados de
          IA para tomada de decisões financeiras.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="flex w-full max-w-146 flex-col p-8">
          <CardHeader className="relative border-b pb-6">
            <Badge
              className={
                !hasPremiumPlan
                  ? "absolute top-0 right-0 rounded-sm border border-emerald-400/12 bg-emerald-400/10 py-1 text-emerald-400"
                  : "bg-background/20 border-muted-foreground/12 text-muted-foreground absolute top-0 right-0 rounded-sm border py-1"
              }
            >
              {!hasPremiumPlan ? "Plano Atual" : "Gratuito"}
            </Badge>

            <div>
              <h2 className="text-xl font-bold">Plano Básico</h2>
              <p className="text-muted-foreground text-xs">
                Ideal para quem está começando a organizar suas finanças pessoais.
              </p>
            </div>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-extrabold">R$ 0,00</span>
              <span className="text-muted-foreground text-lg">/ mês</span>
            </div>
            <span className="text-muted-foreground text-xs">
              Grátis para sempre, sem cartão de crédito
            </span>
          </CardHeader>

          <CardContent className="mb-auto pt-6">
            <ul className="space-y-4">
              <li className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <CheckIcon className="text-primary shrink-0" size={16} />
                  <p className="text-sm text-white/88">
                    Até {MAX_FREE_TRANSACTIONS} transações por mês{" "}
                    <span className="font-bold text-amber-400">
                      ({currentMonthTransactionsCount}/{MAX_FREE_TRANSACTIONS} utilizadas)
                    </span>
                  </p>
                </div>

                <div className="pl-7">
                  <Progress
                    value={usagePercentage}
                    className="w-full"
                    indicatorClassName="bg-amber-400"
                  />
                  <div className="text-muted-foreground mt-1.5 flex w-full justify-between text-[10px]">
                    <span>{isLimitReached ? "Limite atingido" : "Uso mensal"}</span>
                    <span>{usagePercentage}%</span>
                  </div>
                </div>
              </li>

              <li className="flex items-center gap-3 text-sm text-white/88">
                <CheckIcon className="text-primary shrink-0" size={16} />
                <p>Categorização manual simples</p>
              </li>

              {BASIC_DISABLED_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="text-muted-foreground flex items-center gap-3 text-sm opacity-50"
                >
                  <XIcon className="shrink-0" size={16} />
                  <p className="line-through">{feature}</p>
                </li>
              ))}
            </ul>
          </CardContent>

          <div className="mt-8">
            {hasPremiumPlan ? (
              <AcquirePlanButton hasPlan={true} text="Downgrade para Básico" />
            ) : (
              <Button disabled variant="outline" className="w-full rounded-sm py-5 font-bold">
                Plano Atual
              </Button>
            )}
          </div>
        </Card>

        <Card className="flex w-full max-w-146 flex-col p-8">
          <CardHeader className="relative border-b pb-6">
            <Badge className="absolute top-0 right-0 rounded-sm border border-emerald-400/12 bg-emerald-400/10 py-1 text-emerald-400">
              {hasPremiumPlan ? "Ativo" : "Recomendado"}
            </Badge>

            <div>
              <h2 className="text-xl font-bold">Plano Pro</h2>
              <p className="text-muted-foreground text-xs">
                Poder total da IA e integrações financeiras ilimitadas.
              </p>
            </div>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-extrabold">R$ 19,00</span>
              <span className="text-muted-foreground text-lg">/ mês</span>
            </div>
            <span className="text-xs text-emerald-400">
              Assinatura mensal de R$ 19,00, com todos os recursos incluídos.
            </span>
          </CardHeader>

          <CardContent className="mb-auto pt-6">
            <ul className="space-y-4">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white/88">
                  <CheckIcon className="text-primary shrink-0" size={16} />
                  <p>{feature}</p>
                </li>
              ))}
            </ul>
          </CardContent>

          <div className="mt-8">
            <AcquirePlanButton hasPlan={hasPremiumPlan} />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SubscriptionPage;
