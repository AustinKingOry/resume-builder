export default function NewCoverLetterLoading() {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing editor...</p>
        </div>
      </div>
    )
  }
  