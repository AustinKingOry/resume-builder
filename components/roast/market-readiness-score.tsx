"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Lightbulb } from "lucide-react"

interface MarketReadinessScoreProps {
  score: number
  strengths: string[]
  priorities: string[]
  kenyanJobMarketTips: string[]
}

export function MarketReadinessScore({ score, strengths, priorities, kenyanJobMarketTips }: MarketReadinessScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Market Ready! 🚀"
    if (score >= 60) return "Almost There 💪"
    return "Needs Work 🔧"
  }

  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-blue-50/30 relative overflow-hidden">
      {/* Pattern */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fillOpacity='0.3'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v30h30zM0 30v30h30c0-16.569-13.431-30-30-30z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Kenya Job Market Readiness
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Score Display */}
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>{score}/100</div>
          <p className="text-lg font-medium text-gray-700">{getScoreLabel(score)}</p>
          <Progress value={score} className="w-full mt-4 h-3" />
        </div>

        {/* Strengths */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-emerald-600">✨</span>
            Your Strengths
          </h4>
          <div className="space-y-2">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                  ✓
                </Badge>
                <span className="text-sm text-gray-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-red-600" />
            Top Priorities
          </h4>
          <div className="space-y-2">
            {priorities.map((priority, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                  {index + 1}
                </Badge>
                <span className="text-sm text-gray-700">{priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kenyan Market Tips */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            Kenya Market Tips 🇰🇪
          </h4>
          <div className="space-y-2">
            {kenyanJobMarketTips.map((tip, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}