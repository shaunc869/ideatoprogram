import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  }
  return _stripe;
}

export const STRIPE_PLANS: Record<string, {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
}> = {
  pro_python: { name: "Python Pro - 100 Lessons", monthlyPrice: 500, yearlyPrice: 5000 },
  pro_javascript: { name: "JavaScript Pro - 100 Lessons", monthlyPrice: 500, yearlyPrice: 5000 },
  pro_all: { name: "Pro All - 760+ Lessons", monthlyPrice: 1000, yearlyPrice: 10000 },
  vibe_pro: { name: "Vibe Pro - Unlimited AI", monthlyPrice: 2099, yearlyPrice: 15000 },
  school: { name: "School Plan", monthlyPrice: 100, yearlyPrice: 150000 },
  // Specialization paths
  spec_web_designer: { name: "Web Designer Path - 100 Lessons", monthlyPrice: 500, yearlyPrice: 5000 },
  spec_ai_ml: { name: "AI & ML Path - 100 Lessons", monthlyPrice: 500, yearlyPrice: 5000 },
  spec_game_dev: { name: "Game Dev Path - 100 Lessons", monthlyPrice: 500, yearlyPrice: 5000 },
  spec_data_engineer: { name: "Data Engineer Path - 100 Lessons", monthlyPrice: 500, yearlyPrice: 5000 },
  spec_mobile_dev: { name: "Mobile Dev Path - 100 Lessons", monthlyPrice: 500, yearlyPrice: 5000 },
  spec_all: { name: "All Specializations - 500 Lessons", monthlyPrice: 0, yearlyPrice: 30000 },
};
