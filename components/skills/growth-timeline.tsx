"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Award, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface GrowthTimelineProps {
  skills: any[]
}

const MOCK_EVENTS = [
  {
    id: 1,
    date: "2025-01-15",
    type: "milestone",
    title: "Reached Expert Level in React",
    description: "Congratulations! You've reached 90+ proficiency",
    icon: Award,
  },
  {
    id: 2,
    date: "2025-01-12",
    type: "achievement",
    title: "Received 5 Endorsements",
    description: "Your Project Management skills are highly valued",
    icon: TrendingUp,
  },
  {
    id: 3,
    date: "2025-01-10",
    type: "improvement",
    title: "+8% Improvement in TypeScript",
    description: "Keep practicing! You're making great progress",
    icon: Zap,
  },
  {
    id: 4,
    date: "2025-01-08",
    type: "milestone",
    title: "Linked 4 Projects to Skills",
    description: "Your skills are now connected to your work",
    icon: Award,
  },
  {
    id: 5,
    date: "2025-01-05",
    type: "achievement",
    title: "Added Communication Skill",
    description: "New soft skill added to your profile",
    icon: TrendingUp,
  },
]

const typeColors: Record<string, string> = {
  milestone: "from-emerald-500 to-blue-500",
  achievement: "from-purple-500 to-pink-500",
  improvement: "from-amber-500 to-orange-500",
}

export function GrowthTimeline({ skills }: GrowthTimelineProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Your Growth Journey</CardTitle>
          <CardDescription>Track your skill development and achievements over time</CardDescription>
        </CardHeader>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {MOCK_EVENTS.map((event, index) => {
          const Icon = event.icon
          return (
            <Card key={event.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`p-3 bg-gradient-to-br ${typeColors[event.type]} rounded-full text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < MOCK_EVENTS.length - 1 && (
                      <div className="w-1 h-12 bg-gradient-to-b from-emerald-300 to-slate-300 dark:from-emerald-700 dark:to-slate-700 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{event.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{event.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2 whitespace-nowrap">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
