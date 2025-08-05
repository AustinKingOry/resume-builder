"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Target,
  ChevronRight,
  Download,
  Clock,
  Award,
  Users,
  FileText,
} from "lucide-react"

export default function AnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [timeRange, setTimeRange] = useState("7d")

  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" },
  ]

  const stats = [
    {
      title: "Total CVs Roasted",
      value: "47",
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Score",
      value: "8.2/10",
      change: "+0.8",
      trend: "up",
      icon: Target,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Processing Time",
      value: "2.1s",
      change: "-0.3s",
      trend: "up",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Success Rate",
      value: "94%",
      change: "+6%",
      trend: "up",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  const recentRoasts = [
    {
      fileName: "Software_Engineer_CV.pdf",
      score: 92,
      date: "2024-01-15",
      feedback: 6,
      improvements: ["Added quantified achievements", "Improved technical skills section"],
    },
    {
      fileName: "Marketing_Manager_Resume.docx",
      score: 87,
      date: "2024-01-14",
      feedback: 5,
      improvements: ["Enhanced summary section", "Added relevant keywords"],
    },
    {
      fileName: "Data_Analyst_CV.pdf",
      score: 89,
      date: "2024-01-13",
      feedback: 7,
      improvements: ["Structured experience better", "Added portfolio links"],
    },
  ]

  const categoryBreakdown = [
    { category: "Content & Writing", score: 85, count: 23 },
    { category: "Format & Design", score: 78, count: 19 },
    { category: "Skills & Experience", score: 91, count: 31 },
    { category: "Contact Info", score: 95, count: 12 },
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
                <span className="text-emerald-600 font-medium">Analytics</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                CV Analytics Dashboard
              </h1>
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
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600">{stat.change}</span>
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
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Chart visualization would go here</p>
                      <p className="text-sm text-gray-500">Showing improvement trend: +15% this month</p>
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
                    {categoryBreakdown.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.category}</span>
                          <span className="text-gray-600">{category.score}/100</span>
                        </div>
                        <Progress value={category.score} className="h-2" />
                        <p className="text-xs text-gray-500">{category.count} feedback points</p>
                      </div>
                    ))}
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
                  {recentRoasts.map((roast, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{roast.fileName}</p>
                          <p className="text-sm text-gray-600">
                            {roast.date} • {roast.feedback} feedback points
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {roast.score}/100
                        </Badge>
                        <div className="space-y-1">
                          {roast.improvements.map((improvement, i) => (
                            <p key={i} className="text-xs text-gray-600">
                              • {improvement}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-emerald-200 bg-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm">Improved CV scores by 23% this month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Consistently scoring above 85/100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Fastest processing times in your plan</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Your average score</span>
                      <span className="font-semibold">8.2/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Platform average</span>
                      <span className="font-semibold">7.1/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Top 10% threshold</span>
                      <span className="font-semibold">8.8/10</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-blue-600">You're performing 15% above average! 🎉</p>
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