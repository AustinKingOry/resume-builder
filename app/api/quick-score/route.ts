import { type NextRequest, NextResponse } from "next/server"
import { getQuickCVScore } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const { cvText } = await request.json()

    if (!cvText || typeof cvText !== "string") {
      return NextResponse.json({ error: "CV text is required" }, { status: 400 })
    }

    const result = await getQuickCVScore(cvText)

    return NextResponse.json({
      success: true,
      data: result.object,
    })
  } catch (error) {
    console.error("Error in quick-score API:", error)
    return NextResponse.json({ error: "Failed to get CV score" }, { status: 500 })
  }
}