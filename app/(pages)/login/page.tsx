import Image from "next/image";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { redirectIfAuthenticated } from "@/app/_lib/auth";
import { MAX_USERS } from "@/app/_constants/auth";
import { Button } from "@/app/_components/ui/button";

const LoginPage = async () => {
  await redirectIfAuthenticated();

  const clerk = await clerkClient();
  const userCount = await clerk.users.getCount();
  const isUserLimitReached = userCount >= MAX_USERS;

  return (
    <section className="grid h-full w-full grid-cols-2">
      <div className="m-auto flex max-w-145 flex-col justify-center p-8">
        <Image src="/logo.svg" alt="FinAi" width={176} height={40} className="mb-4" />

        <h1 className="mb-3 text-4xl font-bold">Bem-vindo</h1>
        <p className="text-muted-foreground mb-8">
          A FinAi é uma plataforma inteligente de gestão financeira que utiliza IA para acompanhar
          suas movimentações e fornecer insights personalizados, simplificando o controle do seu
          orçamento e ajudando você a tomar decisões financeiras mais informadas.
        </p>

        {isUserLimitReached ? (
          <p className="text-muted-foreground rounded-[20px] border border-dashed p-6 text-center">
            O ambiente de testes atingiu o limite de {MAX_USERS.toLocaleString("pt-BR")} usuários e
            novos cadastros estão temporariamente indisponíveis.
          </p>
        ) : (
          <SignInButton>
            <Button variant="secondary" className="cursor-pointer rounded-[20px] p-6">
              <LogInIcon className="mr-2" />
              Fazer o login ou criar conta
            </Button>
          </SignInButton>
        )}
      </div>

      <div className="relative h-full w-full">
        <Image src="/login.jpg" alt="Faça o Login" fill className="object-cover" />
      </div>
    </section>
  );
};

export default LoginPage;
