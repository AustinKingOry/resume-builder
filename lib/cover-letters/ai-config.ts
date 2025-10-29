import { google } from "@ai-sdk/google"
import { z } from "zod"

// Initialize Gemini model
export const geminiModel = google("gemini-2.0-flash")

// Schema for generated cover letter
export const CoverLetterGenerationSchema = z.object({
  content: z.string().describe("The complete generated cover letter"),
  tone: z.enum(["professional", "friendly", "formal", "creative"]),
  keyHighlights: z.array(z.string()).describe("Key points highlighted in the letter"),
  suggestions: z.array(z.string()).describe("Suggestions for personalization"),
})

// Schema for cover letter analysis
export const CoverLetterAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(
    z.object({
      area: z.string(),
      feedback: z.string(),
      score: z.number().min(0).max(100),
    }),
  ),
  improvements: z.array(
    z.object({
      area: z.string(),
      issue: z.string(),
      suggestion: z.string(),
      priority: z.enum(["high", "medium", "low"]),
    }),
  ),
  toneAnalysis: z.object({
    detectedTone: z.string(),
    appropriateness: z.number().min(0).max(100),
    feedback: z.string(),
  }),
  keywordRelevance: z.object({
    matchedKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
    relevanceScore: z.number().min(0).max(100),
  }),
  recommendations: z.array(z.string()),
})

// Schema for AI suggestions
export const AISuggestionsSchema = z.object({
  suggestions: z.array(z.string()).describe("Array of suggestion strings for improvement"),
  summary: z.string().describe("Summary of the suggestions provided"),
})
