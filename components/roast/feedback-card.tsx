"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Copy, Check, Lightbulb } from "lucide-react"
import { useState } from "react"
import { supabaseCVService } from "@/lib/supabase/client/cv-service"

interface FeedbackCardProps {
  title: string
  content: string
  category: string
  severity: "low" | "medium" | "high"
  index: number
  showEmojis?: boolean
  tip?: string
  roastResponseId?: string
  user_id: string
}

export function FeedbackCard({ title, content, category, severity, index, showEmojis = true, tip, roastResponseId, user_id }: FeedbackCardProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  const severityColors = {
    low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    high: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  }

  const severityLabels = {
    low: "Rahisi",
    medium: "Kati Kati",
    high: "Muhimu Sana",
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = async (type: "up" | "down") => {
    setFeedback(feedback === type ? null : type)
    if(!roastResponseId) return
    try {
      await supabaseCVService.saveFeedback(
        user_id,
        roastResponseId,
        index,
        type
      )
    } catch (error) {
      console.error("Failed to send feedback:", error)
    }
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 group border-l-4 border-l-emerald-500 relative overflow-hidden">
      {/* Subtle pattern */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fillOpacity='0.2'%3E%3Ccircle cx='15' cy='15' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4 max-[425px]:flex-col max-[425px]:items-start">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 relative overflow-hidden dark:text-black">
            <span className="relative z-10">{index}</span>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h4 className="font-semibold text-gray-900 text-sm dark:text-gray-100">{title}</h4>
              <Badge variant="outline" className={`text-xs ${severityColors[severity]}`}>
                {category}
              </Badge>
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                {severityLabels[severity]}
              </Badge>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm mb-4 dark:text-gray-300">
              {showEmojis
                ? content
                : content.replace(
                    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
                    "",
                  )}
            </p>

            {tip && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 dark:bg-emerald-950 dark:border-emerald-800">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 dark:text-emerald-400" />
                  <p className="text-sm text-emerald-800 font-medium dark:text-emerald-300">
                    <span className="font-semibold">Quick Fix:</span> {tip}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 text-xs ${feedback === "up" ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" : "text-gray-500"}`}
                  onClick={() => handleFeedback("up")}
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Helpful
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 text-xs ${feedback === "down" ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" : "text-gray-500"}`}
                  onClick={() => handleFeedback("down")}
                >
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  {/* Si poa */}Wantam
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}