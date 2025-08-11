

// import { supabase } from "@/lib/supabase-server"
import type { Database } from "../types"
import { createClient } from "@supabase/supabase-js"

type CVUpload = Database["public"]["Tables"]["cv_uploads"]["Row"]
type RoastResponse = Database["public"]["Tables"]["roast_responses"]["Row"]


function getSupabaseClientWithToken(token: string) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export class SupabaseCVService {

  async saveCVUpload(
    token: string,
    userId: string,
    fileName: string,
    fileSize: number,
    fileType: string,
    wordCount: number,
    extractedText: string,
    pageCount?: number,
  ): Promise<CVUpload | null> {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("cv_uploads")
      .insert({
        user_id: userId,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        word_count: wordCount,
        extracted_text: extractedText,
        page_count: pageCount,
        upload_status: "completed",
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving CV upload:", error)
      return null
    }

    return data
  }

  async saveRoastResponse(
    token: string,
    userId: string,
    cvUploadId: string,
    roastData: {
      roastTone: "light" | "heavy"
      focusAreas: string[]
      showEmojis: boolean
      userContext?: any
      overallFeedback: string
      feedbackPoints: any[]
      marketReadiness: any
      kenyanJobMarketTips: string[]
      processingTimeSeconds?: number
      aiTokensUsed?: number
      aiModel?: string
      finishReason?: string
      io_tokens?: [number, number]
    },
  ): Promise<RoastResponse | null> {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("roast_responses")
      .insert({
        user_id: userId,
        cv_upload_id: cvUploadId,
        roast_tone: roastData.roastTone,
        focus_areas: roastData.focusAreas,
        show_emojis: roastData.showEmojis,
        user_context: roastData.userContext,
        overall_feedback: roastData.overallFeedback,
        feedback_points: roastData.feedbackPoints,
        market_readiness: roastData.marketReadiness,
        kenyan_job_market_tips: roastData.kenyanJobMarketTips,
        processing_time_seconds: roastData.processingTimeSeconds,
        ai_tokens_used: roastData.aiTokensUsed,
        ai_model: roastData.aiModel || "gemini-2.5-flash",
        finish_reason: roastData.finishReason,
        io_tokens: roastData.io_tokens,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving roast response:", error)
      return null
    }

    return data
  }

  async getUserCVUploads(token: string, userId: string, limit = 10): Promise<CVUpload[]> {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("cv_uploads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching CV uploads:", error)
      return []
    }

    return data || []
  }

  async getUserRoastResponses(token: string, userId: string, limit = 10): Promise<(RoastResponse & { cv_upload: CVUpload })[]> {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("roast_responses")
      .select(`
        *,
        cv_upload:cv_uploads(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching roast responses:", error)
      return []
    }

    return (data as any) || []
  }

  async getRoastResponseById(token: string, id: string): Promise<(RoastResponse & { cv_upload: CVUpload }) | null> {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("roast_responses")
      .select(`
        *,
        cv_upload:cv_uploads(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching roast response:", error)
      return null
    }

    return data as any
  }

  async saveFeedback(
    token: string,
    userId: string,
    roastResponseId: string,
    feedbackPointIndex: number,
    feedbackType: "up" | "down",
  ): Promise<boolean> {
    const supabase = getSupabaseClientWithToken(token)
    const { error } = await supabase.from("user_feedback").upsert({
      user_id: userId,
      roast_response_id: roastResponseId,
      feedback_point_index: feedbackPointIndex,
      feedback_type: feedbackType,
    })

    if (error) {
      console.error("Error saving feedback:", error)
      return false
    }

    return true
  }

  async getFeedbackForRoast(token: string, roastResponseId: string): Promise<Record<number, "up" | "down">> {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("user_feedback")
      .select("feedback_point_index, feedback_type")
      .eq("roast_response_id", roastResponseId)

    if (error) {
      console.error("Error fetching feedback:", error)
      return {}
    }

    const feedbackMap: Record<number, "up" | "down"> = {}
    data?.forEach((item) => {
      feedbackMap[item.feedback_point_index] = item.feedback_type
    })

    return feedbackMap
  }

  // Real-time subscription for new roast responses
  subscribeToRoastResponses(token: string, userId: string, callback: (response: RoastResponse) => void) {
    const supabase = getSupabaseClientWithToken(token)
    return supabase
      .channel("roast_responses_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "roast_responses",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as RoastResponse)
        },
      )
      .subscribe()
  }
}

export const supabaseCVService = new SupabaseCVService()
