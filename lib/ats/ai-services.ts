import { generateObject } from "ai"
import { geminiModel } from "./ai-config"
import { KeywordAnalysisSchema, SkillsAnalysisSchema, ATSCompatibilitySchema, RecommendationsSchema } from "./ai-config"
import { prompts, systemPrompts } from "./ai-prompts"

export interface ResumeData {
  fullText: string
  header?: string
  summary?: string
  experience?: string
  skills?: string
  education?: string
  contact?: {
    email?: string
    phone?: string
    location?: string
  }
}

/**
 * Analyze keyword match between resume and job description
 */
export async function analyzeKeywordMatch(resumeData: string, jobDescription: string) {
//   const resumeText =
//     resumeData.fullText ||
//     `${resumeData.header || ""} ${resumeData.summary || ""} ${resumeData.experience || ""} ${resumeData.skills || ""} ${resumeData.education || ""}`.trim()
    const resumeText = resumeData;

  const { object } = await generateObject({
    model: geminiModel,
    system: systemPrompts.atsAnalyst,
    prompt: prompts.keywordAnalysis(resumeText, jobDescription),
    schema: KeywordAnalysisSchema,
  })

  return object
}

/**
 * Analyze skills match between resume and job requirements
 */
export async function analyzeSkillsMatch(resumeData: string, jobDescription: string) {
//   const resumeText =
//     resumeData.fullText ||
//     `${resumeData.header || ""} ${resumeData.summary || ""} ${resumeData.experience || ""} ${resumeData.skills || ""} ${resumeData.education || ""}`.trim()
    const resumeText = resumeData;

  const { object } = await generateObject({
    model: geminiModel,
    system: systemPrompts.atsAnalyst,
    prompt: prompts.skillsAnalysis(resumeText, jobDescription),
    schema: SkillsAnalysisSchema,
  })

  return object
}

/**
 * Analyze ATS compatibility and formatting
 */
export async function analyzeATSCompatibility(resumeData: string, jobDescription: string) {
//   const resumeText =
//     resumeData.fullText ||
//     `${resumeData.header || ""} ${resumeData.summary || ""} ${resumeData.experience || ""} ${resumeData.skills || ""} ${resumeData.education || ""}`.trim()
    const resumeText = resumeData;

  const { object } = await generateObject({
    model: geminiModel,
    system: systemPrompts.atsAnalyst,
    prompt: prompts.atsCompatibility(resumeText, jobDescription),
    schema: ATSCompatibilitySchema,
  })

  return object
}

/**
 * Generate actionable recommendations for improvement
 */
export async function generateRecommendations(resumeData: string, jobDescription: string) {
//   const resumeText =
//     resumeData.fullText ||
//     `${resumeData.header || ""} ${resumeData.summary || ""} ${resumeData.experience || ""} ${resumeData.skills || ""} ${resumeData.education || ""}`.trim()
    const resumeText = resumeData;

  const { object } = await generateObject({
    model: geminiModel,
    system: systemPrompts.atsAnalyst,
    prompt: prompts.recommendations(resumeText, jobDescription),
    schema: RecommendationsSchema,
  })

  return object
}

/**
 * Get section-by-section scores and feedback
 */
export async function getSectionScores(resumeData: string, jobDescription: string) {
//   const resumeText =
//     resumeData.fullText ||
//     `${resumeData.header || ""} ${resumeData.summary || ""} ${resumeData.experience || ""} ${resumeData.skills || ""} ${resumeData.education || ""}`.trim()
    const resumeText = resumeData;

  const { object: sectionScores } = await generateObject({
    model: geminiModel,
    system: systemPrompts.atsAnalyst,
    prompt: prompts.sectionScores(resumeText, jobDescription),
    schema: KeywordAnalysisSchema,
  })

  return sectionScores
}
