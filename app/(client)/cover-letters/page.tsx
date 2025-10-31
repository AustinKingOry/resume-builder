"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
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
  PenLine,
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
  Building2,
  Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { CoverLettersDB } from "@/utils/supabaseClient"
import { CoverLetter, CoverLetterStatus } from "@/lib/types/cover-letter"
import { formatDate } from "@/lib/helpers"

function getStatusConfig(status: CoverLetterStatus) {
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

function StatsOverview({ letters }: { letters: CoverLetter[] }) {
  const totalLetters = letters.length
  const completeLetters = letters.filter((l) => l.status === "complete").length
  const totalDownloads = letters.reduce((sum, l) => sum + l.downloads, 0)

  const stats = [
    { label: "Total Letters", value: totalLetters, icon: PenLine, color: "from-emerald-500 to-emerald-600" },
    { label: "Complete", value: completeLetters, icon: CheckCircle2, color: "from-sky-500 to-sky-600" },
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

function CoverLetterCard({
  letter,
  onEdit,
  onDelete,
}: {
  letter: CoverLetter
  onEdit: () => void
  onDelete: () => void
}) {
  const { toast } = useToast()
  const statusConfig = getStatusConfig(letter.status)
  const StatusIcon = statusConfig.icon

  function handleDownload() {
    toast({ title: "Downloading...", description: `Downloading ${letter.title}` })
  }

  function handleDuplicate() {
    toast({ title: "Duplicated", description: `Created a copy of ${letter.title}` })
  }

  function handleShare() {
    toast({ title: "Share link copied", description: "Cover letter link copied to clipboard" })
  }

  return (
    <Card className="group relative overflow-hidden border-emerald-600/10 dark:border-emerald-400/10 hover:border-emerald-600/30 dark:hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg">
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-br from-emerald-600 to-sky-600 transition-opacity duration-500" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className={cn("gap-1", statusConfig.color)}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Letter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle className="text-base line-clamp-1">{letter.title}</CardTitle>
        {letter.company && (
          <CardDescription className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{letter.company}</span>
          </CardDescription>
        )}
        {letter.position && (
          <CardDescription className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{letter.position}</span>
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="relative">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{letter.content.substring(0,100)}</p>
          <div className="absolute bottom-0 right-0 left-0 h-8 bg-gradient-to-t from-background to-transparent" />
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground flex items-center justify-between pt-0 border-t">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Updated {formatDate(letter.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          {letter.wordCount && <span>{letter.wordCount} words</span>}
          {letter.downloads > 0 && (
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{letter.downloads}</span>
            </div>
          )}
        </div>
      </CardFooter>

      <div className="px-6 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
          onClick={onEdit}
        >
          <Eye className="h-4 w-4 mr-2" />
          Quick View
        </Button>
      </div>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 grid place-items-center">
        <PenLine className="h-12 w-12 text-emerald-600" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">Write your first cover letter</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Craft compelling, personalized cover letters with AI assistance. Make every application count with
        company-aware, role-specific content.
      </p>
      <Button
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg shadow-emerald-600/20"
        size="lg"
        asChild
      >
        <Link href="/cover-letters/new">
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Cover Letter
        </Link>
      </Button>
      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>AI-Powered</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-600" />
          <span>Company-Aware</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Role-Specific</span>
        </div>
      </div>
    </div>
  )
}

function CoverLetterCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 w-20 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
        </div>
        <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2 dark:bg-muted-foreground" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse dark:bg-muted-foreground" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
          <div className="h-4 w-4/6 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex items-center justify-between pt-0 border-t">
        <div className="h-4 w-24 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
        <div className="h-4 w-16 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
      </CardFooter>
    </Card>
  )
}

function StatsOverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
            <div className="h-4 w-4 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-12 bg-muted rounded animate-pulse dark:bg-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CoverLettersPage() {
  const [letters, setLetters] = useState<CoverLetter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [letterToDelete, setLetterToDelete] = useState<CoverLetter | null>(null)
  const [noLetters, setNoLetters] = useState(false)
  const { toast } = useToast()
  const {user, isLoading: userLoading} = useAuth();

  useEffect(() => {
    if (userLoading && !user?.id) return; // Wait until auth state resolves
    if (!user?.id) return; // If no user, do not load cover letters

    let isCancelled = false;

    const loadLetters = async () => {
      setIsLoading(true);
      try {
        const data = await CoverLettersDB.fetchCoverLettersByUser(10, 0, user.id);
        if (!isCancelled) {
          setLetters(data);
          setNoLetters(data.length == 0)
        }
      } catch (error) {
        console.error("Failed to load cover letters:", error)
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadLetters();

    return () => {
      isCancelled = true;
    };
  }, [user?.id, userLoading])

  const filteredLetters = letters.filter(
    (letter) =>
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.position?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function handleEdit(letter: CoverLetter) {
    toast({ title: "Opening editor...", description: `Editing ${letter.title}` })
  }

  function handleDeleteClick(letter: CoverLetter) {
    setLetterToDelete(letter)
    setDeleteDialogOpen(true)
  }

  function handleDeleteConfirm() {
    if (letterToDelete) {
      setLetters(letters.filter((l) => l.id !== letterToDelete.id))
      toast({
        title: "Cover letter deleted",
        description: `${letterToDelete.title} has been permanently deleted.`,
      })
      setDeleteDialogOpen(false)
      setLetterToDelete(null)
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
                  Cover Letters
                </h1>
                <p className="text-muted-foreground">
                  Create persuasive, tailored cover letters that make your applications stand out
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg shadow-emerald-600/20"
                asChild
              >
                <Link href="/cover-letters/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Letter
                </Link>
              </Button>
            </div>

            {/* Stats Overview - Show skeleton while loading */}
            {isLoading && letters.length == 0 && noLetters ? <StatsOverviewSkeleton /> : <StatsOverview letters={letters} />}
          </div>

          {/* Search and Filters - Disabled while loading */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cover letters by title, company, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                disabled={isLoading && letters.length == 0 && noLetters}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hidden sm:flex bg-transparent" disabled={isLoading && letters.length == 0 && noLetters}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hidden sm:flex bg-transparent" disabled={isLoading && letters.length == 0 && noLetters}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <div className="flex border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                  disabled={isLoading && letters.length == 0 && noLetters}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                  disabled={isLoading && letters.length == 0 && noLetters}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Cover Letters Grid/List - Show skeletons while loading */}
          {isLoading && letters.length == 0 && noLetters ? (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl",
              )}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CoverLetterCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredLetters.length === 0 ? (
            letters.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No cover letters match your search</p>
              </div>
            )
          ) : (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl",
              )}
            >
              {filteredLetters.map((letter) => (
                <CoverLetterCard
                  key={letter.id}
                  letter={letter}
                  onEdit={() => handleEdit(letter)}
                  onDelete={() => handleDeleteClick(letter)}
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
            <DialogTitle>Delete Cover Letter</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to delete "${letterToDelete?.title}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Letter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
