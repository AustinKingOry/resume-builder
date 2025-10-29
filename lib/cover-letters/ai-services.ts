import { generateObject } from "ai"
import { geminiModel } from "./ai-config"
import { CoverLetterGenerationSchema, CoverLetterAnalysisSchema, AISuggestionsSchema } from "./ai-config"
import { prompts, systemPrompts } from "./ai-prompts"

/**
 * Generate a cover letter based on job description and user details
 */
export async function generateCoverLetter(
  jobDescription: string,
  company: string,
  position: string,
  tone: "professional" | "friendly" | "formal" | "creative" = "professional",
  userBackground?: string,
) {
  const { object } = await generateObject({
    model: geminiModel,
    system: systemPrompts.coverLetterExpert,
    prompt: prompts.generateCoverLetter(jobDescription, company, position, tone, userBackground),
    schema: CoverLetterGenerationSchema,
  })

  return object
}

/**
 * Analyze a cover letter for quality and effectiveness
 */
export async function analyzeCoverLetter(coverLetterContent: string, jobDescription: string, company: string) {
  const { object } = await generateObject({
    model: geminiModel,
    system: systemPrompts.coverLetterExpert,
    prompt: prompts.analyzeCoverLetter(coverLetterContent, jobDescription, company),
    schema: CoverLetterAnalysisSchema,
  })

  return object
}

/**
 * Generate specific suggestions for improving the cover letter
 */
export async function generateSuggestions(coverLetterContent: string, specificRequest: string) {
  const { object } = await generateObject({
    model: geminiModel,
    system: systemPrompts.coverLetterExpert,
    prompt: prompts.generateSuggestions(coverLetterContent, specificRequest),
    schema: AISuggestionsSchema,
  })

  return object
}

/**
 * Enhance the tone of a cover letter
 */
export async function enhanceTone(
  coverLetterContent: string,
  desiredTone: "professional" | "friendly" | "formal" | "creative",
) {
  const { object } = await generateObject({
    model: geminiModel,
    system: systemPrompts.toneAdvisor,
    prompt: prompts.enhanceTone(coverLetterContent, desiredTone),
    schema: z.object({
      content: z.string(),
      toneNotes: z.string(),
    }),
  })

  return object
}

// Import z for the enhanceTone function
import { z } from "zod"
