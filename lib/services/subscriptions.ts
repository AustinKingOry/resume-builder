// subscriptions.service.ts


import { createClient } from "@supabase/supabase-js";
import type { PostgrestError } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type SubscriptionPlan = "Free" | "Hustler" | "Pro";
export type PaymentMethod = "mpesa" | "card" | "paypal";
export type SubscriptionStatus = "active" | "cancelled" | "pending";

interface SubscriptionPayload {
    userId: string;
    planId: string;
    paymentMethod: PaymentMethod;
    amount: number;
    currency?: string;
    transactionId?: string; // reference for Mpesa/Stripe/PayPal
  }
/**
 * Fetch all available subscription plans
 */
export async function getPlans() {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("price", { ascending: true });

  if (error) throw error;
  return data;
}
/**
 * Check if user has an active subscription
 */
export async function getActiveSubscription(userId: string) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, subscription_plans(name, price)")
    .eq("user_id", userId)
    .eq("status", "active")
    .gte("end_date", now)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Get the active subscription for a given user
 */
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, subscription_plans(*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error && error.code !== "PGRST116") throw error; // ignore no rows found
  return data || null;
}

/**
 * Start a subscription (default = M-Pesa payment flow)
 */
export async function startSubscription(payload: SubscriptionPayload) {
    const { userId, planId, paymentMethod = "mpesa", amount, currency = "KSH", transactionId } = payload;
  // Generate subscription id
  const subscriptionId = uuidv4();

  // Insert into subscriptions table (status = pending until confirmed by payment)
  const { data, error } = await supabase.from("subscriptions").insert([
    {
      user_id: userId,
      plan_id: planId,
      status: "pending",
      payment_method: paymentMethod,
      start_date: new Date().toISOString(),
      end_date: null, // updated after payment success
    },
  ]).select().single();

  if (error) throw error;

  // Create initial transaction record
  await supabase.from("transactions").insert([
    {
      subscription_id: data.id,
      amount: 0,
      currency: "KES",
      payment_method: paymentMethod,
      status: "initiated",
    },
  ]);

  return { subscriptionId };
}

/**
 * Mark subscription as paid (to be used after payment gateway/webhook confirms)
 */
export async function confirmPayment(
  subscriptionId: string,
  amount: number,
  transactionId: string
) {
  // Update subscription
  const { error: subError } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    })
    .eq("id", subscriptionId);

  if (subError) throw subError;

  // Update transaction
  const { error: txnError } = await supabase
    .from("transactions")
    .update({
      amount,
      status: "successful",
      external_reference: transactionId,
    })
    .eq("subscription_id", subscriptionId);

  if (txnError) throw txnError;

  return true;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("id", subscriptionId);

  if (error) throw error;
  return true;
}

/**
 * Utility: Upgrade/Downgrade subscription
 */
export async function changePlan(userId: string, newPlanId: string) {
    // Cancel current subscription
    const current = await getActiveSubscription(userId);
    if (current) {
      await cancelSubscription(current.id);
    }
  
    // Create new subscription
    return await startSubscription({
      userId,
      planId: newPlanId,
      paymentMethod: "mpesa", // default
      amount: 0, // fetch real price from plans table
    });
}

/**
 * Check if a user has an active subscription
 */
export async function isActiveSubscriber(userId: string) {
  const subscription = await getUserSubscription(userId);
  return subscription !== null && subscription.status === "active";
}
