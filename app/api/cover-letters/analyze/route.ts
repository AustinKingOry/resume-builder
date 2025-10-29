/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import type { AIRequest, AIResponse } from "@/lib/types/cover-letter"
import { analyzeCoverLetter, generateSuggestions } from "@/lib/cover-letters/ai-services"

export async function POST(request: NextRequest): Promise<NextResponse<AIResponse>> {
  try {
    const body: AIRequest = await request.json()

    const { content, customPrompt, jobDescription, company } = body

    if(!content){
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      )
    }

    let suggestions: string[] = []

    if (customPrompt) {
      // Use custom prompt for specific suggestions
      const result = await generateSuggestions(content, customPrompt)
      suggestions = (result.suggestions || []).map((s: any) => (typeof s === "string" ? s : s.suggestedText))
    } else if (jobDescription && company) {
      // Use default analysis with job context
      const analysis = await analyzeCoverLetter(content, jobDescription, company)
      suggestions = analysis.improvements.map((imp) => `${imp.area}: ${imp.suggestion}`)
    } else {
      // Fallback: use custom prompt with generic improvement request
      const result = await generateSuggestions(content, "Provide suggestions to improve this cover letter")
      suggestions = (result.suggestions || []).map((s: any) => (typeof s === "string" ? s : s.suggestedText))
    }

    return NextResponse.json({
      success: true,
      suggestions,
      message: "Analysis completed successfully",
    })
  } catch (error) {
    console.error("Error analyzing cover letter:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze cover letter",
      },
      { status: 500 },
    )
  }
}
