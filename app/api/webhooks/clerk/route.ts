import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { MAX_USERS } from "@/app/_constants/auth";

export async function POST(request: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SIGNING_SECRET environment variable");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: { type: string; data: { id: string } };

  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as unknown as typeof event;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error(`Clerk webhook verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "user.created") {
    return NextResponse.json({ received: true });
  }

  try {
    const clerk = await clerkClient();
    const userCount = await clerk.users.getCount();

    if (userCount > MAX_USERS) {
      await clerk.users.deleteUser(event.data.id);
      console.warn(
        `User limit reached (${MAX_USERS}). Deleted new user ${event.data.id} created during sign-up.`
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing clerk webhook:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
