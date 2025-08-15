import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const cv_id = searchParams.get("cv_id");
  if (!cv_id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: job, error: jobErr } = await supabase
    .from("roast_jobs")
    .select("status, error_message")
    .eq("cv_upload_id", cv_id)
    .eq("user_id", user.id)
    .single();

  if (jobErr || !job) {
    console.error(jobErr?.message ?? "Not found");
    return NextResponse.json({ error: jobErr?.message ?? "Not found" }, { status: 404 });
  }

  if (job.status === "succeeded") {
    const { data: result, error: resErr } = await supabase
      .from("roast_responses")
      .select("*")
      .eq("cv_upload_id", cv_id)
      .single();

    if (resErr || !result) {
      return NextResponse.json({ status: "failed", error: resErr?.message ?? "Missing result" });
    }

    return NextResponse.json({ status: "succeeded", result });
  }

  return NextResponse.json({ status: job.status, error: job.error_message ?? null });
}
