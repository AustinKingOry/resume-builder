"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Briefcase, Target, ArrowRight } from "lucide-react"

interface AIInsightsProps {
  skills: any[]
}

const MOCK_INSIGHTS = {
  suggestedSkills: [
    { name: "Next.js", reason: "Complements your React expertise", demand: "High" },
    { name: "GraphQL", reason: "Requested by 73% of React developers", demand: "High" },
    { name: "Docker", reason: "Essential for modern DevOps roles", demand: "Very High" },
  ],
  relatedRoles: [
    { title: "Senior Frontend Engineer", match: 92 },
    { title: "Full Stack Developer", match: 87 },
    { title: "Technical Lead", match: 84 },
  ],
  recommendations: [
    {
      title: "Level up your TypeScript",
      description: "With your React expertise, mastering TypeScript could boost your profile by 15%",
    },
    {
      title: "Bridge the communication gap",
      description: "Your technical skills are strong. Enhance soft skills to become a technical lead",
    },
    {
      title: "Build in public",
      description: "Create 2-3 projects showcasing your React + TypeScript skills on GitHub",
    },
  ],
}

export function AIInsights({ skills }: AIInsightsProps) {
  return (
    <div className="space-y-6">
      {/* Suggested Skills */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <CardTitle>Skills You Should Learn</CardTitle>
              <CardDescription>Based on your profile and market demand</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_INSIGHTS.suggestedSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{skill.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{skill.reason}</p>
                </div>
                <Badge
                  className={`${
                    skill.demand === "Very High"
                      ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                      : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                  }`}
                >
                  {skill.demand} Demand
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Roles */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <div>
              <CardTitle>Roles for Your Skills</CardTitle>
              <CardDescription>Career opportunities that match your profile</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_INSIGHTS.relatedRoles.map((role, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-white">{role.title}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      style={{ width: `${role.match}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white min-w-12">{role.match}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <div>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Actions to accelerate your career growth</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_INSIGHTS.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{rec.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{rec.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
