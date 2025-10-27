import { parseCV } from "@/lib/cv-parser"
import {
  analyzeATSCompatibility,
  analyzeKeywordMatch,
  analyzeSkillsMatch,
  generateRecommendations,
} from "@/lib/ats/ai-services"
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const supabaseAuth = await createServerClient();
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File
    const jobDescription = formData.get("jobDescription") as string

    if (!resumeFile) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 })
    }
    
    const {data: {user}, } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Please sign in to use ATS Analyzer" }, { status: 401 })
    }

    const token = (await supabaseAuth.auth.getSession()).data.session?.access_token
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
        { error: "Use a PDF or Word document (.pdf, .doc, .docx). Other formats won't work well!" },
        { status: 400 },
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (resumeFile.size > maxSize) {
      return NextResponse.json(
        { error: "File is too big - needs to be under 10MB. Compress it a bit or save as PDF." },
        { status: 400 },
      )
    }

    // Parse resume
    const resumeData = await parseCV(resumeFile)

    // Analyze using AI
    const [keywordAnalysis, skillsAnalysis, atsCompatibility, recommendations] = await Promise.all([
      analyzeKeywordMatch(resumeData.text, jobDescription),
      analyzeSkillsMatch(resumeData.text, jobDescription),
      analyzeATSCompatibility(resumeData.text, jobDescription),
      generateRecommendations(resumeData.text, jobDescription),
    ])

    // Calculate overall scores
    const overallScore = Math.round(
      (keywordAnalysis.matchPercentage + skillsAnalysis.matchPercentage + atsCompatibility.atsScore) / 3,
    )

    const keywordStrength = keywordAnalysis.matchPercentage
    const skillsMatch = skillsAnalysis.matchPercentage
    const atsReady = atsCompatibility.atsScore

    return NextResponse.json({
      success: true,
      analysis: {
        overallScore,
        keywordStrength,
        skillsMatch,
        atsReady,
        keywords: keywordAnalysis,
        skills: skillsAnalysis,
        atsCompatibility,
        recommendations,
      },
    })
  } catch (error) {
    console.error("ATS Analysis Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze resume",
      },
      { status: 500 },
    )
  }
}
