import { type NextRequest, NextResponse } from "next/server"
import { parseCV } from "@/lib/cv-parser"
import { analyzeCVWithAI } from "@/lib/ai-services"
import { supabaseCVService } from "@/lib/supabase/server/cv-service"
import { supabaseUsageService } from "@/lib/supabase/server/usage-service"
import { createServerClient } from "@/lib/supabase-server"


export async function POST(request: NextRequest) {
  try {
    // Get current user from server-side auth
    const supabaseAuth = await createServerClient();
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    const roastTone = formData.get("roastTone") as "light" | "heavy"
    const focusAreas = JSON.parse(formData.get("focusAreas") as string)
    const showEmojis = formData.get("showEmojis") === "true"

    // Optional user context
    const targetRole = formData.get("targetRole") as string | null
    const experience = formData.get("experience") as "entry" | "mid" | "senior" | null
    const industry = formData.get("industry") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }


    const {data: {user}, } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Please sign in to analyze your CV" }, { status: 401 })
    }

    const token = (await supabaseAuth.auth.getSession()).data.session?.access_token
    if (!token) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Check usage limits
    const canMakeRequest = await supabaseUsageService.canMakeRequest(token)
    // const canMakeRequest = true;
    console.log("data: ", canMakeRequest)
    if (!canMakeRequest) {
      return NextResponse.json(
        { error: "Daily limit reached. Please upgrade your plan to continue.", code: "USAGE_LIMIT_EXCEEDED" },
        { status: 429 },
      )
    }

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Bro, we need a PDF or Word document (.pdf, .doc, .docx). Other formats won't work well!" },
        { status: 400 },
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Eish! Your file is too big - needs to be under 10MB. Compress it a bit or save as PDF." },
        { status: 400 },
      )
    }

    // Parse the CV
    const startTime = Date.now()
    const parsedCV = await parseCV(file)

    // Save CV upload to database
    const cvUpload = await supabaseCVService.saveCVUpload(
      token,
      user.id,
      file.name,
      file.size,
      file.type,
      parsedCV.metadata.wordCount,
      parsedCV.text,
      parsedCV.metadata.pageCount,
    )

    if (!cvUpload) {
      return NextResponse.json({ error: "Failed to save CV upload" }, { status: 500 })
    }

    // Prepare user context
    const userContext =
      targetRole || experience || industry
        ? {
            targetRole: targetRole || undefined,
            experience: experience || undefined,
            industry: industry || undefined,
          }
        : undefined

    // Analyze with AI SDK v5
    const result = await analyzeCVWithAI({
      cvText: parsedCV.text,
      roastTone,
      focusAreas,
      showEmojis,
      userContext,
    })

    const processingTime = (Date.now() - startTime) / 1000

    
    const roastResponse = await supabaseCVService.saveRoastResponse(token, user.id, cvUpload.id, {
      roastTone,
      focusAreas,
      showEmojis,
      userContext,
      overallFeedback: result.object.overall,
      feedbackPoints: result.object.feedback,
      marketReadiness: result.object.marketReadiness,
      kenyanJobMarketTips: result.object.kenyanJobMarketTips,
      processingTimeSeconds: processingTime,
      aiTokensUsed: result.usage?.totalTokens,
      aiModel: "gemini-2.5-flash",
      finishReason: result.finishReason,
      io_tokens: [result.usage?.inputTokens || 0, result.usage?.outputTokens || 0]
    })

    if (!roastResponse) {
      return NextResponse.json({ error: "Failed to save roast response" }, { status: 500 })
    }

    // Increment usage count
    await supabaseUsageService.incrementUsage(token)

    return NextResponse.json({
      success: true,
      data: {
        id: roastResponse.id,
        overall: result.object.overall,
        feedback: result.object.feedback,
        marketReadiness: result.object.marketReadiness,
        kenyanJobMarketTips: result.object.kenyanJobMarketTips,
        processingTime,
        metadata: parsedCV.metadata,
        usage: result.usage,
        finishReason: result.finishReason,
        createdAt: roastResponse.created_at,
        isComplete: true,
        io_tokens: [result.usage?.inputTokens || 0, result.usage?.outputTokens || 0]
      },
    })
  } catch (error) {
    console.error("Error in analyze-cv-supabase API:", error)

    let errorMessage = "Something went wrong processing your CV. Let's try that again, bana!"
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("configuration")) {
        errorMessage = "AI services are temporarily unavailable. Please try again later."
        statusCode = 503
      } else if (error.message.includes("quota") || error.message.includes("limit")) {
        errorMessage = "AI service is experiencing high demand. Please try again in a few minutes."
        statusCode = 429
      } else if (error.message.includes("network")) {
        errorMessage = "Network error occurred. Please check your connection and try again."
        statusCode = 502
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

