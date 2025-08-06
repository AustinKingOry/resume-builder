"use client"

interface UsageData {
  date: string
  count: number
  plan: "free" | "hustler" | "pro"
}

const STORAGE_KEY = "kazikit_usage_data"
const FREE_PLAN_LIMIT = 5
const HUSTLER_PLAN_LIMIT = 50
const PRO_PLAN_LIMIT = 200

export class UsageTracker {
  private static instance: UsageTracker
  private data: UsageData

  private constructor() {
    this.data = this.loadData()
  }

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker()
    }
    return UsageTracker.instance
  }

  private loadData(): UsageData {
    if (typeof window === "undefined") {
      return { date: new Date().toDateString(), count: 0, plan: "free" }
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { date: new Date().toDateString(), count: 0, plan: "free" }
    }

    try {
      const parsed = JSON.parse(stored) as UsageData
      const today = new Date().toDateString()

      // Reset count if it's a new day
      if (parsed.date !== today) {
        return { date: today, count: 0, plan: parsed.plan }
      }

      return parsed
    } catch {
      return { date: new Date().toDateString(), count: 0, plan: "free" }
    }
  }

  private saveData(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
    }
  }

  getCurrentUsage(): { count: number; limit: number; plan: string } {
    const limits = {
      free: FREE_PLAN_LIMIT,
      hustler: HUSTLER_PLAN_LIMIT,
      pro: PRO_PLAN_LIMIT,
    }

    return {
      count: this.data.count,
      limit: limits[this.data.plan],
      plan: this.data.plan,
    }
  }

  canMakeRequest(): boolean {
    const { count, limit } = this.getCurrentUsage()
    return count < limit
  }

  incrementUsage(): boolean {
    if (!this.canMakeRequest()) {
      return false
    }

    this.data.count += 1
    this.saveData()
    return true
  }

  upgradePlan(newPlan: "hustler" | "pro"): void {
    this.data.plan = newPlan
    this.saveData()
  }

  getRemainingRequests(): number {
    const { count, limit } = this.getCurrentUsage()
    return Math.max(0, limit - count)
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
}

export const usageTracker = UsageTracker.getInstance()