import { NextRequest, NextResponse } from "next/server";
import { parseCV } from "@/lib/cv-parser";
import { createServerClient } from "@/lib/supabase-server";
import { supabaseCVService } from "@/lib/supabase/server/cv-service";

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = (await supabase.auth.getSession()).data.session?.access_token
  if (!token) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const roastTone = formData.get("roastTone") as "light" | "heavy";
  const focusAreas = JSON.parse(String(formData.get("focusAreas") || "[]"));
  const showEmojis = String(formData.get("showEmojis")) === "true";
  const targetRole = formData.get("targetRole") as string | null;
  const experience = formData.get("experience") as "entry" | "mid" | "senior" | null;
  const industry = formData.get("industry") as string | null;

  // File validation (same as before)
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  // Parse quickly on the server route (should be fast)
  const parsed = await parseCV(file);

  // Save CV upload (your existing service)
  // Must store the extracted text!
    console.time("save-cv")
    const cvUpload = await supabaseCVService.saveCVUpload(
      token,
      user.id,
      file.name,
      file.size,
      file.type,
      parsed.metadata.wordCount,
      parsed.text,
      parsed.metadata.pageCount,
    )

    console.timeEnd("save-cv")

//   if (uploadErr || !cvUpload) {
//     return NextResponse.json({ error: uploadErr?.message ?? "Failed to save CV" }, { status: 500 });
//   }
  if (!cvUpload) {
    return NextResponse.json({ error: "Failed to save CV" }, { status: 500 });
  }

  // Create job row — webhook will auto-trigger the Edge Function
  const { data: job, error: jobErr } = await supabase
    .from("roast_jobs")
    .insert({
      user_id: user.id,
      cv_upload_id: cvUpload.id,
      roast_tone: roastTone,
      focus_areas: focusAreas,
      show_emojis: showEmojis,
      user_context: {
        targetRole: targetRole || null,
        experience: experience || null,
        industry: industry || null,
      },
    })
    .select("id")
    .single();

  if (jobErr || !job) {
    return NextResponse.json({ error: jobErr?.message ?? "Failed to enqueue job" }, { status: 500 });
  }

  return NextResponse.json(
    { jobId: job.id, cvId: cvUpload.id, metadata: parsed.metadata },
    { status: 202 }
  );
}
