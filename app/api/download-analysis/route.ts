// app/api/download-analysis/route.ts
import { CVAnalysisResult } from "@/hooks/use-supabase-cv-analysis";
import { generateFeedbackFromAnalysis } from "@/lib/export-cv-analysis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body: CVAnalysisResult = await req.json(); // should be CVAnalysisResult
  try {
    const { buffer, filename } = await generateFeedbackFromAnalysis(body);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to generate document" }, { status: 500 });
  }
}
