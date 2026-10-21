"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/app/_lib/utils";
import { createStripeCheckoutSession } from "../_actions/create-stripe-checkout";

type AcquirePlanButtonProps = {
  hasPlan: boolean;
  text?: string;
};

const AcquirePlanButton = ({ hasPlan, text }: AcquirePlanButtonProps) => {
  const { user, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();

  const handleAcquirePlanClick = () => {
    startTransition(async () => {
      try {
        const { url } = await createStripeCheckoutSession();

        if (!url) {
          throw new Error("URL de checkout não retornada pelo Stripe.");
        }

        window.location.assign(url);
      } catch (error) {
        console.error("Erro ao iniciar checkout do Stripe:", error);
      }
    });
  };

  if (hasPlan) {
    const portalBaseUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL ?? "";
    const userEmail =
      user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress;

    const portalUrl = userEmail
      ? `${portalBaseUrl}?prefilled_email=${encodeURIComponent(userEmail)}`
      : portalBaseUrl;

    return (
      <Button
        asChild
        variant="default"
        disabled={!isLoaded}
        className={cn(
          "border-muted-foreground/16 bg-primary hover:text-background w-full cursor-pointer rounded-sm border py-5 font-bold transition-colors duration-200",
          text && "bg-background/40 text-foreground/80"
        )}
      >
        <Link href={portalUrl}>{text ?? "Gerenciar Plano"}</Link>
      </Button>
    );
  }

  return (
    <Button
      className="w-full cursor-pointer rounded-sm font-bold"
      onClick={handleAcquirePlanClick}
      disabled={isPending || !isLoaded}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecionando...
        </>
      ) : (
        "Assinar Plano Premium"
      )}
    </Button>
  );
};

export default AcquirePlanButton;
