/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabaseDashboardService, type DashboardStats, type RecentActivity, type CareerInsight } from "@/lib/supabase/dashboard-service"
import { BarChart3, FileText, Flame, TrendingUp, Clock, Target, Zap, Crown, Calendar, Award, Users, Loader2 } from 'lucide-react'
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [careerInsights, setCareerInsights] = useState<CareerInsight[]>([])
  const [communityStats, setCommunityStats] = useState({
    cvsRoastedToday: 0,
    activeUsers: 0,
    successStories: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        const [dashboardStats, activity, insights, community] = await Promise.all([
          supabaseDashboardService.getDashboardStats(),
          supabaseDashboardService.getRecentActivity(),
          supabaseDashboardService.getCareerInsights(),
          supabaseDashboardService.getCommunityStats()
        ])

        setStats(dashboardStats)
        setRecentActivity(activity)
        setCareerInsights(insights)
        setCommunityStats(community)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()

    // Update stats every minute
    const interval = setInterval(loadDashboardData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats || !stats) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-emerald-50/50 to-blue-50/30 dark:from-emerald-950/50 dark:to-blue-950/30">
        {/* <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} /> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const planIcons = {
    free: FileText,
    hustler: Zap,
    pro: Crown,
  }

  const PlanIcon = planIcons[stats.plan as keyof typeof planIcons]
  const usagePercentage = (stats.usageCount / stats.usageLimit) * 100

  const dashboardStatsCards = [
    {
      title: "CVs Roasted Today",
      value: stats.usageCount,
      max: stats.usageLimit,
      icon: Flame,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Success Rate",
      value: `${Math.round(stats.successRate)}%`,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Avg. Processing Time",
      value: `${stats.processingTime.toFixed(1)}s`,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore.toFixed(1)}/10`,
      icon: Target,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ]

  return (
        <main className="overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Usage Card */}
            <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 dark:border-emerald-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Daily Usage</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.usageCount} of {stats.usageLimit} roasts used today
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resets in</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.resetTime}</p>
                  </div>
                </div>
                <Progress value={usagePercentage} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>0</span>
                  <span>{stats.usageLimit}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStatsCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {typeof stat.value === "number" && stat.max ? `${stat.value}/${stat.max}` : stat.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center dark:bg-red-950">
                      <Flame className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Roast My CV</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get instant AI feedback</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center dark:bg-blue-950">
                      <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Analytics</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track your progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center dark:bg-emerald-950">
                      <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Templates</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Download CV templates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity</p>
                      <p className="text-sm">Upload a CV to get started!</p>
                    </div>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-950">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.status === "completed"
                                ? "bg-emerald-100 dark:bg-emerald-900"
                                : activity.status === "success"
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : "bg-gray-100 dark:bg-gray-900"
                            }`}
                          >
                            {activity.status === "completed" ? (
                              <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : activity.status === "success" ? (
                              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{activity.action}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{activity.fileName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.score && (
                            <Badge variant="outline" className="mb-1">
                              {activity.score}/100
                            </Badge>
                          )}
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/30">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2 dark:text-blue-200">
                    <TrendingUp className="w-5 h-5" />
                    Career Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerInsights.length === 0 ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Complete more CV analyses to see insights</p>
                    ) : (
                      careerInsights.map((insight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${insight.color} rounded-full`}></div>
                          <span className="text-sm">{insight.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/30">
                <CardHeader>
                  <CardTitle className="text-emerald-800 flex items-center gap-2 dark:text-emerald-200">
                    <Users className="w-5 h-5" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">CVs roasted today</span>
                      <span className="font-semibold">{communityStats.cvsRoastedToday.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active users</span>
                      <span className="font-semibold">{communityStats.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success stories</span>
                      <span className="font-semibold">{communityStats.successStories.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
  )
}
