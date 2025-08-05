import { type NextRequest, NextResponse } from "next/server"
import { generateCVImprovements } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const { cvText, targetRole, industry } = await request.json()

    if (!cvText || !targetRole || !industry) {
      return NextResponse.json({ error: "CV text, target role, and industry are required" }, { status: 400 })
    }

    const result = await generateCVImprovements(cvText, targetRole, industry)

    return NextResponse.json({
      success: true,
      data: result.object,
    })
  } catch (error) {
    console.error("Error in generate-improvements API:", error)
    return NextResponse.json({ error: "Failed to generate improvements" }, { status: 500 })
  }
}