import type { NextRequest } from "next/server"
import { parseCV } from "@/lib/cv-parser"
import { streamCVAnalysis } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
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
      return new Response("No file provided", { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      return new Response("Invalid file type", { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return new Response("File too large", { status: 400 })
    }

    // Parse the CV
    const parsedCV = await parseCV(file)

    // Prepare user context
    const userContext =
      targetRole || experience || industry
        ? {
            targetRole: targetRole || undefined,
            experience: experience || undefined,
            industry: industry || undefined,
          }
        : undefined

    // Stream analysis with AI SDK v5
    const result = await streamCVAnalysis({
      cvText: parsedCV.text,
      roastTone,
      focusAreas,
      showEmojis,
      userContext,
    })

    // console.log(result.toTextStreamResponse())

    // Create a custom streaming response
    // const encoder = new TextEncoder()

    // const stream = new ReadableStream({
    //   async start(controller) {
    //     try {
    //       // Send metadata first
    //       const metadataChunk = JSON.stringify({
    //         type: "metadata",
    //         metadata: parsedCV.metadata,
    //       })
    //       controller.enqueue(encoder.encode(metadataChunk + "\n"))

    //       // Stream the AI response
    //       for await (const chunk of result.partialObjectStream) {
    //         const dataChunk = JSON.stringify({
    //           type: "object",
    //           object: chunk,
    //         })
    //         controller.enqueue(encoder.encode(dataChunk + "\n"))
    //         console.log(dataChunk);
    //       }

    //       // Send final usage information
    //       const finalResult = await result.object
    //       const usageChunk = JSON.stringify({
    //         type: "finish",
    //         usage: result.usage,
    //         finishReason: result.finishReason,
    //       })
    //       controller.enqueue(encoder.encode(usageChunk + "\n"))

    //       controller.close()
    //     } catch (error) {
    //       console.error("Streaming error:", error)
    //       const errorChunk = JSON.stringify({
    //         type: "error",
    //         error: error instanceof Error ? error.message : "Unknown error",
    //       })
    //       controller.enqueue(encoder.encode(errorChunk + "\n"))
    //       controller.close()
    //     }
    //   },
    // })

    // return new Response(stream, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-CV-Metadata": JSON.stringify(parsedCV.metadata),
    //     "Cache-Control": "no-cache",
    //     Connection: "keep-alive",
    //   },
    // })

    return result.toTextStreamResponse(
      {
        headers:{"Content-Type": "application/json",
        "X-CV-Metadata": JSON.stringify(parsedCV.metadata),
        "Cache-Control": "no-cache",
        Connection: "keep-alive",}
      },
    );
  } catch (error) {
    console.error("Error in analyze-cv-stream API:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Analysis failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}