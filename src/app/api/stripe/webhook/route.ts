import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { subscribe } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // If webhook secret is set, verify signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // In development without webhook secret, parse directly
      event = JSON.parse(body);
    }
  } catch (err: unknown) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, plan, billing } = session.metadata || {};

    if (userId && plan) {
      // Activate the subscription
      subscribe(userId, plan, billing || "monthly");
      console.log(`Subscription activated: user=${userId} plan=${plan} billing=${billing}`);
    }
  }

  return NextResponse.json({ received: true });
}
