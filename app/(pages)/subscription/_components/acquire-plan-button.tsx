"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckoutSession } from "../_actions/create-stripe-checkout";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const AcquirePlanButton = () => {
  const { user } = useUser();

  const handleAcquirePlanClick = async () => {
    const { url } = await createStripeCheckoutSession();

    if (!url) {
      throw new Error("Failed to create Stripe Checkout session");
    }

    window.location.href = url;
  };

  const hasPremiumPlan = user?.publicMetadata?.subscriptionPlan === "premium";

  if (hasPremiumPlan) {
    return (
      <Button className="w-full cursor-pointer rounded-full font-bold" variant={"link"} asChild>
        <Link
          href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string}?prefilled_email=${user?.emailAddresses?.[0]?.emailAddress}`}
        >
          Gerenciar Plano
        </Link>
      </Button>
    );
  }

  return (
    <Button
      className="w-full cursor-pointer rounded-full font-bold"
      onClick={handleAcquirePlanClick}
    >
      Assinar Plano Premium
    </Button>
  );
};

export default AcquirePlanButton;
