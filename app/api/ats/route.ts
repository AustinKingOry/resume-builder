import { parseCV } from "@/lib/cv-parser"
import {
  analyzeATSCompatibility,
  analyzeKeywordMatch,
  analyzeSkillsMatch,
  generateRecommendations,
} from "@/lib/ats/ai-services"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File
    const jobDescription = formData.get("jobDescription") as string

    if (!resumeFile) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 })
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
