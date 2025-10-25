"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, CheckCircle2, Sparkles } from "lucide-react"

const tips = [
  "💡 Tip: Using industry-specific keywords increases your ATS score by up to 40%",
  "📊 Tip: Soft skills like 'leadership' and 'collaboration' are often overlooked — make sure they're visible",
  "🎯 Tip: Formatting matters! ATS systems struggle with graphics, tables, and unusual fonts",
  "✨ Tip: Tailoring your resume to each job posting can improve your match score significantly",
  "🔍 Tip: Action verbs like 'developed,' 'implemented,' and 'optimized' are ATS-friendly",
  "📈 Tip: Including quantifiable achievements (e.g., '30% improvement') boosts your credibility",
]

interface LoadingStateProps {
  isOpen: boolean
}

export function ATSLoadingState({ isOpen }: LoadingStateProps) {
  const [progress, setProgress] = useState(0)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      return
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 20
      })
    }, 800)

    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length)
    }, 5000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(tipInterval)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md border-2 border-slate-200 shadow-2xl">
        <CardHeader className="pb-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500 border-r-blue-500"></div>
              <div className="absolute inset-2 flex items-center justify-center">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl font-bold">Analyzing Your Resume</CardTitle>
          <CardDescription className="mt-2 text-sm">
            Our AI is scanning your resume against the job description...
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Analysis Progress</span>
              <span className="text-xs font-semibold text-slate-900">{Math.min(progress + 10, 95).toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(progress + 10, 95)} className="h-2.5" />
          </div>

          {/* Analysis Steps */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Extracting resume content</p>
                <p className="text-xs text-slate-500">Parsing text and structure</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Analyzing job description</p>
                <p className="text-xs text-slate-500">Identifying key requirements</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full ${
                  progress > 40 ? "bg-emerald-100" : "bg-slate-200"
                }`}
              >
                {progress > 40 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400"></div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Comparing skills & keywords</p>
                <p className="text-xs text-slate-500">Running AI analysis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full ${
                  progress > 70 ? "bg-emerald-100" : "bg-slate-200"
                }`}
              >
                {progress > 70 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400"></div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Generating insights</p>
                <p className="text-xs text-slate-500">Preparing recommendations</p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-semibold text-blue-900">Pro Tip</p>
            </div>
            <p className="text-sm text-blue-800 transition-opacity duration-300">{tips[currentTipIndex]}</p>
            <div className="mt-3 flex gap-1">
              {tips.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    idx === currentTipIndex ? "bg-blue-500" : "bg-blue-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Info Text */}
          <p className="text-center text-xs text-slate-500">
            {`This typically takes 15-30 seconds. Please don't close this window.`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
