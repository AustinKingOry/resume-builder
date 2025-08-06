

import { supabase } from "../supabase-browser"
import type { Database } from "./types"

type UsageTracking = Database["public"]["Tables"]["usage_tracking"]["Row"]
type User = Database["public"]["Tables"]["users"]["Row"]

export class SupabaseUsageService {
  private static instance: SupabaseUsageService
  private currentUser: User | null = null

  private constructor() {
    this.initializeUser()
  }

  static getInstance(): SupabaseUsageService {
    if (!SupabaseUsageService.instance) {
      SupabaseUsageService.instance = new SupabaseUsageService()
    }
    return SupabaseUsageService.instance
  }

  private async initializeUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: userData } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

      this.currentUser = userData
    }
  }

  async getCurrentUsage(): Promise<{ count: number; limit: number; plan: string }> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return { count: 0, limit: 5, plan: "free" }
    }

    // Get today's usage using the database function
    const { data: usage } = await supabase.rpc("get_or_create_usage_tracking", { p_user_id: this.currentUser.user_id })

    const planLimits = {
      free: 5,
      hustler: 50,
      pro: 200,
    }

    const plan = this.currentUser.plan
    const limit = planLimits[plan] || 5
    const count = usage?.roast_count || 0

    return { count, limit, plan }
  }

  async canMakeRequest(): Promise<boolean> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return false
    }

    const { data } = await supabase.rpc("can_make_request", { p_user_id: this.currentUser.user_id })

    return data || false
  }

  async incrementUsage(): Promise<boolean> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return false
    }

    const { data } = await supabase.rpc("increment_usage_count", { p_user_id: this.currentUser.id })

    return data || false
  }

  async upgradePlan(newPlan: "hustler" | "pro", transactionId?: string): Promise<boolean> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return false
    }

    const { data } = await supabase.rpc("upgrade_user_plan", {
      p_user_id: this.currentUser.user_id,
      p_new_plan: newPlan,
      p_transaction_id: transactionId,
    })

    if (data) {
      // Update local user data
      this.currentUser.plan = newPlan
    }

    return data || false
  }

  async getRemainingRequests(): Promise<number> {
    const usage = await this.getCurrentUsage()
    return Math.max(0, usage.limit - usage.count)
  }

  getResetTime(): string {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const now = new Date()
    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  async getUserStats(): Promise<any> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return null
    }

    const { data } = await supabase.rpc("get_user_stats", { p_user_id: this.currentUser.user_id })

    return data
  }

  // Real-time subscription for usage updates
  subscribeToUsageUpdates(callback: (usage: UsageTracking) => void) {
    if (!this.currentUser) return null

    return supabase
      .channel("usage_tracking_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usage_tracking",
          filter: `user_id=eq.${this.currentUser.user_id}`,
        },
        (payload) => {
          callback(payload.new as UsageTracking)
        },
      )
      .subscribe()
  }
}

export const supabaseUsageService = SupabaseUsageService.getInstance()
