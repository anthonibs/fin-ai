import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const LoginPage = async () => {
  const { userId } = await auth();

  if (userId) {
    return redirect("/");
  }

  return (
    <section className="grid h-full w-full grid-cols-2">
      <div className="m-auto flex max-w-[580px] flex-col justify-center p-8">
        <Image src="/logo.svg" alt="FinAi" width={176} height={40} className="mb-4" />

        <h1 className="mb-3 text-4xl font-bold">Bem-vindo</h1>
        <p className="text-muted-foreground mb-8">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para monitorar suas
          movimentações, e oferecer insights personalizados, facilitando o controle do seu
          orçamento.
        </p>

        <SignInButton>
          <Button variant="secondary" className="rounded-[20px] p-6">
            <LogInIcon className="mr-2" />
            Fazer o login ou criar conta
          </Button>
        </SignInButton>
      </div>

      <div className="relative h-full w-full">
        <Image src="/login.jpg" alt="Faça o Login" fill className="object-cover" />
      </div>
    </section>
  );
};

export default LoginPage;
