"use client"

import { useState, useCallback } from "react"
import { supabaseCVService } from "@/lib/supabase/client/cv-service"

export interface CVAnalysisResult {
  id: string
  overall: string
  feedback: Array<{
    title: string
    content: string
    category: string
    severity: "low" | "medium" | "high"
    tip?: string
    kenyanContext?: string
  }>
  marketReadiness: {
    score: number
    strengths: string[]
    priorities: string[]
  }
  kenyanJobMarketTips: string[]
  processingTime: number
  metadata: {
    fileName: string
    fileSize: number
    fileType: string
    pageCount?: number
    wordCount: number
  }
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason?: string
  createdAt: string
  isComplete: boolean
}

export interface CVAnalysisError {
  message: string
  code?: string
}

export interface UserContext {
  targetRole?: string
  experience?: "entry" | "mid" | "senior"
  industry?: string
}

export function useSupabaseCVAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<CVAnalysisResult | null>(null)
  const [error, setError] = useState<CVAnalysisError | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const analyzeCV = useCallback(
    async (
      file: File,
      options: {
        roastTone: "light" | "heavy"
        focusAreas: string[]
        showEmojis: boolean
        userContext?: UserContext
      },
    ) => {
      setIsAnalyzing(true)
      setError(null)
      setResult(null)
      setUploadProgress(0)

      try {
        // Create FormData for the API request
        const formData = new FormData()
        formData.append("file", file)
        formData.append("roastTone", options.roastTone)
        formData.append("focusAreas", JSON.stringify(options.focusAreas))
        formData.append("showEmojis", options.showEmojis.toString())

        // Add user context if provided
        if (options.userContext?.targetRole) {
          formData.append("targetRole", options.userContext.targetRole)
        }
        if (options.userContext?.experience) {
          formData.append("experience", options.userContext.experience)
        }
        if (options.userContext?.industry) {
          formData.append("industry", options.userContext.industry)
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + Math.random() * 10
          })
        }, 200)

        // Make API request to server-side endpoint
        const response = await fetch("/api/analyze-cv-supabase", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(95)

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.error || "Failed to analyze CV")
        }

        if (!responseData.success) {
          throw new Error(responseData.error || "Analysis failed")
        }

        setUploadProgress(100)
        setResult({...responseData.data, isComplete: true})
      } catch (err) {
        const error = err as Error
        setError({
          message: error.message,
          code: "ANALYSIS_FAILED",
        })
      } finally {
        setIsAnalyzing(false)
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setIsAnalyzing(false)
    setUploadProgress(0)
  }, [])

  const loadPreviousRoast = useCallback(async (roastId: string) => {
    try {
      setError(null)
      
      const roastData = await supabaseCVService.getRoastResponseById(roastId)
      if (!roastData) {
        throw new Error("Roast not found")
      }

      const formattedResult: CVAnalysisResult = {
        id: roastData.id,
        overall: roastData.overall_feedback,
        feedback: roastData.feedback_points.map((point: any) => ({
          title: point.title,
          content: point.content,
          category: point.category,
          severity: point.severity,
          tip: point.tip || "",
          kenyanContext: point.kenyan_context,
        })),
        marketReadiness: roastData.market_readiness,
        kenyanJobMarketTips: roastData.kenyan_job_market_tips,
        processingTime: roastData.processing_time_seconds || 0,
        metadata: {
          fileName: roastData.cv_upload.file_name,
          fileSize: roastData.cv_upload.file_size,
          fileType: roastData.cv_upload.file_type,
          pageCount: roastData.cv_upload.page_count || undefined,
          wordCount: roastData.cv_upload.word_count,
        },
        usage: roastData.ai_tokens_used
          ? {
              totalTokens: roastData.ai_tokens_used,
              promptTokens: 0,
              completionTokens: roastData.ai_tokens_used,
            }
          : undefined,
        finishReason: roastData.finish_reason || undefined,
        isComplete: true,
        createdAt: roastData.created_at,
      }

      setResult(formattedResult)
    } catch (err) {
      const error = err as Error
      setError({
        message: error.message,
        code: "LOAD_FAILED",
      })
    }
  }, [])

  return {
    analyzeCV,
    isAnalyzing,
    result,
    error,
    uploadProgress,
    reset,
    loadPreviousRoast,
  }
}
