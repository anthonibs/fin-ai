"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckoutSession = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured");
  }

  if (!process.env.STRIPE_PLAN_PRO_PRICE_ID) {
    throw new Error("Stripe price ID is not configured");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-09-30.endive",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
    metadata: {
      clerk_user_id: userId,
    },
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
    line_items: [
      {
        price: process.env.STRIPE_PLAN_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
  });

  return {
    url: session.url,
  };
};
