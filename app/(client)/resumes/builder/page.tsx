"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Sparkles, Eye, Loader2, Wand2, Target, Zap, ArrowLeft, CheckCircle2, Share2, MoreVertical, History, Copy } from "lucide-react"
import RedesignedResumeForm from "@/components/redesigned-resume-form"
import type { ResumeData, ResumeDataDb, ResumeTemplate } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"
import ResumePreview from "@/components/ResumePreview"
import { useAuth } from "@/components/auth-provider"
import { ResumeDB } from "@/utils/supabaseClient"
import { debounce } from "lodash"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const initialResumeData: ResumeDataDb = {
	id: "",
	user_id: "",
	data: {
		selectedTemplate: "milan",
		personalInfo: {
			name: "",
			title: "",
			email: "",
			phone: "",
			location: "",
			website: "",
			photo: "",
			gender: "",
			socialMedia: {},
		},
		summary: "",
		experience: [
			{
			title: "",
			company: "",
			startDate: "",
			endDate: "",
			location: "",
			description: "",
			current: false,
			},
		],
		education: [],
		skills: [],
		skillLevels: {},
		certifications: [],
		referees: [],
	},
	title: "",
	template_id: "",
	downloads: 0,
	status: "draft",
}


const aiSuggestions = [
	{
	  id: "1",
	  text: "Add quantifiable metrics to your job descriptions",
	  action: "add-metrics",
	},
	{
	  id: "2",
	  text: "Strengthen action verbs in your experience section",
	  action: "action-verbs",
	},
	{
	  id: "3",
	  text: "Include relevant keywords from job description",
	  action: "keywords",
	},
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AIAssistantPanel() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

  function handleQuickAction(label: string) {
	setIsProcessing(true)
	toast("AI is working...",{	  
	  description: label,
	})
	setTimeout(() => {
	  setIsProcessing(false)
	  toast("Done!",{
		description: "Your resume has been updated",
	  })
	}, 2000)
  }

  function handleCustomPrompt() {
	if (!customPrompt.trim()) return
	setIsProcessing(true)
	toast("Processing...",{
	  description: "Applying your request",
	})
	setTimeout(() => {
	  setIsProcessing(false)
	  setCustomPrompt("")
	  toast("Updated!",{
		description: "Changes applied to your resume",
	  })
	}, 2000)
  }

  return (
	<div className="h-full flex flex-col bg-gradient-to-b from-background/50 to-background/30 rounded-lg border">
	  <div className="p-4 border-b">
		<div className="flex items-center gap-2">
		  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 grid place-items-center">
			<Sparkles className="h-4 w-4 text-white" />
		  </div>
		  <div>
			<h3 className="font-semibold text-sm">AI Optimizer</h3>
			<p className="text-xs text-muted-foreground">Improve your resume</p>
		  </div>
		</div>
	  </div>

	  <div className="flex-1 overflow-auto p-4 space-y-4">
		{/* Quick Actions */}
		<div>
		  <Label className="text-xs font-medium mb-2 flex items-center gap-1">
			<Zap className="h-3 w-3" />
			Quick Fixes
		  </Label>
		  <div className="space-y-2">
			<Button
			  variant="outline"
			  size="sm"
			  className="w-full justify-start bg-transparent text-xs"
			  onClick={() => handleQuickAction("Adding action verbs...")}
			  disabled={isProcessing}
			>
			  <Wand2 className="h-3 w-3 mr-2" />
			  Strengthen language
			</Button>
			<Button
			  variant="outline"
			  size="sm"
			  className="w-full justify-start bg-transparent text-xs"
			  onClick={() => handleQuickAction("Adding metrics...")}
			  disabled={isProcessing}
			>
			  <Target className="h-3 w-3 mr-2" />
			  Add metrics & numbers
			</Button>
			<Button
			  variant="outline"
			  size="sm"
			  className="w-full justify-start bg-transparent text-xs"
			  onClick={() => handleQuickAction("Optimizing for ATS...")}
			  disabled={isProcessing}
			>
			  <FileText className="h-3 w-3 mr-2" />
			  ATS optimization
			</Button>
		  </div>
		</div>

		<Separator />

		{/* Suggestions */}
		<div>
		  <Label className="text-xs font-medium mb-2 flex items-center gap-1">
			<Sparkles className="h-3 w-3" />
			Suggestions
		  </Label>
		  <div className="space-y-2">
			{aiSuggestions.map((suggestion) => (
			  <div
				key={suggestion.id}
				className="p-2 rounded border bg-card text-xs hover:border-emerald-500/50 cursor-pointer transition-colors"
			  >
				<p>{suggestion.text}</p>
			  </div>
			))}
		  </div>
		</div>

		<Separator />

		{/* Custom Prompt */}
		<div>
		  <Label className="text-xs font-medium mb-2">Ask AI...</Label>
		  <Textarea
			placeholder="e.g., 'Make this role sound more technical' or 'Add impact to this achievement'"
			value={customPrompt}
			onChange={(e) => setCustomPrompt(e.target.value)}
			className="min-h-[80px] text-xs"
			disabled={isProcessing}
		  />
		  <Button
			size="sm"
			className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-sky-600 text-white"
			onClick={handleCustomPrompt}
			disabled={isProcessing || !customPrompt.trim()}
		  >
			{isProcessing ? (
			  <>
				<Loader2 className="h-3 w-3 mr-2 animate-spin" />
				Processing...
			  </>
			) : (
			  <>
				<Sparkles className="h-3 w-3 mr-2" />
				Optimize
			  </>
			)}
		  </Button>
		</div>
	  </div>
	</div>
  )
}

