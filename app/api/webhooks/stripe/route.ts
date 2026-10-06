import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-09-30.endive",
});

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

  const rawSubscription = invoice.parent?.subscription_details?.subscription;
  const subscriptionId =
    typeof rawSubscription === "string" ? rawSubscription : rawSubscription?.id;

  if (!customerId || !subscriptionId) {
    console.warn("Skipping invoice.paid: Missing customer or subscription ID", {
      customerId,
      subscriptionId,
    });
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const clerkUserId = subscription.metadata?.clerk_user_id;

  if (!clerkUserId) {
    console.warn("Skipping invoice.paid: clerk_user_id not found in subscription metadata", {
      subscriptionId,
    });
    return;
  }

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(clerkUserId, {
    privateMetadata: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
    publicMetadata: {
      subscriptionPlan: "premium",
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;

  const subscriptionId = subscription.id;
  const clerkUserId = subscription.metadata?.clerk_user_id;

  if (!clerkUserId) {
    console.warn("Skipping customer.subscription.deleted: clerk_user_id missing in metadata", {
      customerId,
      subscriptionId,
    });
    return;
  }

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(clerkUserId, {
    privateMetadata: {
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    },
    publicMetadata: {
      subscriptionPlan: null,
    },
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || !webhookSecret) {
    console.error("Missing Stripe environment variables");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Error processing event ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
