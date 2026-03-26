import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById } from "@/lib/db";
import { getStripe, STRIPE_PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = getUserById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { plan, billing, students } = await req.json();
  const planConfig = STRIPE_PLANS[plan];
  if (!planConfig) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const isYearly = billing === "yearly";
  let amount: number;
  let productName = planConfig.name;
  let description = isYearly ? "Yearly access" : "Monthly access";
  let quantity = 1;

  if (plan === "school") {
    const numStudents = Math.max(5, parseInt(students) || 5);
    if (isYearly) {
      // $1500/yr unlimited students
      amount = 150000;
      productName = "School Plan - Unlimited Students (Yearly)";
      description = "Yearly unlimited student access";
    } else {
      // $1/student/month, min 5
      amount = 100; // $1 per student
      quantity = numStudents;
      productName = `School Plan - ${numStudents} Students`;
      description = `Monthly access for ${numStudents} students`;
    }
  } else {
    amount = isYearly ? planConfig.yearlyPrice : planConfig.monthlyPrice;
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description,
            },
            unit_amount: amount,
          },
          quantity,
        },
      ],
      metadata: {
        userId,
        plan,
        billing: isYearly ? "yearly" : "monthly",
        students: students || "0",
      },
      success_url: `${baseUrl}/payment/success?plan=${plan}&billing=${billing}`,
      cancel_url: `${baseUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