export default function ResumeBuilder() {
	const [resumeData, setResumeData] = useState<ResumeDataDb>(initialResumeData)
	const [activeTab, setActiveTab] = useState("form")
	const [loadingData, setLoadingData] = useState<boolean>(true);
	const [resumeId, setResumeId] = useState<string | null>(null);
	const [lastSyncedData, setLastSyncedData] = useState<ResumeDataDb | null>(null);
	const [isSaving, setIsSaving] = useState(false)
	const [lastSaved, setLastSaved] = useState(new Date())
	const [documentTitle, setDocumentTitle] = useState("New Resume")
	const {user} = useAuth();
		
	useEffect(() => {
		const loadData = async ()=>{
			setLoadingData(true);
			try {
				// Load data from local storage when the component mounts
				const savedData = localStorage.getItem("resumeData")
				if (savedData) {
				setResumeData(JSON.parse(savedData))
				}
				
			} catch (error) {
				console.error(`Failed to load local data: `, error)
			} finally {
				setLoadingData(false);
			}
		}

		loadData();
	}, [])

	useEffect(() => {
		const loadResume = async () => {
			if (!user?.id) return;
			const resumes = await ResumeDB.fetchResumesByUser(1, 0, user.id);
			if (resumes.length > 0) {
				setResumeData(resumes[0]);
				setResumeId(resumes[0].id);
				setLastSyncedData(resumes[0]);
				setDocumentTitle(resumes[0].title)
				localStorage.setItem("resumeData", JSON.stringify(resumes[0]))
			}
		};
		loadResume();
	}, [user]);
	

	const syncResumeToDB = async (data: ResumeDataDb) => {
		if (!user?.id) return;
	
		const isChanged = JSON.stringify(data) !== JSON.stringify(lastSyncedData);
		if (!isChanged) return;
	
		try {
				setIsSaving(true)
			if (!resumeId) {
				const created = await ResumeDB.createResume(user.id, data.data);
				if (created && created[0]?.id) {
					setResumeId(created[0].id);
					setLastSyncedData(created[0]);
				}
			} else {
				const updates: ResumeDataDb = {
					data: data.data,
					title: documentTitle,
					id: resumeId,
					user_id: user.id,
					template_id: data.data.selectedTemplate,
					downloads: 0,
					status: "draft",
				}
				const updated = await ResumeDB.updateResume(resumeId, updates);
				if (updated) {
					setLastSyncedData(updates);
				}
			}
		} catch (err) {
			console.error("Error syncing resume:", err);
		} finally {
			setIsSaving(false)
			setLastSaved(new Date())
		}
	};
	
	const debouncedSync = useRef(debounce(syncResumeToDB, 2000)).current;

	
	const handleUpdate = (data: ResumeData) => {
		setResumeData({...resumeData, data})
		// Save data to local storage whenever it's updated
		localStorage.setItem("resumeData", JSON.stringify(data))
		debouncedSync({...resumeData, data});
	}

	const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement> ) => {
		setDocumentTitle(e.target.value)
		debouncedSync(resumeData);
	}

	const handleTemplateSelect = (template: ResumeTemplate) => {
		const updatedData = { ...resumeData, selectedTemplate: template.id }
		setResumeData(updatedData)
		// Save data to local storage when template is changed
		localStorage.setItem("resumeData", JSON.stringify(updatedData))
		debouncedSync(updatedData);
	}

	const handleReset = () => {
		setResumeData(initialResumeData)
		// Clear data from local storage
		localStorage.removeItem("resumeData")
	}
	const timeAgo = Math.round((Date.now() - lastSaved.getTime()) / 1000)
	const savedText = timeAgo < 60 ? "Saved" : timeAgo < 3600 ? `${Math.round(timeAgo / 60)}m ago` : "Saved"

	return (
		<div className="min-h-screen">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				{/* Tab Navigation - Fixed Header */}
				<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
				<div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
					<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/resumes">
						<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<Input
						value={documentTitle}
						onChange={handleUpdateTitle}
						className="text-lg font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
						/>
						<div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
						<div className="flex items-center gap-1">
							{isSaving ? (
							<>
								<Loader2 className="h-3 w-3 animate-spin" />
								Saving...
							</>
							) : (
							<>
								<CheckCircle2 className="h-3 w-3 text-emerald-600" />
								{savedText}
							</>
							)}
						</div>
						</div>
					</div>
					</div>

					<div className="flex items-center gap-2">
						<TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
						<TabsTrigger value="form" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
							<FileText className="w-4 h-4" />
							Build Resume
						</TabsTrigger>
						<TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
							<Eye className="w-4 h-4" />
							Preview
						</TabsTrigger>
						</TabsList>

					<Button
						variant="outline"
						size="sm"
						className="bg-transparent"
						onClick={() =>
						toast("Share link copied",{
							description: "Resume link copied to clipboard",
						})
						}
					>
						<Share2 className="h-4 w-4 mr-2" />
						Share
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreVertical className="h-4 w-4" />
						</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
						<ResetDialog handleReset={handleReset} />
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Copy className="h-4 w-4 mr-2" />
							Duplicate Resume
						</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					</div>
				</div>
				</div>
				{/* <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/80 dark:border-gray-700">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between gap-2 max-sm:flex-wrap">
					<div className="flex items-center space-x-3 max-sm:w-full">
						<div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl max-sm:hidden">
						<Sparkles className="w-6 h-6 text-white" />
						</div>
						<div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent max-sm:text-xl">
							Resume Builder
						</h1>
						<p className="text-sm text-gray-600 dark:text-gray-400 max-sm:text-xs">Create professional resumes in minutes</p>
						</div>
					</div>

					<div className="flex items-center space-x-4 max-sm:w-full">
						<TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
						<TabsTrigger value="form" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
							<FileText className="w-4 h-4" />
							Build Resume
						</TabsTrigger>
						<TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
							<Eye className="w-4 h-4" />
							Preview
						</TabsTrigger>
						</TabsList>
					</div>
					</div>
				</div>
				</div> */}

				{/* Tab Content */}
				<TabsContent value="form" className="mt-0" forceMount hidden={activeTab !== 'form'}>
				{!loadingData ?
				<RedesignedResumeForm onUpdate={handleUpdate} initialData={resumeData.data} />:
				<>
				<div className="w-full min-h-96 flex items-center justify-center">
					<Loader2 className="w-5 h-5 animate-spin" />
				</div>
				</>
				}
				</TabsContent>

				<TabsContent value="preview" className="mt-0">
				<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
					<div className="container mx-auto px-4">
					{/* <div className="mb-8 text-center">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Preview</h2>
						<p className="text-gray-600 text-lg">Review your resume before downloading</p>
					</div> */}
					<ResumePreview data={resumeData.data} changeTemplate={handleTemplateSelect} />
					</div>
				</div>
				</TabsContent>
			</Tabs>
			
			<Toaster />
		</div>
	)
}

const ResetDialog = ({ handleReset }: { handleReset: () => void })=>{
	return (
		<Dialog>
			<DialogTrigger asChild>
				<DropdownMenuItem>
					<History className="h-4 w-4 mr-2" />
					Reset Resume
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
				<DialogTitle>Reset Resume.</DialogTitle>
				<DialogDescription>
					This action cannot be undone. This will permanently reset all the data you have stored for your resume.
				</DialogDescription>
				</DialogHeader>
				<DialogFooter>
				<DialogClose>
					Cancel
				</DialogClose>
				<Button onClick={handleReset} variant="outline" className="float-end bg-white dark:bg-secondary/90 hover:bg-gray-100">
					Reset Resume
				</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}