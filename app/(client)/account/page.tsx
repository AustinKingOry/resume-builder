"use client"

import { AlertDialogTrigger } from "@/components/ui/alert-dialog"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  MapPin,
  Camera,
  Save,
  X,
  Lock,
  Bell,
  CreditCard,
  Download,
  AlertTriangle,
  Check,
  Crown,
  Zap,
  Sparkles,
  ChevronRight,
  Calendar,
  FileText,
  Shield,
  Loader2,
} from "lucide-react"

interface BillingHistory {
  id: string
  invoiceId: string
  amount: string
  method: string
  date: string
  status: "success" | "failed" | "pending"
}

const billingHistory: BillingHistory[] = [
  {
    id: "1",
    invoiceId: "INV-2024-001",
    amount: "KSh 500",
    method: "M-Pesa",
    date: "2024-01-15",
    status: "success",
  },
  {
    id: "2",
    invoiceId: "INV-2023-012",
    amount: "KSh 500",
    method: "M-Pesa",
    date: "2023-12-15",
    status: "success",
  },
  {
    id: "3",
    invoiceId: "INV-2023-011",
    amount: "KSh 500",
    method: "Visa •••• 4242",
    date: "2023-11-15",
    status: "success",
  },
]

function DashboardHeader() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 grid place-items-center text-white font-bold">
            K
          </div>
          <span className="text-lg font-semibold">Kazikit</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/resumes" className="text-sm text-muted-foreground hover:text-foreground">
            My Resumes
          </Link>
          <Link href="/cover-letters" className="text-sm text-muted-foreground hover:text-foreground">
            Cover Letters
          </Link>
          <Link href="/profile" className="text-sm font-medium">
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/status">Status</Link>
          </Button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-600 to-sky-600 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

function ProfileOverview() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "Amina Ochieng",
    title: "Senior Software Engineer",
    bio: "Passionate about building scalable web applications that serve African markets. 5+ years of experience in full-stack development with a focus on React, Node.js, and cloud infrastructure.",
    location: "Nairobi, Kenya",
    timezone: "Africa/Nairobi (GMT+3)",
  })

  function handleSave() {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully",
      })
    }, 1000)
  }

  function handleCancel() {
    setIsEditing(false)
    toast({
      title: "Changes discarded",
      description: "Your profile was not modified",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-600 to-sky-600 flex items-center justify-center text-white text-2xl font-bold">
                AO
              </div>
              {isEditing && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and professional information</CardDescription>
            </div>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="bg-transparent">
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value="amina.ochieng@example.com" disabled className="bg-muted" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={!isEditing}
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            className="min-h-[100px]"
            placeholder="Tell us about your experience and expertise..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Time Zone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              disabled={!isEditing}
            >
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Nairobi (GMT+3)">Africa/Nairobi (GMT+3)</SelectItem>
                <SelectItem value="Africa/Lagos (GMT+1)">Africa/Lagos (GMT+1)</SelectItem>
                <SelectItem value="Africa/Johannesburg (GMT+2)">Africa/Johannesburg (GMT+2)</SelectItem>
                <SelectItem value="Africa/Cairo (GMT+2)">Africa/Cairo (GMT+2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AccountSettings() {
  const { toast } = useToast()
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [notifications, setNotifications] = useState({
    marketing: true,
    updates: true,
    tips: false,
    security: true,
  })

  function handlePasswordChange() {
    setPasswordDialogOpen(false)
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    })
  }

  function handleToggle2FA() {
    setTwoFactorEnabled(!twoFactorEnabled)
    toast({
      title: twoFactorEnabled ? "2FA disabled" : "2FA enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been turned off"
        : "Two-factor authentication is now active",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Settings
        </CardTitle>
        <CardDescription>Manage your security preferences and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Password</Label>
              <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
            </div>
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-transparent">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>Enter your current password and choose a new secure password</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePasswordChange}
                    className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white"
                  >
                    Update Password
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
          </div>
        </div>

        <Separator />

        {/* Notifications */}
        <div className="space-y-4">
          <div>
            <Label className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground mt-1">{`Choose what updates you'd like to receive`}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing & Promotions</Label>
                <p className="text-sm text-muted-foreground">Offers, tips, and product updates</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Platform Updates</Label>
                <p className="text-sm text-muted-foreground">New features and improvements</p>
              </div>
              <Switch
                checked={notifications.updates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Tips & Insights</Label>
                <p className="text-sm text-muted-foreground">Career advice and writing tips</p>
              </div>
              <Switch
                checked={notifications.tips}
                onCheckedChange={(checked) => setNotifications({ ...notifications, tips: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Account security notifications</p>
              </div>
              <Switch
                checked={notifications.security}
                onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                disabled
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SubscriptionBilling() {
  const { toast } = useToast()
  const currentPlan = "hustler" // hustler, pro, free

  function getPlanIcon(plan: string) {
    switch (plan) {
      case "pro":
        return Crown
      case "hustler":
        return Zap
      default:
        return Sparkles
    }
  }

  function getPlanColor(plan: string) {
    switch (plan) {
      case "pro":
        return "from-purple-500 to-purple-600"
      case "hustler":
        return "from-emerald-500 to-emerald-600"
      default:
        return "from-sky-500 to-sky-600"
    }
  }

  function getStatusColor(status: BillingHistory["status"]) {
    switch (status) {
      case "success":
        return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950"
      case "failed":
        return "text-red-600 bg-red-50 dark:bg-red-950"
      case "pending":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950"
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Manage your subscription and billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`h-12 w-12 rounded-lg bg-gradient-to-br ${getPlanColor(currentPlan)} flex items-center justify-center text-white`}
              >
                {(() => {
                  const Icon = getPlanIcon(currentPlan)
                  return <Icon className="h-6 w-6" />
                })()}
              </div>
              <div>
                <h3 className="text-xl font-semibold capitalize">{currentPlan} Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">Perfect for active job seekers</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Renews on Feb 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-semibold">KSh 500</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() =>
                  toast({
                    title: "Upgrade available",
                    description: "Check out our Professional plan for advanced features",
                  })
                }
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Opening billing portal",
                    description: "Redirecting to manage your subscription...",
                  })
                }
              >
                Manage Billing
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Plan Features */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>50 CV roasts per day</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Priority AI processing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Export to PDF & Word</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Email support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>LinkedIn optimization</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Kenya job insights</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices and payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.invoiceId}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.method}</span>
                      <span>•</span>
                      <span>
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{item.amount}</span>
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DangerZone() {
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  function handleExportData() {
    toast({
      title: "Preparing export",
      description: "Your data will be downloaded shortly",
    })
  }

  function handleDeleteAccount() {
    setDeleteDialogOpen(false)
    toast({
      title: "Account deletion cancelled",
      description: "Your account is safe",
    })
  }

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Irreversible actions that affect your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-900">
          <div>
            <h4 className="font-medium">Export Account Data</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Download all your resumes, cover letters, and profile information
            </p>
          </div>
          <Button variant="outline" onClick={handleExportData} className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
          <div>
            <h4 className="font-medium text-red-600 dark:text-red-400">Delete Account</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete your account and all associated data
            </p>
          </div>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers, including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All resumes and cover letters</li>
                    <li>Profile information and settings</li>
                    <li>Billing history and subscription</li>
                    <li>AI interaction history</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  return (
    <>
      <DashboardHeader />

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
              Account & Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your personal information, security settings, and subscription
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="danger" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Danger</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileOverview />
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <AccountSettings />
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <SubscriptionBilling />
            </TabsContent>

            <TabsContent value="danger" className="space-y-6">
              <DangerZone />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
