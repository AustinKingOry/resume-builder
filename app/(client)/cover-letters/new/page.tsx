"use client"

import { CoverLetterEditor } from "@/components/cover-letters/cover-letter-editor"
import { useAuth } from "@/components/auth-provider";


export default function NewCoverLetterPage() {
  const {user, isLoading: userLoading} = useAuth();

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing editor...</p>
        </div>
      </div>
    )
  }

  return <CoverLetterEditor mode="create" user={user || undefined} />
}
