"use client"

import { MoreVertical, TrendingUp, Link2, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface SkillCardProps {
  skill: {
    id: string
    name: string
    category: string
    proficiency: number
    endorsements: number
    improvement: number
    linkedProjects: number
    milestone?: string
  }
}

const categoryColors: Record<string, { bg: string; text: string; badge: string }> = {
  technical: {
    bg: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
    text: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  },
  soft: {
    bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
  },
  language: {
    bg: "from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20",
    text: "text-purple-700 dark:text-purple-400",
    badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
  },
  tool: {
    bg: "from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
  },
}

const getProficiencyLabel = (level: number) => {
  if (level >= 90) return "Expert"
  if (level >= 75) return "Advanced"
  if (level >= 60) return "Intermediate"
  return "Beginner"
}

export function SkillCard({ skill }: SkillCardProps) {
  const colors = categoryColors[skill.category] || categoryColors.technical
  const proficiencyLabel = getProficiencyLabel(skill.proficiency)

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className={`h-1 bg-gradient-to-r from-emerald-500 to-blue-500`} />

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">{skill.name}</h3>
              {skill.milestone && (
                <Badge variant="secondary" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  {skill.milestone}
                </Badge>
              )}
            </div>
            <Badge className={colors.badge} variant="secondary">
              {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Skill</DropdownMenuItem>
              <DropdownMenuItem>View History</DropdownMenuItem>
              <DropdownMenuItem>Link Project</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Proficiency Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Proficiency</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{skill.proficiency}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
              style={{ width: `${skill.proficiency}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">{proficiencyLabel}</span>
            {skill.improvement > 0 && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />+{skill.improvement}% this month
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Endorsements</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{skill.endorsements}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <Link2 className="w-3 h-3" />
              Linked Projects
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{skill.linkedProjects}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
