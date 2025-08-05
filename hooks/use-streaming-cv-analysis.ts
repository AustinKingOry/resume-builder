"use client"

import { useState, useCallback } from "react"
import type { CVAnalysis } from "@/lib/ai-config"

export interface StreamingCVAnalysisResult {
  overall?: string
  feedback?: Array<{
    title: string
    content: string
    category: string
    severity: "low" | "medium" | "high"
    tip: string
    kenyanContext?: string
  }>
  marketReadiness?: {
    score: number
    strengths: string[]
    priorities: string[]
  }
  kenyanJobMarketTips?: string[]
  metadata?: {
    fileName: string
    fileSize: number
    fileType: string
    pageCount?: number
    wordCount: number
  }
  isComplete: boolean
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface UserContext {
  targetRole?: string
  experience?: "entry" | "mid" | "senior"
  industry?: string
}

export function useStreamingCVAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<StreamingCVAnalysisResult>({ isComplete: false })
  const [error, setError] = useState<string | null>(null)
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
      setResult({ isComplete: false })
      setUploadProgress(0)

      try {
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

        const response = await fetch("/api/analyze-cv-stream", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (!response.ok) {
          throw new Error("Failed to analyze CV")
        }

        // Get metadata from headers
        const metadataHeader = response.headers.get("X-CV-Metadata")
        const metadata = metadataHeader ? JSON.parse(metadataHeader) : undefined

        // Read the streaming response using AI SDK v5
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error("No response body")
        }

        let buffer = ""
        let finalUsage: any = null

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Process complete JSON objects from the buffer
          const lines = buffer.split("\n")
          buffer = lines.pop() || "" // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.trim()) {
              try {
                const chunk = JSON.parse(line)

                if (chunk.type === "object") {
                  const partialResult = chunk.object as Partial<CVAnalysis>
                  setResult((prev) => ({
                    ...prev,
                    ...partialResult,
                    metadata,
                    isComplete: false,
                  }))
                } else if (chunk.type === "finish") {
                  finalUsage = chunk.usage
                } else if (chunk.type === "error") {
                  throw new Error(chunk.error)
                }
              } catch (parseError) {
                // Handle partial JSON chunks - continue reading
                console.warn("Failed to parse chunk:", parseError)
              }
            }
          }
        }

        // Mark as complete with final usage
        setResult((prev) => ({
          ...prev,
          isComplete: true,
          usage: finalUsage,
        }))
      } catch (err) {
        const error = err as Error
        setError(error.message)
      } finally {
        setIsAnalyzing(false)
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setResult({ isComplete: false })
    setError(null)
    setIsAnalyzing(false)
    setUploadProgress(0)
  }, [])

  return {
    analyzeCV,
    isAnalyzing,
    result,
    error,
    uploadProgress,
    reset,
  }
}