"use client"

import { supabase } from "../supabase-browser"
import type { Database } from "./types"

type User = Database["public"]["Tables"]["users"]["Row"]
type RoastResponse = Database["public"]["Tables"]["roast_responses"]["Row"]

export interface AnalyticsStats {
  totalCVsRoasted: number
  averageScore: number
  processingTime: number
  successRate: number
  scoreChange: string
  processingChange: string
  successRateChange: string
}

export interface RecentRoast {
  id: string
  fileName: string
  score: number
  date: string
  feedbackCount: number
  improvements: string[]
}

export interface CategoryBreakdown {
  category: string
  score: number
  count: number
}

export interface ScoreTrend {
  date: string
  score: number
  count: number
}

export interface UserBenchmark {
  userAverage: number
  platformAverage: number
  topPercentile: number
  performanceMessage: string
}

export class SupabaseAnalyticsService {
  private static instance: SupabaseAnalyticsService
  private currentUser: User | null = null

  private constructor() {
    this.initializeUser()
  }

  static getInstance(): SupabaseAnalyticsService {
    if (!SupabaseAnalyticsService.instance) {
      SupabaseAnalyticsService.instance = new SupabaseAnalyticsService()
    }
    return SupabaseAnalyticsService.instance
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

  async getAnalyticsStats(timeRange: string = "7d"): Promise<AnalyticsStats> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return {
        totalCVsRoasted: 0,
        averageScore: 0,
        processingTime: 0,
        successRate: 0,
        scoreChange: "+0%",
        processingChange: "+0s",
        successRateChange: "+0%"
      }
    }

    // Get analytics data for the specified time range
    const { data: analyticsData } = await supabase.rpc("get_user_analytics", {
      p_user_id: this.currentUser.user_id,
      p_time_range: timeRange
    })

    if (!analyticsData) {
      return {
        totalCVsRoasted: 0,
        averageScore: 0,
        processingTime: 0,
        successRate: 0,
        scoreChange: "+0%",
        processingChange: "+0s",
        successRateChange: "+0%"
      }
    }

    return {
      totalCVsRoasted: analyticsData.total_roasts || 0,
      averageScore: Math.round((analyticsData.average_score || 0) * 10) / 10,
      processingTime: Math.round((analyticsData.average_processing_time || 0) * 10) / 10,
      successRate: Math.round((analyticsData.success_rate || 0) * 100),
      scoreChange: this.formatChange(analyticsData.score_change || 0, "%"),
      processingChange: this.formatChange(analyticsData.processing_time_change || 0, "s"),
      successRateChange: this.formatChange(analyticsData.success_rate_change || 0, "%")
    }
  }

  async getRecentRoasts(limit: number = 10): Promise<RecentRoast[]> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return []
    }

    const { data: roastResponses } = await supabase
      .from("roast_responses")
      .select(`
        id,
        created_at,
        feedback_points,
        market_readiness,
        cv_upload:cv_uploads(file_name)
      `)
      .eq("user_id", this.currentUser.user_id)
      .order("created_at", { ascending: false })
      .limit(limit)

    return (roastResponses || []).map((roast: any) => {
      const feedbackPoints = roast.feedback_points || []
      const improvements = feedbackPoints
        .filter((point: any) => point.type === "improvement")
        .map((point: any) => point.text)
        .slice(0, 2)

      return {
        id: roast.id,
        fileName: roast.cv_upload?.file_name || "Unknown CV",
        score: Math.round(roast.market_readiness?.overall_score || 0),
        date: new Date(roast.created_at).toLocaleDateString(),
        feedbackCount: feedbackPoints.length,
        improvements
      }
    })
  }

  async getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return []
    }

    const { data: categoryData } = await supabase.rpc("get_category_breakdown", {
      p_user_id: this.currentUser.user_id
    })

    return (categoryData || []).map((category: any) => ({
      category: category.category_name,
      score: Math.round(category.average_score),
      count: category.feedback_count
    }))
  }

  async getScoreTrend(timeRange: string = "30d"): Promise<ScoreTrend[]> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return []
    }

    const { data: trendData } = await supabase.rpc("get_score_trend", {
      p_user_id: this.currentUser.user_id,
      p_time_range: timeRange
    })

    return (trendData || []).map((trend: any) => ({
      date: trend.date,
      score: Math.round(trend.average_score * 10) / 10,
      count: trend.roast_count
    }))
  }

  async getUserBenchmark(): Promise<UserBenchmark> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return {
        userAverage: 0,
        platformAverage: 0,
        topPercentile: 0,
        performanceMessage: "No data available"
      }
    }

    const { data: benchmarkData } = await supabase.rpc("get_user_benchmark", {
      p_user_id: this.currentUser.user_id
    })

    if (!benchmarkData) {
      return {
        userAverage: 0,
        platformAverage: 0,
        topPercentile: 0,
        performanceMessage: "No data available"
      }
    }

    const userAvg = Math.round(benchmarkData.user_average * 10) / 10
    const platformAvg = Math.round(benchmarkData.platform_average * 10) / 10
    const topPercentile = Math.round(benchmarkData.top_percentile * 10) / 10
    
    const performanceDiff = ((userAvg - platformAvg) / platformAvg * 100)
    let performanceMessage = "You're performing at platform average"
    
    if (performanceDiff > 15) {
      performanceMessage = `You're performing ${Math.round(performanceDiff)}% above average! 🎉`
    } else if (performanceDiff > 5) {
      performanceMessage = `You're performing ${Math.round(performanceDiff)}% above average`
    } else if (performanceDiff < -15) {
      performanceMessage = `Room for improvement - ${Math.abs(Math.round(performanceDiff))}% below average`
    } else if (performanceDiff < -5) {
      performanceMessage = `Slightly below average by ${Math.abs(Math.round(performanceDiff))}%`
    }

    return {
      userAverage: userAvg,
      platformAverage: platformAvg,
      topPercentile: topPercentile,
      performanceMessage
    }
  }

  async getKeyAchievements(): Promise<string[]> {
    if (!this.currentUser) {
      await this.initializeUser()
    }

    if (!this.currentUser) {
      return []
    }

    const achievements: string[] = []

    // Get user stats
    const { data: userStats } = await supabase.rpc("get_user_stats", {
      p_user_id: this.currentUser.user_id
    })

    if (userStats) {
      // Score improvement achievement
      if (userStats.score_trend > 20) {
        achievements.push(`Improved CV scores by ${Math.round(userStats.score_trend)}% this month`)
      }

      // High performance achievement
      if (userStats.average_score > 85) {
        achievements.push("Consistently scoring above 85/100")
      }

      // Speed achievement
      if (userStats.average_processing_time < 2.5) {
        achievements.push("Fastest processing times in your plan")
      }

      // Volume achievement
      if (userStats.total_roasts > 20) {
        achievements.push(`Completed ${userStats.total_roasts} CV analyses`)
      }
    }

    return achievements.slice(0, 3)
  }

  private formatChange(value: number, unit: string): string {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${Math.round(value * 10) / 10}${unit}`
  }
}

export const supabaseAnalyticsService = SupabaseAnalyticsService.getInstance()
