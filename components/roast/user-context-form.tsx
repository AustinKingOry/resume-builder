"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, Briefcase, Building } from "lucide-react"

export interface UserContext {
  targetRole?: string
  experience?: "entry" | "mid" | "senior"
  industry?: string
}

interface UserContextFormProps {
  userContext: UserContext
  onUserContextChange: (context: UserContext) => void
}

export function UserContextForm({ userContext, onUserContextChange }: UserContextFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const kenyanIndustries = [
    "Banking & Finance",
    "Telecommunications",
    "NGO & Development",
    "Government",
    "Technology & Startups",
    "Agriculture",
    "Manufacturing",
    "Healthcare",
    "Education",
    "Tourism & Hospitality",
    "Media & Communications",
    "Consulting",
  ]

  const handleChange = (field: keyof UserContext, value: string | undefined) => {
    onUserContextChange({
      ...userContext,
      [field]: value || undefined,
    })
  }

  return (
    <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-emerald-50/30 relative overflow-hidden dark:border-blue-900 dark:from-blue-950/50 dark:to-emerald-950/30">
      {/* Subtle pattern */}
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fillOpacity='0.3'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20zM0 20v20h20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <CardHeader className="relative z-10 pb-3">
        <CardTitle
          className="flex items-center gap-2 text-blue-800 cursor-pointer dark:text-blue-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <User className="w-5 h-5" />
          Career Context
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs ml-auto dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
            Optional
          </Badge>
        </CardTitle>
        <p className="text-xs text-blue-600 dark:text-blue-400">Help us tailor feedback to your career goals</p>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 relative z-10 pt-0">
          {/* Target Role */}
          <div>
            <Label htmlFor="target-role" className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2 dark:text-gray-100">
              <Briefcase className="w-4 h-4" />
              Target Role
            </Label>
            <Input
              id="target-role"
              placeholder="e.g., Marketing Manager, Software Developer"
              value={userContext.targetRole || ""}
              onChange={(e) => handleChange("targetRole", e.target.value)}
              className="bg-white/80 dark:bg-black/80"
            />
          </div>

          {/* Experience Level */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block dark:text-gray-100">Experience Level</Label>
            <Select value={userContext.experience || ""} onValueChange={(value) => handleChange("experience", value)}>
              <SelectTrigger className="bg-white/80 dark:bg-black/80">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (3-7 years)</SelectItem>
                <SelectItem value="senior">Senior Level (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Industry */}
          <div>
            <Label className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2 dark:text-gray-100">
              <Building className="w-4 h-4" />
              Industry
            </Label>
            <Select value={userContext.industry || ""} onValueChange={(value) => handleChange("industry", value)}>
              <SelectTrigger className="bg-white/80 dark:bg-black/80">
                <SelectValue placeholder="Select your target industry" />
              </SelectTrigger>
              <SelectContent>
                {kenyanIndustries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded dark:bg-blue-950 dark:text-blue-400">
            💡 This helps our AI provide more targeted advice for your specific career path in Kenya
          </div>
        </CardContent>
      )}
    </Card>
  )
}