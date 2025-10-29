import { type NextRequest, NextResponse } from "next/server"
import type { AIRequest, AIResponse } from "@/lib/types/cover-letter"
import { generateCoverLetter } from "@/lib/cover-letters/ai-services"

export async function POST(request: NextRequest): Promise<NextResponse<AIResponse>> {
  try {
    const body: AIRequest = await request.json()

    const { jobDescription, company, position, tone = "professional" } = body

    if (!jobDescription || !company || !position) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const result = await generateCoverLetter(
      jobDescription,
      company,
      position,
      tone as "professional" | "creative" | "formal" | "friendly",
    )

    return NextResponse.json({
      success: true,
      content: result.content,
      message: "Cover letter generated successfully",
    })
  } catch (error) {
    console.error("Error generating cover letter:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate cover letter",
      },
      { status: 500 },
    )
  }
}
