// supabase/functions/cv-roast-worker/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { generateObject } from "npm:ai";
import {
  buildSystemPrompt,
  buildAnalysisPrompt,
  buildQuickScorePrompt,
  buildImprovementPrompt,
  type UserContext,
} from "../lib/ai-prompts.ts"; // adjust to your repo structure
import { model, CVAnalysisSchema, QuickScoreSchema, CVImprovementSchema } from "../lib/ai-config.ts"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FUNCTION_SECRET = Deno.env.get("FUNCTION_SECRET")!;

interface CVAnalysisRequest {
  cvText: string
  roastTone: "light" | "heavy"
  focusAreas: string[]
  showEmojis: boolean
  userContext?: UserContext
}

Deno.serve(async (req) => {
  // Secure the function
  if (req.headers.get("x-function-secret") !== FUNCTION_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  // Database Webhook payload: { type, table, record, ... }
  const jobId: string | undefined =
    payload?.record?.id ?? payload?.jobId;

  if (!jobId) {
    return new Response("Missing jobId", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Load job + CV text
  const { data: job, error: jobErr } = await supabase
    .from("roast_jobs")
    .select(`
      id, user_id, cv_upload_id,
      roast_tone, focus_areas, show_emojis, user_context,
      status,
      cv_uploads!inner(extracted_text)
    `)
    .eq("id", jobId)
    .single();

  if (jobErr || !job) {
    return new Response(`Job not found: ${jobErr?.message}`, { status: 404 });
  }

  // Update to processing
  await supabase
    .from("roast_jobs")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", jobId);

  const started = Date.now();

  try {
    async function analyzeCVWithAI(request: CVAnalysisRequest) {
      const { cvText, roastTone, focusAreas, showEmojis, userContext } = request
    
      const systemPrompt = buildSystemPrompt(roastTone, focusAreas, showEmojis, userContext)
      const userPrompt = buildAnalysisPrompt(cvText)
    
      const result = await generateObject({
        model,
        system: systemPrompt,
        prompt: userPrompt,
        schema: CVAnalysisSchema,
        temperature: roastTone === "heavy" ? 0.8 : 0.6,
        // maxOutputTokens: 2048,
      })
    
      return result
    }
    // console.time("analyze-cv")
    const result = await analyzeCVWithAI({
      cvText: job.cv_uploads.extracted_text,
      roastTone: job.roast_tone,
      focusAreas: job.focus_areas,
      showEmojis: job.show_emojis,
      userContext: job.user_context,
    })
    // console.timeEnd("analyze-cv")

    const processing_ms = (Date.now() - started) / 1000

    const { error: insertError } =await supabase.from("roast_responses").insert({
      user_id: job.user_id,
      cv_upload_id: job.cv_upload_id,
      roast_tone: job.roast_tone,
      focus_areas: job.focus_areas,
      show_emojis: job.show_emojis,
      user_context: job.user_context,
      overall_feedback: result.object.overall,
      feedback_points: result.object.feedback,
      market_readiness: result.object.marketReadiness,
      kenyan_job_market_tips: result.object.kenyanJobMarketTips,
      processing_time_seconds: processing_ms,
      ai_tokens_used: result.usage?.totalTokens,
      ai_model: "gemini-2.5-flash",
      finish_reason: result.finishReason,
      io_tokens: [result.usage?.inputTokens || 0, result.usage?.outputTokens || 0],
    });

    if (insertError) {
      console.error("Insert failed:", insertError);
      throw insertError;
    }

    await supabase
      .from("roast_jobs")
      .update({ status: "succeeded", updated_at: new Date().toISOString() })
      .eq("id", jobId);

    return new Response("ok", { status: 200 });
  } catch (e) {
    await supabase
      .from("roast_jobs")
      .update({
        status: "failed",
        error: String(e?.message ?? e),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    return new Response("failed", { status: 500 });
  }
});
