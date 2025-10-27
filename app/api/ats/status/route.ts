import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const atsJobId = searchParams.get("atsJobId");
  if (!atsJobId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: job, error: jobErr } = await supabase
    .from("ats_jobs")
    .select("status, error")
    .eq("id", atsJobId)
    .eq("user_id", user.id)
    .single();

  if (jobErr || !job) {
    console.error(jobErr?.message ?? "Not found");
    return NextResponse.json({ error: jobErr?.message ?? "Not found" }, { status: 404 });
  }

  if (job.status === "completed") {
    const { data: result, error: resErr } = await supabase
      .from("ats_responses")
      .select("*")
      .eq("ats_job_id", atsJobId)
      .single();

    if (resErr || !result) {
      return NextResponse.json({ status: "failed", error: resErr?.message ?? "Missing result" });
    }

    return NextResponse.json({ status: "completed", result });
  }

  return NextResponse.json({ status: job.status, error: job.error ?? null });
}
