import { NextRequest, NextResponse } from "next/server";
import { parseCV } from "@/lib/cv-parser";
import { createServerClient } from "@/lib/supabase-server";
// import { supabaseATSService } from "@/lib/supabase/server/ats-service";

export async function POST(req: NextRequest) {
    const supabase = await createServerClient();
    const formData = await req.formData()
    const resumeFile = formData.get("resume") as File
    const jobDescription = formData.get("jobDescription") as string

    if (!resumeFile) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 })
    }
    
    const {data: {user}, } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Please sign in to analyze your CV" }, { status: 401 })
    }

    const token = (await supabase.auth.getSession()).data.session?.access_token
    if (!token) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: "Bro, we need a PDF or Word document (.pdf, .doc, .docx). Other formats won't work well!" },
        { status: 400 },
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (resumeFile.size > maxSize) {
      return NextResponse.json(
        { error: "Eish! Your file is too big - needs to be under 10MB. Compress it a bit or save as PDF." },
        { status: 400 },
      )
    }

  // Parse quickly on the server route (should be fast)
  const parsed = await parseCV(resumeFile);

  // Create job row — webhook will auto-trigger the Edge Function
  const { data: job, error: jobErr } = await supabase
    .from("ats_jobs")
    .insert({
      user_id: user.id,
      job_description: jobDescription,
      resume_text: parsed.text,
      status: "processing",
    })
    .select("id")
    .single();

  if (jobErr || !job) {
    return NextResponse.json({ error: jobErr?.message ?? "Failed to enqueue job" }, { status: 500 });
  }

  return NextResponse.json(
    { jobId: job.id, metadata: parsed.metadata },
    { status: 202 }
  );
}
