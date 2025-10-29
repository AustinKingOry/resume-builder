"use client"

import { useEffect, useState } from "react"
import { CoverLetterEditor } from "@/components/cover-letters/cover-letter-editor"


export default function NewCoverLetterPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true)
      // Simulate API call with 2 second delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsLoading(false)
    }

    initializePage()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing editor...</p>
        </div>
      </div>
    )
  }

  return <CoverLetterEditor mode="create" />
}
