"use client"


import { supabase } from "@/lib/supabase-server"
import type { Database } from ".././types"

type PaymentTransaction = Database["public"]["Tables"]["payment_transactions"]["Row"]

export class SupabasePaymentService {
  async createPaymentTransaction(
    userId: string,
    plan: "hustler" | "pro",
    amountKsh: number,
    paymentMethod: string,
    paymentProvider: string,
    metadata?: any,
  ): Promise<PaymentTransaction | null> {
    const { data, error } = await supabase
      .from("payment_transactions")
      .insert({
        user_id: userId,
        plan,
        amount_ksh: amountKsh,
        payment_method: paymentMethod,
        payment_provider: paymentProvider,
        status: "pending",
        metadata,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating payment transaction:", error)
      return null
    }

    return data
  }

  async updatePaymentStatus(
    transactionId: string,
    status: "completed" | "failed" | "cancelled",
    transactionReference?: string,
    metadata?: any,
  ): Promise<boolean> {
    const updateData: any = { status }

    if (transactionReference) {
      updateData.transaction_reference = transactionReference
    }

    if (metadata) {
      updateData.metadata = metadata
    }

    const { error } = await supabase.from("payment_transactions").update(updateData).eq("id", transactionId)

    if (error) {
      console.error("Error updating payment status:", error)
      return false
    }

    return true
  }

  async getUserPaymentHistory(userId: string, limit = 10): Promise<PaymentTransaction[]> {
    const { data, error } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching payment history:", error)
      return []
    }

    return data || []
  }

  async getPaymentTransaction(transactionId: string): Promise<PaymentTransaction | null> {
    const { data, error } = await supabase.from("payment_transactions").select("*").eq("id", transactionId).single()

    if (error) {
      console.error("Error fetching payment transaction:", error)
      return null
    }

    return data
  }

  // Simulate payment processing (replace with actual payment provider integration)
  async processPayment(
    transactionId: string,
    paymentMethod: string,
    paymentDetails: any,
  ): Promise<{ success: boolean; reference?: string; error?: string }> {
    // This is a simulation - replace with actual payment provider logic
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate success/failure
    const success = Math.random() > 0.1 // 90% success rate

    if (success) {
      const reference = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await this.updatePaymentStatus(transactionId, "completed", reference)
      return { success: true, reference }
    } else {
      await this.updatePaymentStatus(transactionId, "failed", undefined, { error: "Payment failed" })
      return { success: false, error: "Payment processing failed" }
    }
  }

  // Real-time subscription for payment status updates
  subscribeToPaymentUpdates(userId: string, callback: (transaction: PaymentTransaction) => void) {
    return supabase
      .channel("payment_transactions_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payment_transactions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as PaymentTransaction)
        },
      )
      .subscribe()
  }
}

export const supabasePaymentService = new SupabasePaymentService()
