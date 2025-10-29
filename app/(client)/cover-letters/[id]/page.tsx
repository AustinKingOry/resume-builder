"use client"
import { useState, useEffect } from "react"
import { CoverLetterEditor } from "@/components/cover-letters/cover-letter-editor"
import type { CoverLetter } from "@/lib/types/cover-letter"
import { useParams } from "next/navigation"
import { CoverLettersDB } from "@/utils/supabaseClient"
import { useAuth } from "@/components/auth-provider"

export default function ViewCoverLetterPage() {
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const {user, isLoading: userLoading} = useAuth();

  const letter_id = params.id as string

  useEffect(() => {
    if (userLoading && !user?.id) return; // Wait until auth state resolves
    if (!user?.id) return; // If no user, do not load letter

    let isCancelled = false;
    const fetchCoverLetter = async () => {
      setIsLoading(true)
      try {
        const letter = await CoverLettersDB.fetchCoverLetterById(letter_id, user.id);
        if (!isCancelled && letter) {
          setCoverLetter(letter)
        }
      } catch (error) {
        console.error("Failed to load cover letters:", error)
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    fetchCoverLetter()

    return () => {
      isCancelled = true;
    };
  }, [letter_id, user?.id, userLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading cover letter...</p>
        </div>
      </div>
    )
  }

  if (!coverLetter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Cover letter not found</p>
        </div>
      </div>
    )
  }

  return <CoverLetterEditor mode="view" initialData={coverLetter} user={user || undefined} />
}
