import { google } from "@ai-sdk/google"
import { z } from "zod"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required")
}

// Configure the Google AI model
export const model = google("gemini-2.5-flash")

// Define schemas for structured outputs
export const FeedbackPointSchema = z.object({
  title: z.string().describe("Creative, attention-grabbing title using local analogies"),
  content: z.string().describe("Detailed explanation with Kenyan context and personality"),
  category: z.enum([
    "Content & Writing",
    "Format & Design",
    "Skills & Experience",
    "Contact Info",
    "NGO/UN Applications",
    "Government Jobs",
    "Career Progression",
    "Industry Specific",
  ]),
  severity: z.enum(["low", "medium", "high"]),
  tip: z.string().describe("Quick, actionable fix relevant to Kenyan job market"),
  kenyanContext: z.string().describe("Specific advice for Kenyan job market").optional(),
})

export const MarketReadinessSchema = z.object({
  score: z.number().min(0).max(100).describe("Market readiness score out of 100"),
  strengths: z.array(z.string()).max(3).describe("Top 3 strengths of the CV"),
  priorities: z.array(z.string()).max(3).describe("Top 3 improvement priorities"),
})

export const CVAnalysisSchema = z.object({
  overall: z.string().describe("2-3 sentence overall assessment with personality"),
  feedback: z.array(FeedbackPointSchema).min(4).max(8).describe("Detailed feedback points"),
  marketReadiness: MarketReadinessSchema,
  kenyanJobMarketTips: z.array(z.string()).max(3).describe("Kenya-specific job market tips"),
})

export const QuickScoreSchema = z.object({
  score: z.number().min(0).max(100),
  quickTips: z.array(z.string()).max(3),
})

export const CVImprovementSchema = z.object({
  improvements: z.array(
    z.object({
      section: z.string(),
      current: z.string(),
      improved: z.string(),
      reasoning: z.string(),
    }),
  ),
})

export type FeedbackPoint = z.infer<typeof FeedbackPointSchema>
export type MarketReadiness = z.infer<typeof MarketReadinessSchema>
export type CVAnalysis = z.infer<typeof CVAnalysisSchema>
export type QuickScore = z.infer<typeof QuickScoreSchema>
export type CVImprovement = z.infer<typeof CVImprovementSchema>