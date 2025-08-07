"use client"

import { supabase } from "../supabase-browser"
import type { Database } from "./types"

type User = Database["public"]["Tables"]["users"]["Row"]
type CVUpload = Database["public"]["Tables"]["cv_uploads"]["Row"]
type RoastResponse = Database["public"]["Tables"]["roast_responses"]["Row"]
type UsageTracking = Database["public"]["Tables"]["usage_tracking"]["Row"]

export interface DashboardStats {
  totalCVsRoasted: number
  averageScore: number
  processingTime: number
  successRate: number
  usageCount: number
  usageLimit: number
  plan: string
  resetTime: string
}

export interface RecentActivity {
  id: string
  action: string
  fileName: string
  score?: number
  time: string
  status: "completed" | "success" | "failed"
  type: "roast" | "upgrade" | "payment"
}

export interface CareerInsight {
  type: "improvement" | "achievement" | "suggestion"
  message: string
  color: string
}

export class SupabaseDashboardService {
  private static instance: SupabaseDashboardService
  private currentUser: User | null = null

  private constructor() {
    this.initializeUser()
  }

  static getInstance(): SupabaseDashboardService {
    if (!SupabaseDashboardService.instance) {
      SupabaseDashboardService.instance = new SupabaseDashboardService()
    }
    return SupabaseDashboardService.instance
  }

  private async initializeUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: userData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
      
      this.currentUser = userData
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return {
        totalCVsRoasted: 0,
        averageScore: 0,
        processingTime: 0,
        successRate: 0,
        usageCount: 0,
        usageLimit: 5,
        plan: "free",
        resetTime: "24h 0m"
      }
    }

    // Get user stats using the database function
    const { data: userStats } = await supabase.rpc("get_user_stats", {
      p_user_id: this.currentUser.user_id
    })

    // Get current usage
    const { data: usage } = await supabase.rpc("get_or_create_usage_tracking", {
      p_user_id: this.currentUser.user_id
    })

    const planLimits = {
      free: 5,
      hustler: 50,
      pro: 200,
    }

    const plan = this.currentUser.plan
    const limit = planLimits[plan] || 5
    const usageCount = usage?.roast_count || 0

    // Calculate reset time
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const now = new Date()
    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const resetTime = `${hours}h ${minutes}m`

    return {
      totalCVsRoasted: userStats?.total_roasts || 0,
      averageScore: (userStats?.average_score || 0) / 10,
      processingTime: userStats?.average_processing_time || 0,
      successRate: userStats?.success_rate || 0,
      usageCount,
      usageLimit: limit,
      plan,
      resetTime
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return []
    }

    const activities: RecentActivity[] = []

    // Get recent roast responses
    const { data: roastResponses } = await supabase
      .from("roast_responses")
      .select(`
        id,
        created_at,
        market_readiness,
        cv_upload:cv_uploads(file_name)
      `)
      .eq("user_id", this.currentUser.user_id)
      .order("created_at", { ascending: false })
      .limit(5)

    roastResponses?.forEach((roast: any) => {
      const score = roast.market_readiness?.overall_score || 0
      activities.push({
        id: roast.id,
        action: "CV Roasted",
        fileName: roast.cv_upload?.file_name || "Unknown CV",
        score: Math.round(score),
        time: this.formatTimeAgo(roast.created_at),
        status: "completed",
        type: "roast"
      })
    })

    // Get recent payment transactions
    const { data: payments } = await supabase
      .from("payment_transactions")
      .select("id, created_at, plan, status")
      .eq("user_id", this.currentUser.user_id)
      .order("created_at", { ascending: false })
      .limit(3)

    payments?.forEach((payment) => {
      if (payment.status === "completed") {
        activities.push({
          id: payment.id,
          action: "Plan Upgraded",
          fileName: `${payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)} Plan`,
          time: this.formatTimeAgo(payment.created_at),
          status: "success",
          type: "upgrade"
        })
      }
    })

    // Sort by time and return top 10
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10)
  }

  async getCareerInsights(): Promise<CareerInsight[]> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return []
    }

    const insights: CareerInsight[] = []

    // Get user stats for insights
    const { data: userStats } = await supabase.rpc("get_user_stats", {
      p_user_id: this.currentUser.user_id
    })

    if (userStats) {
      // Score improvement insight
      if (userStats.score_trend > 0) {
        insights.push({
          type: "improvement",
          message: `Your CV scores are improving by ${Math.round(userStats.score_trend)}% weekly`,
          color: "bg-blue-500"
        })
      }

      // High performance insight
      if (userStats.average_score > 85) {
        insights.push({
          type: "achievement",
          message: "Consistently scoring above 85/100",
          color: "bg-emerald-500"
        })
      }

      // Processing time insight
      if (userStats.average_processing_time < 3) {
        insights.push({
          type: "achievement",
          message: "Fastest processing times in your plan",
          color: "bg-purple-500"
        })
      }

      // Suggestion based on feedback patterns
      const { data: recentFeedback } = await supabase
        .from("roast_responses")
        .select("feedback_points")
        .eq("user_id", this.currentUser.user_id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (recentFeedback && recentFeedback.length > 0) {
        // Analyze common feedback themes
        const commonIssues = this.analyzeCommonFeedback(recentFeedback)
        if (commonIssues.length > 0) {
          insights.push({
            type: "suggestion",
            message: `Consider focusing on: ${commonIssues[0]}`,
            color: "bg-yellow-500"
          })
        }
      }
    }

    return insights.slice(0, 3) // Return top 3 insights
  }

  async getCommunityStats(): Promise<{
    cvsRoastedToday: number
    activeUsers: number
    successStories: number
  }> {
    // Get community-wide stats
    const { data: communityStats } = await supabase.rpc("get_community_stats")

    return {
      cvsRoastedToday: communityStats?.daily_roasts || 0,
      activeUsers: communityStats?.active_users || 0,
      successStories: communityStats?.success_stories || 0
    }
  }

  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  private analyzeCommonFeedback(feedbackData: any[]): string[] {
    const issues: { [key: string]: number } = {}
    
    feedbackData.forEach(item => {
      if (item.feedback_points && Array.isArray(item.feedback_points)) {
        item.feedback_points.forEach((point: any) => {
          if (point.category) {
            issues[point.category] = (issues[point.category] || 0) + 1
          }
        })
      }
    })

    return Object.entries(issues)
      .sort(([,a], [,b]) => b - a)
      .map(([category]) => category)
  }
}

export const supabaseDashboardService = SupabaseDashboardService.getInstance()
