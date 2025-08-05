"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { usageTracker } from "@/lib/usage-tracker"
import {
  BarChart3,
  FileText,
  Flame,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Crown,
  ChevronRight,
  Calendar,
  Award,
  Users,
} from "lucide-react"

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [usage, setUsage] = useState({ count: 0, limit: 5, plan: "free" })
  const [resetTime, setResetTime] = useState("24h 0m")

  useEffect(() => {
    const updateUsage = () => {
      const currentUsage = usageTracker.getCurrentUsage()
      const remaining = usageTracker.getRemainingRequests()
      const reset = usageTracker.getResetTime()

      setUsage(currentUsage)
      setResetTime(reset)
    }

    updateUsage()
    const interval = setInterval(updateUsage, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const planIcons = {
    free: FileText,
    hustler: Zap,
    pro: Crown,
  }

  const PlanIcon = planIcons[usage.plan as keyof typeof planIcons]
  const usagePercentage = (usage.count / usage.limit) * 100

  const stats = [
    {
      title: "CVs Roasted Today",
      value: usage.count,
      max: usage.limit,
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Success Rate",
      value: "87%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Avg. Processing Time",
      value: "2.3s",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Career Score",
      value: "8.2/10",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const recentActivity = [
    {
      action: "CV Roasted",
      file: "John_Doe_CV.pdf",
      score: 85,
      time: "2 hours ago",
      status: "completed",
    },
    {
      action: "CV Roasted",
      file: "Mary_Wanjiku_Resume.docx",
      score: 92,
      time: "5 hours ago",
      status: "completed",
    },
    {
      action: "Plan Upgraded",
      file: "Hustler Plan",
      time: "1 day ago",
      status: "success",
    },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50/50 to-blue-50/30">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-emerald-600 font-medium">Overview</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Wanjiku! 👋</h1>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className={`${
                  usage.plan === "free"
                    ? "bg-gray-50 text-gray-700 border-gray-200"
                    : usage.plan === "hustler"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                }`}
              >
                <PlanIcon className="w-3 h-3 mr-1" />
                {usage.plan === "free" ? "Free Plan" : usage.plan === "hustler" ? "Hustler Plan 💪" : "Pro Plan 👑"}
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Usage Card */}
            <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Daily Usage</h3>
                    <p className="text-sm text-gray-600">
                      {usage.count} of {usage.limit} roasts used today
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Resets in</p>
                    <p className="font-semibold text-emerald-600">{resetTime}</p>
                  </div>
                </div>
                <Progress value={usagePercentage} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0</span>
                  <span>{usage.limit}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">
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
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                      <Flame className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Roast My CV</h3>
                      <p className="text-sm text-gray-600">Get instant AI feedback</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">Track your progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Templates</h3>
                      <p className="text-sm text-gray-600">Download CV templates</p>
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
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.status === "completed"
                              ? "bg-emerald-100"
                              : activity.status === "success"
                                ? "bg-blue-100"
                                : "bg-gray-100"
                          }`}
                        >
                          {activity.status === "completed" ? (
                            <Flame className="w-4 h-4 text-emerald-600" />
                          ) : activity.status === "success" ? (
                            <Award className="w-4 h-4 text-blue-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.file}</p>
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
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Career Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Your CV scores are improving by 12% weekly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm">Tech skills section shows strong growth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Consider adding more quantified achievements</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">CVs roasted today</span>
                      <span className="font-semibold">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active users</span>
                      <span className="font-semibold">12,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success stories</span>
                      <span className="font-semibold">3,892</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}