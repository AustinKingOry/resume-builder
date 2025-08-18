/**
 * Service layer for handling subscription logic in KaziKit.
 */

import { createClient } from "@supabase/supabase-js";
import type { PostgrestError } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type SubscriptionPlan = "Free" | "Hustler" | "Pro";
export type PaymentMethod = "mpesa" | "card" | "paypal";

export interface SubscriptionResult {
  success: boolean;
  data?: any;
  error?: PostgrestError | string;
}

class SubscriptionService {
  /**
   * Get available subscription plans
   */
  async getPlans(): Promise<SubscriptionResult> {
    const { data, error } = await supabase.from("subscription_plans").select("*");
    if (error) return { success: false, error };
    return { success: true, data };
  }

  /**
   * Get user’s active subscription
   */
  async getUserSubscription(userId: string): Promise<SubscriptionResult> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*, subscription_plans(*)")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) return { success: false, error };
    return { success: true, data };
  }

  /**
   * Create a new subscription (after payment confirmation)
   */
  async createSubscription(
    userId: string,
    planId: string,
    method: PaymentMethod,
    transactionId: string
  ): Promise<SubscriptionResult> {
    const { data, error } = await supabase.from("subscriptions").insert([
      {
        user_id: userId,
        plan_id: planId,
        payment_method: method,
        transaction_id: transactionId,
        status: "active",
        start_date: new Date().toISOString(),
      },
    ]);

    if (error) return { success: false, error };
    return { success: true, data };
  }

  /**
   * Cancel user’s subscription
   */
  async cancelSubscription(userId: string): Promise<SubscriptionResult> {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({ status: "canceled", end_date: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) return { success: false, error };
    return { success: true, data };
  }

  /**
   * Record a payment transaction
   */
  async recordTransaction(
    userId: string,
    amount: number,
    currency: string,
    method: PaymentMethod,
    status: "pending" | "success" | "failed",
    transactionRef: string
  ): Promise<SubscriptionResult> {
    const { data, error } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        amount,
        currency,
        method,
        status,
        transaction_ref: transactionRef,
      },
    ]);

    if (error) return { success: false, error };
    return { success: true, data };
  }
}

export const subscriptionService = new SubscriptionService();
