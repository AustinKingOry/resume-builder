"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  supabaseAnalyticsService, 
  type AnalyticsStats, 
  type RecentRoast, 
  type CategoryBreakdown,
  type UserBenchmark
} from "@/lib/supabase/analytics-service"
import { BarChart3, TrendingUp, Calendar, Target, ChevronRight, Download, Clock, Award, Users, FileText, Loader2 } from 'lucide-react'
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function AnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [timeRange, setTimeRange] = useState("7d")
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [recentRoasts, setRecentRoasts] = useState<RecentRoast[]>([])
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([])
  const [userBenchmark, setUserBenchmark] = useState<UserBenchmark | null>(null)
  const [keyAchievements, setKeyAchievements] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" },
  ]

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true)
        
        const [analyticsStats, roasts, categories, benchmark, achievements] = await Promise.all([
          supabaseAnalyticsService.getAnalyticsStats(timeRange),
          supabaseAnalyticsService.getRecentRoasts(10),
          supabaseAnalyticsService.getCategoryBreakdown(),
          supabaseAnalyticsService.getUserBenchmark(),
          supabaseAnalyticsService.getKeyAchievements()
        ])

        setStats(analyticsStats)
        setRecentRoasts(roasts)
        setCategoryBreakdown(categories)
        setUserBenchmark(benchmark)
        setKeyAchievements(achievements)
      } catch (error) {
        console.error("Error loading analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalyticsData()
  }, [timeRange])

  if (loading || !stats) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-emerald-50/50 to-blue-50/30 dark:from-emerald-950/50 dark:to-blue-950/30">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  const analyticsStatsCards = [
    {
      title: "Total CVs Roasted",
      value: stats.totalCVsRoasted.toString(),
      change: `+${stats.totalCVsRoasted}`,
      trend: "up",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}/10`,
      change: stats.scoreChange,
      trend: "up",
      icon: Target,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Processing Time",
      value: `${stats.processingTime}s`,
      change: stats.processingChange,
      trend: "up",
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: stats.successRateChange,
      trend: "up",
      icon: Award,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50/50 to-blue-50/30 dark:from-emerald-950/50 dark:to-blue-950/30">
      {/* <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} /> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 dark:bg-black/90 dark:border-gray-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex justify-start gap-2 items-center">
              <SidebarTrigger />
              <div>
                {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 dark:text-gray-400">
                  <span>Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-emerald-600 font-medium dark:text-emerald-400">Analytics</span>
                </div> */}
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 dark:text-gray-100">
                  <BarChart3 className="w-6 h-6" />
                  CV Analytics Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {timeRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range.value)}
                    className="text-xs"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsStatsCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Score Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Score Trend Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg dark:bg-gray-950">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2 dark:text-gray-600" />
                      <p className="text-gray-600 dark:text-gray-400">Chart visualization would go here</p>
                      <p className="text-sm text-gray-500">
                        Showing improvement trend: {stats.scoreChange}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Performance by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryBreakdown.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No category data available</p>
                        <p className="text-sm">Complete more CV analyses to see breakdown</p>
                      </div>
                    ) : (
                      categoryBreakdown.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{category.category}</span>
                            <span className="text-gray-600 dark:text-gray-400">{category.score}/100</span>
                          </div>
                          <Progress value={category.score} className="h-2" />
                          <p className="text-xs text-gray-500">{category.count} feedback points</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent CV Roasts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRoasts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent roasts</p>
                      <p className="text-sm">Upload a CV to get started!</p>
                    </div>
                  ) : (
                    recentRoasts.map((roast, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-950">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center dark:bg-emerald-900">
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{roast.fileName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {roast.date} • {roast.feedbackCount} feedback points
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">
                            {roast.score}/100
                          </Badge>
                          <div className="space-y-1">
                            {roast.improvements.map((improvement, i) => (
                              <p key={i} className="text-xs text-gray-600 dark:text-gray-400">
                                • {improvement}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/30 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="text-emerald-800 flex items-center gap-2 dark:text-emerald-200">
                    <Award className="w-5 h-5" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {keyAchievements.length === 0 ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Complete more CV analyses to unlock achievements</p>
                    ) : (
                      keyAchievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/30 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2 dark:text-blue-200">
                    <Users className="w-5 h-5" />
                    Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBenchmark ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Your average score</span>
                        <span className="font-semibold">{userBenchmark.userAverage}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Platform average</span>
                        <span className="font-semibold">{userBenchmark.platformAverage}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Top 10% threshold</span>
                        <span className="font-semibold">{userBenchmark.topPercentile}/10</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-blue-600 dark:text-blue-400">{userBenchmark.performanceMessage}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Complete more CV analyses to see benchmarks</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
