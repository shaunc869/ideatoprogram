import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById } from "@/lib/db";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = getUserById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { plan, billing } = await req.json();
  const planConfig = STRIPE_PLANS[plan];
  if (!planConfig) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const isYearly = billing === "yearly";
  const amount = isYearly ? planConfig.yearlyPrice : planConfig.monthlyPrice;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planConfig.name,
              description: isYearly ? "Yearly access" : "Monthly access",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        plan,
        billing: isYearly ? "yearly" : "monthly",
      },
      success_url: `${baseUrl}/payment/success?plan=${plan}&billing=${billing}`,
      cancel_url: `${baseUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
