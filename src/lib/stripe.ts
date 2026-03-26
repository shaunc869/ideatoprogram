import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

// Map our plan IDs to Stripe price config
export const STRIPE_PLANS: Record<string, {
  name: string;
  monthlyPrice: number; // in cents
  yearlyPrice: number;  // in cents
  monthlyPriceId?: string; // Set these after creating products in Stripe
  yearlyPriceId?: string;
}> = {
  pro_python: { name: "Python Pro", monthlyPrice: 500, yearlyPrice: 5000 },
  pro_javascript: { name: "JavaScript Pro", monthlyPrice: 500, yearlyPrice: 5000 },
  pro_all: { name: "Pro All (210 Lessons)", monthlyPrice: 1000, yearlyPrice: 10000 },
  vibe_pro: { name: "Vibe Pro (Unlimited AI)", monthlyPrice: 1500, yearlyPrice: 15000 },
};
