"use client"


// import { supabase } from "@/lib/supabase-server"
import type { Database } from ".././types"
import { createClient } from "@supabase/supabase-js"

type PaymentTransaction = Database["public"]["Tables"]["payment_transactions"]["Row"]

function getSupabaseClientWithToken(token: string) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export class SupabasePaymentService {
  async createPaymentTransaction(
    token: string,
    userId: string,
    plan: "hustler" | "pro",
    amountKsh: number,
    paymentMethod: string,
    paymentProvider: string,
    metadata?: any,
  ): Promise<PaymentTransaction | null> {
    const supabase = getSupabaseClientWithToken(token)
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
    token: string,
    transactionId: string,
    status: "completed" | "failed" | "cancelled",
    transactionReference?: string,
    metadata?: any,
  ): Promise<boolean> {
    const supabase = getSupabaseClientWithToken(token)
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

  async getUserPaymentHistory(token: string, userId: string, limit = 10): Promise<PaymentTransaction[]> {
    const supabase = getSupabaseClientWithToken(token)
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

  async getPaymentTransaction(token: string, transactionId: string): Promise<PaymentTransaction | null> {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase.from("payment_transactions").select("*").eq("id", transactionId).single()

    if (error) {
      console.error("Error fetching payment transaction:", error)
      return null
    }

    return data
  }

  // Simulate payment processing (replace with actual payment provider integration)
  async processPayment(
    token: string,
    transactionId: string,
    paymentMethod: string,
    paymentDetails: any,
  ): Promise<{ success: boolean; reference?: string; error?: string }> {
    const supabase = getSupabaseClientWithToken(token)
    // This is a simulation - replace with actual payment provider logic
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate success/failure
    const success = Math.random() > 0.1 // 90% success rate

    if (success) {
      const reference = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await this.updatePaymentStatus(token, transactionId, "completed", reference)
      return { success: true, reference }
    } else {
      await this.updatePaymentStatus(token, transactionId, "failed", undefined, { error: "Payment failed" })
      return { success: false, error: "Payment processing failed" }
    }
  }

  // Real-time subscription for payment status updates
  subscribeToPaymentUpdates(token: string, userId: string, callback: (transaction: PaymentTransaction) => void) {
    const supabase = getSupabaseClientWithToken(token)
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
