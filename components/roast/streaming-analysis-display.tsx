"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { FeedbackCard } from "./feedback-card"
import { MarketReadinessScore } from "./market-readiness-score"
import { CheckCircle, Zap, Activity } from "lucide-react"
import type { StreamingCVAnalysisResult } from "@/hooks/use-streaming-cv-analysis"

interface StreamingAnalysisDisplayProps {
  result: StreamingCVAnalysisResult
  showEmojis: boolean
  roastTone: "light" | "heavy"
}

export function StreamingAnalysisDisplay({ result, showEmojis, roastTone }: StreamingAnalysisDisplayProps) {
  const { overall, feedback, marketReadiness, kenyanJobMarketTips, metadata, isComplete, usage } = result

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2 dark:text-gray-100">
            Your CV Roast is Ready! 🔥
            <Badge variant={roastTone === "light" ? "secondary" : "destructive"} className="text-xs">
              {roastTone === "light" ? "Light Roast ☕" : "Heavy Roast 🔥"}
            </Badge>
            {!isComplete && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                Streaming live...
              </Badge>
            )}
            {isComplete && usage && (
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                <Zap className="w-3 h-3 mr-1" />
                {usage.totalTokens} tokens
              </Badge>
            )}
          </h2>
          {metadata && (
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap dark:text-gray-400">
              <span>File: {metadata.fileName}</span>
              <span>•</span>
              <span>{metadata.wordCount} words</span>
              {metadata.pageCount && (
                <>
                  <span>•</span>
                  <span>{metadata.pageCount} pages</span>
                </>
              )}
              <span>•</span>
              <div className="flex items-center gap-1">
                {isComplete ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                )}
                <span>{isComplete ? "Analysis complete" : "Streaming results..."}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Streaming Progress Indicator */}
      {!isComplete && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50/50 to-emerald-50/30 dark:from-blue-950/50 dark:to-emerald-950/30 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600 animate-pulse dark:text-blue-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">AI is analyzing your CV in real-time...</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Results will appear as they're generated</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                AI SDK v5
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Readiness Score */}
      {marketReadiness ? (
        <MarketReadinessScore
          score={marketReadiness.score}
          strengths={marketReadiness.strengths}
          priorities={marketReadiness.priorities}
          kenyanJobMarketTips={kenyanJobMarketTips || []}
        />
      ) : (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-blue-50/30 dark:from-emerald-950/50 dark:to-blue-950/30 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-48 h-6" />
              {!isComplete && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  Calculating score...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Skeleton className="w-20 h-12 mx-auto mb-2" />
              <Skeleton className="w-32 h-6 mx-auto mb-4" />
              <Progress value={0} className="w-full h-3" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Feedback */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-blue-50/30 relative overflow-hidden dark:border-emerald-800 dark:from-emerald-950/50 dark:to-blue-950/30">
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fillOpacity='0.3'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v30h30zM0 30v30h30c0-16.569-13.431-30-30-30z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center relative overflow-hidden">
              <span className="text-white text-sm relative z-10 dark:text-black">🤖</span>
            </div>
            Overall Assessment - AI Career Mentor
            {!overall && !isComplete && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                Generating...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          {overall ? (
            <p className="text-gray-700 leading-relaxed text-lg mb-4 dark:text-gray-300">
              {showEmojis
                ? overall
                : overall.replace(
                    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
                    "",
                  )}
            </p>
          ) : (
            <div className="space-y-2">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-3/4 h-6" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-gray-100">
          Detailed Feedback {feedback && `(${feedback.length} points)`}
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
            Kenya Job Market Ready 🇰🇪
          </Badge>
          {!isComplete && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Streaming feedback...
            </Badge>
          )}
        </h3>
        <div className="space-y-4">
          {feedback?.map((feedbackItem, index) => (
            <FeedbackCard
              key={index}
              title={feedbackItem.title}
              content={feedbackItem.content}
              category={feedbackItem.category}
              severity={feedbackItem.severity}
              index={index + 1}
              showEmojis={showEmojis}
              tip={feedbackItem.tip}
              user_id={""}
              />
          )) ||
            // Show skeleton cards while loading
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-l-4 border-l-emerald-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-48 h-5" />
                        <Skeleton className="w-16 h-5" />
                        <Skeleton className="w-20 h-5" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-3/4 h-4" />
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 dark:bg-emerald-950 dark:border-emerald-800">
                        <Skeleton className="w-full h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Token Usage Display (for development/debugging) */}
      {isComplete && usage && (
        <Card className="border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>AI Usage (KAZIKIT AI):</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Prompt: {usage.promptTokens} tokens</span>
                <span>•</span>
                <span>Response: {usage.completionTokens} tokens</span>
                <span>•</span>
                <span className="font-medium">Total: {usage.totalTokens} tokens</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}