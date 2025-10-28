import { google } from "@ai-sdk/google"
import { z } from "zod"

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required")
  }

// Initialize Gemini model
export const geminiModel = google("gemini-2.5-flash")

// Schema for keyword analysis
export const KeywordAnalysisSchema = z.object({
  matchedKeywords: z.array(
    z.object({
      keyword: z.string(),
      frequency: z.number(),
      importance: z.enum(["critical", "high", "medium", "low"]),
    }),
  ),
  missingKeywords: z.array(
    z.object({
      keyword: z.string(),
      importance: z.enum(["critical", "high", "medium", "low"]),
      reason: z.string(),
    }),
  ),
  matchPercentage: z.number().min(0).max(100),
  analysis: z.string(),
})

// Schema for skills analysis
export const SkillsAnalysisSchema = z.object({
  matchedSkills: z.array(
    z.object({
      skill: z.string(),
      category: z.string(),
      proficiency: z.enum(["expert", "intermediate", "beginner"]),
      importance: z.enum(["critical", "high", "medium", "low"]),
    }),
  ),
  missingSkills: z.array(
    z.object({
      skill: z.string(),
      category: z.string(),
      priority: z.enum(["must-have", "nice-to-have"]),
      importance: z.enum(["critical", "high", "medium", "low"]),
    }),
  ),
  matchPercentage: z.number().min(0).max(100),
  skillGaps: z.array(z.string()),
  analysis: z.string(),
})

// Schema for ATS compatibility
export const ATSCompatibilitySchema = z.object({
  atsScore: z.number().min(0).max(100),
  formatting: z.object({
    score: z.number().min(0).max(100),
    issues: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),
  structure: z.object({
    score: z.number().min(0).max(100),
    sections: z.array(z.string()),
    missingSections: z.array(z.string()),
  }),
  readability: z.object({
    score: z.number().min(0).max(100),
    issues: z.array(z.string()),
  }),
  analysis: z.string(),
  metadata: z.object({
    resumeTitle: z.string(),
    candidateName: z.string(),
    jobTitle: z.string(),
    company: z.string(),
    location: z.string(),
  }),
})

// Schema for recommendations
export const RecommendationsSchema = z.object({
  improvements: z.array(
    z.object({
      category: z.enum(["keywords", "skills", "formatting", "content", "structure"]),
      title: z.string(),
      description: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      action: z.string(),
    }),
  ),
  atsWarnings: z.array(
    z.object({
      warning: z.string(),
      severity: z.enum(["critical", "warning", "info"]),
      suggestion: z.string(),
    }),
  ),
  bestPractices: z.array(
    z.object({
      practice: z.string(),
      benefit: z.string(),
      implementation: z.string(),
    }),
  ),
})

// Schema for section scores
export const SectionScoresSchema = z.object({
  header: z.object({
    score: z.number(),
    feedback: z.string(),
  }),
  summary: z.object({
    score: z.number(),
    feedback: z.string(),
  }),
  experience: z.object({
    score: z.number(),
    feedback: z.string(),
  }),
  skills: z.object({
    score: z.number(),
    feedback: z.string(),
  }),
  education: z.object({
    score: z.number(),
    feedback: z.string(),
  }),
})
