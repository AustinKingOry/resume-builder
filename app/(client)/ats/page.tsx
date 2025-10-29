"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  Calendar,
  Eye,
  Zap,
  Filter,
  Grid3x3,
  List,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { AtsDB } from "@/utils/supabaseClient"
import { ATSTest, TestStatus } from "@/lib/types"


// Helper functions
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 24) {
    if (diffInHours < 1) return "Just now"
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getStatusConfig(status: TestStatus) {
  switch (status) {
    case "passed":
      return {
        label: "Passed",
        icon: CheckCircle2,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
      }
    case "needs-improvement":
      return {
        label: "Needs Improvement",
        icon: AlertCircle,
        color: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
      }
    case "pending":
      return {
        label: "Pending",
        icon: Zap,
        color: "text-sky-600 bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800",
      }
  }
}

function StatsOverview({ tests }: { tests: ATSTest[] }) {
  const totalTests = tests.length
  const passedTests = tests.filter((t) => t.summary.status === "passed").length
  const avgScore = tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + t.summary.overallScore, 0) / tests.length) : 0;

  const stats = [
    { label: "Total Tests", value: totalTests, icon: FileText, color: "from-emerald-500 to-emerald-600" },
    { label: "Passed", value: passedTests, icon: CheckCircle2, color: "from-sky-500 to-sky-600" },
    { label: "Avg Score", value: `${avgScore}%`, icon: TrendingUp, color: "from-purple-500 to-purple-600" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="relative overflow-hidden">
          <div
            className={cn(
              "absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br",
              stat.color,
            )}
          />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ATSTestCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/4] bg-muted animate-pulse rounded-t-lg" />
      <CardHeader className="pb-2">
        <div className="h-4 bg-muted rounded animate-pulse mb-2" />
        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full animate-pulse" />
          <div className="h-2 bg-muted rounded-full animate-pulse w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

function ATSTestCard({
  test,
  onEdit,
  onDelete,
  onViewDetails,
}: {
  test: ATSTest
  onEdit: () => void
  onDelete: () => void
  onViewDetails: () => void
}) {
  const { toast } = useToast()
  const statusConfig = getStatusConfig(test.summary.status)
  const StatusIcon = statusConfig.icon
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  function handleShare() {
    toast({ title: "Share link copied", description: "Test results link copied to clipboard" })
  }

  function handleExport() {
    toast({ title: "Exporting...", description: `Exporting ${test.summary.resumeTitle} results` })
  }

  return (
    <Card className="group relative overflow-hidden border-emerald-600/10 dark:border-emerald-400/10 hover:border-emerald-600/30 dark:hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg">
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-br from-emerald-600 to-sky-600 transition-opacity duration-500" />

      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-t-lg">
        <Image
          src={test.summary.thumbnail || "/placeholder.svg?height=400&width=300"}
          alt={`${test.summary.resumeTitle} preview`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          <Badge variant="outline" className={cn("gap-1", statusConfig.color)}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>

          <DropdownMenu  open={openDropdownId === test.id} onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? test.id! : null)}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-background/80 backdrop-blur hover:bg-background"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={()=>{setOpenDropdownId(null);onViewDetails();}}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setOpenDropdownId(null);onEdit()}}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Job Description
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setOpenDropdownId(null);handleExport()}}>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setOpenDropdownId(null);handleShare()}}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=>{setOpenDropdownId(null);onDelete()}} className="text-red-600 dark:text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Test
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute bottom-2 left-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full bg-background/80 backdrop-blur hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onViewDetails}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Results
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <Link href={`/ats-analyzer/${test.id}`} className="inline-block">
        <CardTitle className="text-base line-clamp-1">{test.summary.resumeTitle}</CardTitle>
        <CardDescription className="line-clamp-1">{test.summary.candidateName}</CardDescription>
        </Link>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Score</span>
            <span className="font-semibold text-emerald-600">{test.summary.overallScore}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-500"
              style={{ width: `${test.summary.overallScore}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardContent className="pt-0 pb-3 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Tested {formatDate(test.summary.testDate)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function EditJobDescriptionDialog({
  open,
  test,
  onOpenChange,
  onSave,
}: {
  open: boolean
  test: ATSTest | null
  onOpenChange: (open: boolean) => void
  onSave: (jobDescription: string) => void
}) {
  const [jobDescription, setJobDescription] = useState(test?.job_description || "")

  const handleSave = () => {
    onSave(jobDescription)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Job Description</DialogTitle>
          <DialogDescription>Update the job description for this ATS test</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Job Title</label>
            <Input value={test?.summary.jobTitle || ""} disabled className="bg-muted" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
              className="w-full h-64 rounded-lg border border-input bg-background p-3 font-mono text-sm placeholder-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ViewDetailsDialog({
  open,
  test,
  onOpenChange,
}: {
  open: boolean
  test: ATSTest | null
  onOpenChange: (open: boolean) => void
}) {
  if (!test) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Results Details</DialogTitle>
          <DialogDescription>{test.summary.resumeTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Candidate Name</p>
              <p className="font-semibold">{test.summary.candidateName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Job Title</p>
              <p className="font-semibold">{test.summary.jobTitle}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Test Date</p>
              <p className="font-semibold">{new Date(test.summary.testDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={cn("mt-1", getStatusConfig(test.summary.status).color)}>
                {getStatusConfig(test.summary.status).label}
              </Badge>
            </div>
          </div>

          {/* Scores */}
          <div className="space-y-3">
            <h4 className="font-semibold">Score Breakdown</h4>
            {[
              { label: "Overall Score", score: test.summary.overallScore },
              { label: "Keyword Match", score: test.summary.keywordMatch },
              { label: "Skills Match", score: test.summary.skillsMatch },
              { label: "ATS Ready", score: test.summary.atsReady },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-semibold text-emerald-600">{item.score}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-sky-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Job Description Preview */}
          <div>
            <h4 className="font-semibold mb-2">Job Description</h4>
            <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground max-h-40 overflow-y-auto">
              {test.job_description}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main Page
export default function ATSManagementPage() {
  const [tests, setTests] = useState<ATSTest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<ATSTest | null>(null)
  const { toast } = useToast()
  const {user, isLoading: userLoading} = useAuth();

  useEffect(() => {
    if (userLoading) return; // Wait until auth state resolves
    if (!user?.id) return; // If no user, do not load resumes

    let isCancelled = false;

    const loadAtsTests = async () => {
      setIsLoading(true);
      try {
        const data = await AtsDB.fetchAtsTestsByUser(10, 0, user.id);
        if (!isCancelled) setTests(data);
      } catch (error) {
        console.error("Failed to load tests:", error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    // const loadTests = async () => {
    //   setIsLoading(true)
    //   const data = await fetchATSTests()
    //   setTests(data)
    //   setIsLoading(false)
    // }

    // loadTests()

    loadAtsTests();

    return () => {
      isCancelled = true;
    };
  }, [user, userLoading])

  const filteredTests = tests.filter(
    (test) =>
      test.summary.resumeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.summary.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.summary.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function handleEditClick(test: ATSTest) {
    setSelectedTest(test)
    setEditDialogOpen(true)
  }

  function handleViewDetails(test: ATSTest) {
    setSelectedTest(test)
    setDetailsDialogOpen(true)
  }

  function handleDeleteClick(test: ATSTest) {
    setSelectedTest(test)
    setDeleteDialogOpen(true)
  }

  function handleSaveJobDescription(jobDescription: string) {
    if (selectedTest) {
      setTests(tests.map((t) => (t.id === selectedTest.id ? { ...t, jobDescription } : t)))
      toast({
        title: "Job description updated",
        description: "The job description has been successfully updated.",
      })
    }
  }

  function handleDeleteConfirm() {
    if (selectedTest) {
      setTests(tests.filter((t) => t.id !== selectedTest.id))
      toast({
        title: "Test deleted",
        description: `${selectedTest.summary.resumeTitle} has been permanently deleted.`,
      })
      setDeleteDialogOpen(false)
      setSelectedTest(null)
    }
  }

  return (
    <>

      <main className="relative overflow-x-hidden min-h-screen">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                  ATS Test Management
                </h1>
                <p className="text-muted-foreground">Manage and track all your ATS analyzer tests in one place</p>
              </div>
              <Button
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg shadow-emerald-600/20"
                asChild
              >
                <Link href="/ats-analyzer">
                  <Plus className="h-4 w-4 mr-2" />
                  New Test
                </Link>
              </Button>
            </div>

            {/* Stats Overview - Show loading state or actual stats */}
            {isLoading && tests.length == 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-24" />
                      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 bg-muted rounded animate-pulse w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <StatsOverview tests={tests} />
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by resume, candidate, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                disabled={isLoading && tests.length == 0}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hidden sm:flex bg-transparent" disabled={isLoading && tests.length == 0}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hidden sm:flex bg-transparent" disabled={isLoading && tests.length == 0}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <div className="flex border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                  disabled={isLoading && tests.length == 0}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                  disabled={isLoading && tests.length == 0}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tests Grid/List - Show loading skeletons or content */}
          {isLoading && tests.length == 0 ? (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
              )}
            >
              {[1, 2, 3, 4].map((i) => (
                <ATSTestCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredTests.length === 0 ? (
            tests.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 grid place-items-center">
                  <Zap className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No ATS tests yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start by running your first ATS analysis to see how your resume matches job descriptions.
                </p>
                <Button
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg shadow-emerald-600/20"
                  size="lg"
                  asChild
                >
                  <Link href="/ats-analyzer">
                    <Zap className="h-4 w-4 mr-2" />
                    Run Your First Test
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No tests match your search</p>
              </div>
            )
          ) : (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
              )}
            >
              {filteredTests.map((test) => (
                <ATSTestCard
                  key={test.id}
                  test={test}
                  onEdit={() => handleEditClick(test)}
                  onDelete={() => handleDeleteClick(test)}
                  onViewDetails={() => handleViewDetails(test)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Job Description Dialog */}
      <EditJobDescriptionDialog
        open={editDialogOpen}
        test={selectedTest}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveJobDescription}
      />

      {/* View Details Dialog */}
      <ViewDetailsDialog open={detailsDialogOpen} test={selectedTest} onOpenChange={setDetailsDialogOpen} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete ATS Test</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to delete the test for "${selectedTest?.summary.resumeTitle}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
