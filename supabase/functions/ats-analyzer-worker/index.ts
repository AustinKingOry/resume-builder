// supabase/functions/ats-analyzer-worker/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"
import { generateObject } from "npm:ai"
import { geminiModel, KeywordAnalysisSchema, SkillsAnalysisSchema, ATSCompatibilitySchema, RecommendationsSchema } from "../lib/ats/ai-config.ts"
import { prompts, systemPrompts } from "../lib/ats/ai-prompts.ts"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const FUNCTION_SECRET = Deno.env.get("FUNCTION_SECRET_ATS")!

Deno.serve(async (req) => {
  // Step 1: Secure the function
  if (req.headers.get("x-function-secret-ats") !== FUNCTION_SECRET) {
    return new Response("Unauthorized", { status: 401 })
  }

  const payload = await req.json().catch(() => ({}))
  const jobId = payload?.record?.id ?? payload?.jobId

  if (!jobId) return new Response("Missing jobId", { status: 400 })

  // Step 2: Initialize Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  // Step 3: Load job
  const { data: job, error: jobErr } = await supabase
    .from("ats_jobs")
    .select("id, user_id, resume_text, job_description")
    .eq("id", jobId)
    .single()

  if (jobErr || !job)
    return new Response(`Job not found: ${jobErr?.message}`, { status: 404 })

  await supabase
    .from("ats_jobs")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", jobId)

  const started = Date.now()

  try {        
    /**
     * Analyze keyword match between resume and job description
     */
    async function analyzeKeywordMatch(resumeData: string, jobDescription: string) {
      const resumeText = resumeData;

      const result = await generateObject({
        model: geminiModel,
        system: systemPrompts.atsAnalyst,
        prompt: prompts.keywordAnalysis(resumeText, jobDescription),
        schema: KeywordAnalysisSchema,
      })

      return result
    }

    /**
    * Analyze skills match between resume and job requirements
    */
    async function analyzeSkillsMatch(resumeData: string, jobDescription: string) {
      const resumeText = resumeData;

      const result = await generateObject({
        model: geminiModel,
        system: systemPrompts.atsAnalyst,
        prompt: prompts.skillsAnalysis(resumeText, jobDescription),
        schema: SkillsAnalysisSchema,
        temperature: 0.7,
      })

      return result
    }

    /**
    * Analyze ATS compatibility and formatting
    */
    async function analyzeATSCompatibility(resumeData: string, jobDescription: string) {
      const resumeText = resumeData;

      const result = await generateObject({
        model: geminiModel,
        system: systemPrompts.atsAnalyst,
        prompt: prompts.atsCompatibility(resumeText, jobDescription),
        schema: ATSCompatibilitySchema,
        temperature: 0.7,
      })

      return result
    }

    /**
    * Generate actionable recommendations for improvement
    */
    async function generateRecommendations(resumeData: string, jobDescription: string) {
      const resumeText = resumeData;

      const result = await generateObject({
        model: geminiModel,
        system: systemPrompts.atsAnalyst,
        prompt: prompts.recommendations(resumeText, jobDescription),
        schema: RecommendationsSchema,
        temperature: 0.7,
      })

      return result
    }

    /**
    * Get section-by-section scores and feedback
    */
    async function getSectionScores(resumeData: string, jobDescription: string) {
      const resumeText = resumeData;

      const result = await generateObject({
        model: geminiModel,
        system: systemPrompts.atsAnalyst,
        prompt: prompts.sectionScores(resumeText, jobDescription),
        schema: KeywordAnalysisSchema,
        temperature: 0.7,
      })

      return result
    }


    const resumeText = job.resume_text;
    const jobDescription = job.job_description;
    
    const [keywordAnalysis, skillsAnalysis, atsCompatibility, recommendations, sections] = await Promise.all([
      analyzeKeywordMatch(resumeText, jobDescription),
      analyzeSkillsMatch(resumeText, jobDescription),
      analyzeATSCompatibility(resumeText, jobDescription),
      generateRecommendations(resumeText, jobDescription),
      getSectionScores(resumeText, jobDescription),
    ])

    // Calculate overall scores
    const overallScore = Math.round(
      (keywordAnalysis.object.matchPercentage + skillsAnalysis.object.matchPercentage + atsCompatibility.object.atsScore) / 3,
    )

    const keywordStrength = Math.round(keywordAnalysis.object.matchPercentage)
    const skillsMatch = Math.round(skillsAnalysis.object.matchPercentage)
    const atsReady = Math.round(atsCompatibility.object.atsScore)

    const processing_ms = Date.now() - started

    const result = {
      object: {
        overallScore: overallScore,
        keywordStrength: keywordStrength,
        skillsMatch: skillsMatch,
        atsReady: atsReady,
        keywords: keywordAnalysis.object,
        skills: skillsAnalysis.object,
        atsCompatibility: atsCompatibility.object,
        recommendations: recommendations.object,
        sections: sections.object,
      },
      usage: {
        inputTokens: keywordAnalysis.usage?.inputTokens || 0 + skillsAnalysis.usage?.inputTokens || 0 + atsCompatibility.usage?.inputTokens || 0 + recommendations.usage?.inputTokens || 0 + sections.usage?.inputTokens || 0,
        outputTokens: keywordAnalysis.usage?.outputTokens || 0 + skillsAnalysis.usage?.outputTokens || 0 + atsCompatibility.usage?.outputTokens || 0 + recommendations.usage?.outputTokens || 0 + sections.usage?.outputTokens || 0,
        totalTokens: keywordAnalysis.usage?.totalTokens || 0 + skillsAnalysis.usage?.totalTokens || 0 + atsCompatibility.usage?.totalTokens || 0 + recommendations.usage?.totalTokens || 0 + sections.usage?.totalTokens || 0,
        finishReason: keywordAnalysis.finishReason || skillsAnalysis.finishReason || atsCompatibility.finishReason || recommendations.finishReason || sections.finishReason || "stop",
      },
      finishReason: keywordAnalysis.finishReason || skillsAnalysis.finishReason || atsCompatibility.finishReason || recommendations.finishReason || sections.finishReason || "stop",
    }
    // console.log("Response data:", result);

    // Step 5: Save results
    const { error: insertErr } = await supabase.from("ats_responses").insert({
      ats_job_id: job.id,
      overall_score: result.object.overallScore,
      keyword_strength: result.object.keywordStrength,
      skills_match: result.object.skillsMatch,
      ats_ready: result.object.atsReady,
      keywords: result.object.keywords,
      skills: result.object.skills,
      ats_compatibility: result.object.atsCompatibility,
      section_analysis: result.object.sections,
      recommendations: result.object.recommendations,
      finished_reason: result.finishReason,
      io_tokens: {
        input: result.usage?.inputTokens || 0,
        output: result.usage?.outputTokens || 0,
        total: result.usage?.totalTokens || 0,
      },
      model: geminiModel,
      provider: "google",
      processing_time_ms: processing_ms,
    });

    if (insertErr) {
      console.error("Insert failed:", insertErr);
      await supabase
        .from("ats_jobs")
        .update({ status: "failed", error: insertErr.message })
        .eq("id", jobId);
      return;
    }

    // console.log("Updating job status...");
    await supabase
      .from("ats_jobs")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", jobId);

    return new Response("ok", { status: 200 })
  } catch (e) {
    await supabase
      .from("ats_jobs")
      .update({
        status: "failed",
        error: String(e?.message ?? e),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)

    return new Response("failed", { status: 500 })
  }
})
