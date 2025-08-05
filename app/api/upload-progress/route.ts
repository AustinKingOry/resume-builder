import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory store for upload progress (in production, use Redis or similar)
const uploadProgress = new Map<string, number>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const uploadId = searchParams.get("uploadId")

  if (!uploadId) {
    return NextResponse.json({ error: "Upload ID required" }, { status: 400 })
  }

  const progress = uploadProgress.get(uploadId) || 0
  return NextResponse.json({ progress })
}

export async function POST(request: NextRequest) {
  const { uploadId, progress } = await request.json()

  if (!uploadId || typeof progress !== "number") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  uploadProgress.set(uploadId, progress)

  // Clean up completed uploads after 5 minutes
  if (progress >= 100) {
    setTimeout(
      () => {
        uploadProgress.delete(uploadId)
      },
      5 * 60 * 1000,
    )
  }

  return NextResponse.json({ success: true })
}