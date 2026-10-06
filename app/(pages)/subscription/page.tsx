import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import Navbar from "@/app/_components/shared/navbar";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "@/app/_components/ui/badge";

const SubscriptionPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const hasPremiumPlan = user?.publicMetadata?.subscriptionPlan === "premium";

  return (
    <>
      <Navbar />

      <section className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Assinatura</h1>

        <div className="flex gap-6">
          <Card className="w-112.5">
            <CardHeader className="relative justify-center border-b py-8">
              {!hasPremiumPlan && (
                <Badge className="bg-primary/10 text-primary absolute top-4 left-4 rounded-full">
                  Atual
                </Badge>
              )}

              <h2 className="text-center text-2xl font-semibold">Plano Básico</h2>

              <div className="flex items-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-4xl">0,00</span>
                <span className="text-4xl">/ mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 py-8">
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Apenas 10 transações por mês (7/10)</p>
              </div>
              <div className="flex items-center gap-3">
                <XIcon />
                <p>Relatório com IA indisponível.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-112.5">
            <CardHeader className="relative justify-center border-b py-8">
              {hasPremiumPlan && (
                <Badge className="bg-primary/10 text-primary absolute top-4 left-4 rounded-full">
                  Atual
                </Badge>
              )}
              <h2 className="text-center text-2xl font-semibold">Plano Premium</h2>

              <div className="flex items-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-4xl">19,00</span>
                <span className="text-4xl">/ mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 py-8">
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Transações ilimitadas por mês</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Relatório com IA disponível.</p>
              </div>

              <AcquirePlanButton />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default SubscriptionPage;
