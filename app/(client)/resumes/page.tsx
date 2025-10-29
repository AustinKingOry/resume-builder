"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  FileText,
  MoreVertical,
  Edit,
  Download,
  Copy,
  Trash2,
  Share2,
  Search,
  Calendar,
  Eye,
  Sparkles,
  Filter,
  Grid3x3,
  List,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ResumeDB } from "@/utils/supabaseClient"
import { useAuth } from "@/components/auth-provider"
import { ResumeDataDb, ResumeStatus } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"


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

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function getStatusConfig(status: ResumeStatus) {
  switch (status) {
    case "complete":
      return {
        label: "Complete",
        icon: CheckCircle2,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
      }
    case "draft":
      return {
        label: "Draft",
        icon: Clock,
        color: "text-sky-600 bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800",
      }
    case "needs-review":
      return {
        label: "Needs Review",
        icon: AlertCircle,
        color: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
      }
  }
}

function StatsOverview({ resumes }: { resumes: ResumeDataDb[] }) {
  const totalResumes = resumes.length
  const completeResumes = resumes.filter((r) => r.status === "complete").length
  const totalDownloads = resumes.reduce((sum, r) => sum + r.downloads, 0)

  const stats = [
    { label: "Total Resumes", value: totalResumes, icon: FileText, color: "from-emerald-500 to-emerald-600" },
    { label: "Complete", value: completeResumes, icon: CheckCircle2, color: "from-sky-500 to-sky-600" },
    { label: "Downloads", value: totalDownloads, icon: Download, color: "from-purple-500 to-purple-600" },
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

function ResumeCard({ resume, onEdit, onDelete }: { resume: ResumeDataDb; onEdit: () => void; onDelete: () => void }) {
  const { toast } = useToast()
  const statusConfig = getStatusConfig(resume.status)
  const StatusIcon = statusConfig.icon
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  function handleDownload() {
    toast({ title: "Downloading...", description: `Downloading ${resume.title}` })
  }

  function handleDuplicate() {
    toast({ title: "Duplicated", description: `Created a copy of ${resume.title}` })
  }

  function handleShare() {
    toast({ title: "Share link copied", description: "Resume link copied to clipboard" })
  }

  return (
    <Card className="group relative overflow-hidden border-emerald-600/10 dark:border-emerald-400/10 hover:border-emerald-600/30 dark:hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg">
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-br from-emerald-600 to-sky-600 transition-opacity duration-500" />

      <div className="relative aspect-square overflow-hidden bg-muted rounded-t-lg max-h-80">
        <Link href={`/resumes/builder/${resume.id}`} className="w-full h-full">
          <Image
            src={resume.thumbnail || "/placeholder.svg?height=400&width=300"}
            alt={`${resume.title} preview`}
            fill
            className="object-cover"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          <Badge variant="outline" className={cn("gap-1", statusConfig.color)}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>

          <DropdownMenu open={openDropdownId === resume.id} onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? resume.id! : null)}>
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
              <DropdownMenuItem asChild>
                <Link href={`/resumes/builder/${resume.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Resume
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {setOpenDropdownId(null);handleDownload()}}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {setOpenDropdownId(null);handleDuplicate()}}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {setOpenDropdownId(null);handleShare()}}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {setOpenDropdownId(null);onDelete()}} className="text-red-600 dark:text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute bottom-2 left-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full bg-background/80 backdrop-blur hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onEdit}
          >
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-base line-clamp-1"><Link href={`/resumes/builder/${resume.id}`}>{resume.title}</Link></CardTitle>
        {resume.data.personalInfo.title && <CardDescription className="line-clamp-1">{resume.data.personalInfo.title}</CardDescription>}
      </CardHeader>

      <CardFooter className="text-xs text-muted-foreground flex items-center justify-between pt-0">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Updated {resume.updated_at ?formatDate(`${resume.updated_at}`) : "Unknown"}</span>
        </div>
        {resume.downloads > 0 && (
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span>{resume.downloads}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 grid place-items-center">
        <FileText className="h-12 w-12 text-emerald-600" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">Start building your first resume</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Create a professional resume with our AI-powered builder. Stand out with impact-driven content that gets you
        noticed.
      </p>
      <Button
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg shadow-emerald-600/20"
        size="lg"
        asChild
      >
        <Link href="/resumes/new">
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Resume
        </Link>
      </Button>
      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>AI-Powered</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>ATS-Friendly</span>
        </div>
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-emerald-600" />
          <span>Export to PDF</span>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-3">Or start with a template</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/resumes/templates">Browse Templates</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/resumes/import">Import Existing Resume</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const LoadingState = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-square max-h-80 bg-muted">
            <Skeleton className="h-full w-full" />
          </div>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeDataDb[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<ResumeDataDb | null>(null)
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [deletingResume, setDeletingResume] = useState(false);
  const { toast } = useToast()
  const {user, isLoading} = useAuth();
    
  useEffect(() => {
    if (isLoading && !user?.id) return; // Wait until auth state resolves
    if (!user?.id) return; // If no user, do not load resumes

    let isCancelled = false;

    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const resumes = await ResumeDB.fetchResumesByUser(10, 0, user.id);
        if (!isCancelled) setResumes(resumes);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        if (!isCancelled) setLoadingResumes(false);
      }
    };

    loadResumes();

    return () => {
      isCancelled = true;
    };
  }, [user, isLoading]);

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.data.personalInfo.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function handleEdit(resume: ResumeDataDb) {
    toast({ title: "Opening editor...", description: `Editing ${resume.title}` })
  }

  function handleDeleteClick(resume: ResumeDataDb) {
    setResumeToDelete(resume)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if(!user){
      return;
    }
    if (resumeToDelete) {
      setDeletingResume(true)
      setResumes(resumes.filter((r) => r.id !== resumeToDelete.id))
      await ResumeDB.deleteResume(resumeToDelete.id, user.id);
      toast({
        title: "Resume deleted",
        description: `${resumeToDelete.title} has been permanently deleted.`,
      })
      setDeletingResume(false)
      setDeleteDialogOpen(false)
      setResumeToDelete(null)
    }
  }

  // ✅ Handle auth and loading states cleanly
  if (isLoading && !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your resumes.</p>
      </main>
    );
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
                  My Resumes
                </h1>
                <p className="text-muted-foreground">
                  Manage your professional resumes and track your career materials in one place
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg shadow-emerald-600/20"
                asChild
              >
                <Link href="/resumes/builder">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Resume
                </Link>
              </Button>
            </div>

            {/* Stats Overview */}
            <StatsOverview resumes={resumes} />
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resumes by title or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hidden sm:flex bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hidden sm:flex bg-transparent">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <div className="flex border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resumes Grid/List */}
          { loadingResumes && !resumes ? 
          <LoadingState /> 
          :
          filteredResumes.length === 0 ? (
            resumes.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No resumes match your search</p>
              </div>
            )
          ) : (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
              )}
            >
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => handleEdit(resume)}
                  onDelete={() => handleDeleteClick(resume)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to delete "${resumeToDelete?.title}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deletingResume}>
              {deletingResume ? 
              <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Deleting Resume...
              </>:
              <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Resume
              </>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
