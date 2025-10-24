"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"

interface SkillComparisonProps {
  skills: any[]
}

const MOCK_BENCHMARK = {
  targetRole: "Senior Frontend Engineer",
  yourSkills: {
    React: 92,
    TypeScript: 88,
    JavaScript: 90,
    CSS: 85,
  },
  requiredSkills: {
    React: 85,
    TypeScript: 80,
    JavaScript: 75,
    CSS: 70,
    "Next.js": 75,
    Testing: 70,
  },
  gaps: [
    { skill: "Next.js", required: 75, your: 0 },
    { skill: "Testing", required: 70, your: 0 },
  ],
}

export function SkillComparison({ skills }: SkillComparisonProps) {
  return (
    <div className="space-y-6">
      {/* Upload Job Description */}
      <Card className="border-0 shadow-md border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Compare Against a Job Description</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Upload a job posting to see how your skills match the requirements
            </p>
            <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Job Description
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Comparison (Mock) */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Skills Gap Analysis</CardTitle>
          <CardDescription>Your skills vs. {MOCK_BENCHMARK.targetRole} requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Your Skills */}
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-4">Your Current Skills</h4>
            <div className="space-y-3">
              {Object.entries(MOCK_BENCHMARK.yourSkills).map(([skill, level]: any) => (
                <div key={skill}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{skill}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      style={{ width: `${level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Skills to Develop
            </h4>
            <div className="space-y-3">
              {MOCK_BENCHMARK.gaps.map((gap, index) => (
                <div
                  key={index}
                  className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white">{gap.skill}</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Required level: {gap.required}%</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                    >
                      Not Started
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Start Learning
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
