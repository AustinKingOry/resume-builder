"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ATSAnalysisResult } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"
import { AtsDB } from "@/utils/supabaseClient"
import { formatATSAnalysisResult } from "@/lib/helpers"
import AnalysisResults from "@/components/ats/AnalysisResults"

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-2 border-slate-200 dark:border-slate-800">
            <CardContent className="pt-6">
              <Skeleton className="mb-3 h-6 w-12" />
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-slate-200 dark:border-slate-800">
        <Skeleton className="h-12 w-full rounded-t-lg" />
        <CardContent className="space-y-4 pt-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
)

export default function ATSDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
    const {user, isLoading: userLoading} = useAuth();

  const testId = params.id as string

  useEffect(() => {
    if (userLoading) return; // Wait until auth state resolves
    if (!user?.id) return; // If no user, do not load resumes

    let isCancelled = false;
    
    const fetchAnalysis = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await AtsDB.fetchTestAnalyis(testId);
        if (!data) {
          setError("Test analysis not found")
          return
        }
        const result = formatATSAnalysisResult(data)
        if (!isCancelled) setAnalysis(result);
      } catch (error) {
        console.error("Failed to load tests:", error);
        setError(error instanceof Error ? error.message : "Failed to load analysis")
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchAnalysis()

    return () => {
      isCancelled = true;
    };
  }, [testId, user?.id, userLoading])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl">
          <Button onClick={() => router.back()} variant="outline" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="flex gap-3 pt-6">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300">{error || "Analysis not found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <Button onClick={() => router.back()} variant="outline" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
          </div>
        </div>

        <AnalysisResults analysis={analysis} isNew={false} />
      </div>
    </div>
  )
}
