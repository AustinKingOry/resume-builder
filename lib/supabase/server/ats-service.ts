

// import { supabase } from "@/lib/supabase-server"
import type { Database } from "../types"
import { createClient } from "@supabase/supabase-js"

type AtsJob = Database["public"]["Tables"]["ats_jobs"]["Row"]


function getSupabaseClientWithToken(token: string) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export class SupabaseATSService {

  async saveAtsJob(
    token: string,
    userId: string,
    jobDescription: string,
    extractedText: string,
  ): Promise<AtsJob | null> {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("ats_jobs")
      .insert({
        user_id: userId,
        resume_text: extractedText,
        job_description: jobDescription,
        status: "processing",
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving ATS Job:", error)
      return null
    }

    return data
  }
}

export const supabaseATSService = new SupabaseATSService()
