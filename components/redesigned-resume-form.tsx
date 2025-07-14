"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import type { ResumeData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  HelpCircle,
  GripVertical,
  Upload,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { AIAssistantButton } from "./ai-assistant-button"
import { AISuggestionsPanel } from "./ai-suggestions-panel"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import imageCompression from 'browser-image-compression'

type RedesignedResumeFormProps = {
  onUpdate: (data: ResumeData) => void
  initialData: ResumeData
  reset: () => void
}

const formSteps = [
  {
    id: "personal",
    title: "Personal Details",
    subtitle: "Basic information about you",
    icon: User,
    color: "from-blue-500 to-cyan-500",
    fields: ["name", "email", "phone", "location"],
  },
  {
    id: "summary",
    title: "Professional Summary",
    subtitle: "Your career overview",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    fields: ["summary"],
  },
  {
    id: "experience",
    title: "Work Experience",
    subtitle: "Your professional journey",
    icon: Briefcase,
    color: "from-orange-500 to-red-500",
    fields: ["experience"],
  },
  {
    id: "education",
    title: "Education",
    subtitle: "Your academic background",
    icon: GraduationCap,
    color: "from-purple-500 to-pink-500",
    fields: ["education"],
  },
  {
    id: "skills",
    title: "Skills & Expertise",
    subtitle: "Your technical and soft skills",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    fields: ["skills"],
  },
  {
    id: "certifications",
    title: "Certifications",
    subtitle: "Professional certifications",
    icon: Award,
    color: "from-indigo-500 to-purple-500",
    fields: ["certifications"],
  },
  {
    id: "references",
    title: "References",
    subtitle: "Professional references",
    icon: Users,
    color: "from-teal-500 to-green-500",
    fields: ["references"],
  },
]

const FieldTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center justify-center space-x-2 mb-8">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={cn(
          "w-3 h-3 rounded-full transition-all duration-300",
          i <= currentStep ? "bg-blue-500 scale-110" : "bg-gray-200",
        )}
      />
    ))}
  </div>
)

const ValidationMessage = ({ type, message }: { type: "error" | "success" | "info"; message: string }) => {
  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  }
  const colors = {
    error: "text-red-600 bg-red-50 border-red-200",
    success: "text-green-600 bg-green-50 border-green-200",
    info: "text-blue-600 bg-blue-50 border-blue-200",
  }

  const Icon = icons[type]

  return (
    <Alert className={cn("mt-2", colors[type])}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="text-sm">{message}</AlertDescription>
    </Alert>
  )
}

export default function RedesignedResumeForm({ onUpdate, initialData, reset }: RedesignedResumeFormProps) {
  const { register, control, handleSubmit, watch, setValue, reset: resetInitial } = useForm<ResumeData>({
    defaultValues: initialData,
  })
  const hasResetRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [aiSuggestions, setAiSuggestions] = useState<{
    type: string
    suggestions: string[]
    visible: boolean
    targetField?: string
    targetIndex?: number
  }>({
    type: "",
    suggestions: [],
    visible: false,
  })
  const { toast } = useToast()


  console.log("initial Data: ", initialData || "empty")

  useEffect(() => {
    // Only reset once when initialData becomes truthy and has not been reset before
    if (initialData && !hasResetRef.current) {
      resetInitial(initialData);
      hasResetRef.current = true;
    }
  }, [initialData, resetInitial]);
  // const {
  //   setValue,
  // } = useForm<ResumeData>({
  //   defaultValues: initialData,
  //   mode: "onChange",
  // })

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
    move: moveExp,
  } = useFieldArray({
    control,
    name: "experience",
  })

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
    move: moveEdu,
  } = useFieldArray({
    control,
    name: "education",
  })

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
    move: moveCert,
  } = useFieldArray({
    control,
    name: "certifications",
  })

  const {
    fields: refFields,
    append: appendRef,
    remove: removeRef,
    move: moveRef,
  } = useFieldArray({
    control,
    name: "referees",
  })

  const [skillsOrder, setSkillsOrder] = useState<string[]>([])

  // Auto-save functionality
  useEffect(() => {
    const subscription = watch((value) => {
      onUpdate(value as ResumeData)
    })
    return () => subscription.unsubscribe()
  }, [watch, onUpdate])

  // Update skills order when skills change
  useEffect(() => {
    const skills = watch("skills")
    if (Array.isArray(skills) && skills.length > 0) {
      setSkillsOrder(skills)
    }
  }, [watch("skills")])

  // Mark step as completed when it has required data
  useEffect(() => {
    const data = watch()
    const newCompletedSteps = new Set<number>()

    if (data.personalInfo?.name && data.personalInfo?.email) newCompletedSteps.add(0)
    if (data.summary) newCompletedSteps.add(1)
    if (data.experience?.length > 0) newCompletedSteps.add(2)
    if (data.education?.length > 0) newCompletedSteps.add(3)
    if (data.skills?.length > 0) newCompletedSteps.add(4)
    if (data.certifications?.length > 0) newCompletedSteps.add(5)
    if (data.referees?.length > 0) newCompletedSteps.add(6)

    setCompletedSteps(newCompletedSteps)
  }, [watch])

  const validateCurrentStep = async () => {
    const currentStepId = formSteps[currentStep].id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fields = formSteps[currentStep].fields

    let isValid = true
    const errors: Record<string, string> = {}

    if (currentStepId === "personal") {
      const name = watch("personalInfo.name")
      const email = watch("personalInfo.email")

      if (!name) {
        errors.name = "Name is required"
        isValid = false
      }
      if (!email) {
        errors.email = "Email is required"
        isValid = false
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        errors.email = "Please enter a valid email address"
        isValid = false
      }
    }

    setValidationErrors(errors)
    return isValid
  }

  const generateAISuggestions = async (
    type: "summary" | "job-description" | "skills" | "accomplishments",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    targetField?: string,
    targetIndex?: number,
  ) => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          context: {
            ...context,
            personalInfo: watch("personalInfo"),
            skills: watch("skills"),
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setAiSuggestions({
        type,
        suggestions: data.suggestions || [],
        visible: true,
        targetField,
        targetIndex,
      })

      if (data.fallback) {
        toast({
          title: "Using Backup Suggestions",
          description: "AI service is temporarily unavailable. Showing general suggestions instead.",
        })
      } else {
        toast({
          title: "AI Suggestions Generated",
          description: "Review the suggestions below and click to apply them.",
        })
      }
    } catch (error) {
      console.error("Failed to generate suggestions:", error)

      const fallbackSuggestions = {
        summary: [
          "Experienced professional with a strong background in problem-solving and team collaboration.",
          "Results-driven professional with expertise in project management and strategic planning.",
          "Dedicated professional with excellent communication skills and a passion for innovation.",
        ],
        "job-description": [
          "• Collaborated with cross-functional teams to deliver high-quality projects",
          "• Implemented process improvements that increased efficiency",
          "• Managed multiple projects while maintaining attention to detail",
          "• Provided technical support and training to team members",
        ],
        skills: ["Communication", "Problem Solving", "Project Management", "Team Leadership", "Time Management"],
        accomplishments: [
          "• Successfully led team projects to completion ahead of schedule",
          "• Improved operational efficiency through process optimization",
          "• Achieved high customer satisfaction ratings",
          "• Mentored junior team members for improved performance",
        ],
      }

      setAiSuggestions({
        type,
        suggestions: fallbackSuggestions[type] || ["Unable to generate suggestions at this time."],
        visible: true,
        targetField,
        targetIndex,
      })

      toast({
        title: "Using Backup Suggestions",
        description: "AI service is currently unavailable. Here are some general suggestions to get you started.",
      })
    }
  }

  const handleAcceptSuggestion = (suggestion: string) => {
    const { type, targetField, targetIndex } = aiSuggestions

    if (type === "summary") {
      setValue("summary", suggestion)
    } else if (type === "job-description" && targetField && targetIndex !== undefined) {
      setValue(`experience.${targetIndex}.description`, suggestion)
    } else if (type === "skills") {
      const currentSkills = watch("skills") || []
      const newSkills = suggestion.split(",").map((s) => s.trim())
      setValue("skills", [...currentSkills, ...newSkills])
    }

    setAiSuggestions({ type: "", suggestions: [], visible: false })
    toast({
      title: "Suggestion Applied",
      description: "The AI suggestion has been added to your resume.",
    })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      })
      return
    }

    try {
      // const reader = new FileReader()
      // reader.onloadend = () => {
      //   setValue("personalInfo.photo", reader.result as string)
      //   toast({
      //     title: "Photo uploaded",
      //     description: "Your profile photo has been added successfully.",
      //   })
      // }
      // reader.readAsDataURL(file)
      const options = {
        maxSizeMB: 0.3, // Target max size in MB
        maxWidthOrHeight: 800, // Resize large images
        useWebWorker: true,
      }

      const compressedFile = await imageCompression(file, options)
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile)

      console.log("Original size:", (file.size / 1024).toFixed(1), "KB")
      console.log("Compressed size:", (compressedFile.size / 1024).toFixed(1), "KB")

      setValue("personalInfo.photo", base64 as string)

      // onUpdate({
      //   ...watch(),
      //   personalInfo: {
      //     ...watch().personalInfo,
      //     photo: base64,
      //   },
      // })
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been added successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setValidationErrors({})
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setValidationErrors({})
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === "experience") {
      moveExp(source.index, destination.index)
    } else if (type === "education") {
      moveEdu(source.index, destination.index)
    } else if (type === "certifications") {
      moveCert(source.index, destination.index)
    } else if (type === "references") {
      moveRef(source.index, destination.index)
    } else if (type === "skills") {
      const newSkillsOrder = Array.from(skillsOrder)
      const [reorderedItem] = newSkillsOrder.splice(source.index, 1)
      newSkillsOrder.splice(destination.index, 0, reorderedItem)
      setSkillsOrder(newSkillsOrder)
      setValue("skills", newSkillsOrder)
    }
  }

  const progress = ((currentStep + 1) / formSteps.length) * 100
  const currentStepData = formSteps[currentStep]

  const renderPersonalInfo = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center",
            currentStepData.color,
          )}
        >
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
        <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Full Name
                </Label>
                <span className="text-red-500">*</span>
                <FieldTooltip content="Enter your full legal name as it appears on official documents">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </FieldTooltip>
              </div>
              <Input
                id="name"
                {...register("personalInfo.name", { required: "Name is required" })}
                placeholder="e.g., John Smith"
                className={cn("h-12 text-base", validationErrors.name && "border-red-500 focus:border-red-500")}
              />
              {validationErrors.name && <ValidationMessage type="error" message={validationErrors.name} />}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Professional Title
                </Label>
                <FieldTooltip content="Your current job title or the position you're seeking">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </FieldTooltip>
              </div>
              <Input
                id="title"
                {...register("personalInfo.title")}
                placeholder="e.g., Senior Software Engineer"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <span className="text-red-500">*</span>
                <FieldTooltip content="Professional email address where employers can reach you">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </FieldTooltip>
              </div>
              <Input
                id="email"
                {...register("personalInfo.email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="e.g., john.smith@email.com"
                type="email"
                className={cn("h-12 text-base", validationErrors.email && "border-red-500 focus:border-red-500")}
              />
              {validationErrors.email && <ValidationMessage type="error" message={validationErrors.email} />}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Phone Number
                </Label>
                <FieldTooltip content="Include country code for international applications">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </FieldTooltip>
              </div>
              <Input
                id="phone"
                {...register("personalInfo.phone")}
                placeholder="e.g., +1 (555) 123-4567"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                  Location
                </Label>
                <FieldTooltip content="City and state/country where you're located">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </FieldTooltip>
              </div>
              <Input
                id="location"
                {...register("personalInfo.location")}
                placeholder="e.g., New York, NY"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="website" className="text-sm font-semibold text-gray-700">
                  Website/Portfolio
                </Label>
                <FieldTooltip content="Link to your professional website or portfolio">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </FieldTooltip>
              </div>
              <Input
                id="website"
                {...register("personalInfo.website")}
                placeholder="e.g., https://johnsmith.dev"
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-semibold text-gray-700">Profile Photo</Label>
              <FieldTooltip content="Optional: Add a professional headshot (max 5MB)">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </FieldTooltip>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Input type="file" onChange={handlePhotoUpload} accept="image/*" className="hidden" id="photo-upload" />
                <Label
                  htmlFor="photo-upload"
                  className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Upload Photo</span>
                </Label>
              </div>
              {watch("personalInfo.photo") && (
                <div className="relative">
                  <img
                    src={watch("personalInfo.photo") || "/placeholder.svg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                    onClick={() => setValue("personalInfo.photo", "")}
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700">Social Media & Professional Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">LinkedIn</Label>
                <Input
                  {...register("personalInfo.socialMedia.linkedin")}
                  placeholder="LinkedIn profile URL"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">GitHub</Label>
                <Input
                  {...register("personalInfo.socialMedia.github")}
                  placeholder="GitHub profile URL"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Twitter</Label>
                <Input
                  {...register("personalInfo.socialMedia.twitter")}
                  placeholder="Twitter profile URL"
                  className="h-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSummary = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center",
            currentStepData.color,
          )}
        >
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
        <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="summary" className="text-sm font-semibold text-gray-700">
                  Professional Summary
                </Label>
                <FieldTooltip content="A brief overview of your professional background, key skills, and career objectives (2-4 sentences)">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </FieldTooltip>
              </div>
              <AIAssistantButton
                onGenerate={() =>
                  generateAISuggestions("summary", {
                    jobTitle: watch("personalInfo.title"),
                    industry: "Technology",
                    experience: "Mid-level",
                  })
                }
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                AI Generate
              </AIAssistantButton>
            </div>
            <Textarea
              id="summary"
              {...register("summary")}
              placeholder="Write a compelling summary that highlights your professional background, key achievements, and career goals. Keep it concise and impactful..."
              className="min-h-[160px] text-base leading-relaxed resize-none"
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>💡 Tip: Focus on your most relevant skills and achievements</span>
              <span>{watch("summary")?.length || 0} characters</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">✨ Summary Writing Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Start with your professional title and years of experience</li>
              <li>• Highlight 2-3 key skills or areas of expertise</li>
              <li>• Mention a significant achievement or impact</li>
              <li>• End with your career goal or what you&apos;re seeking</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderExperience = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center",
            currentStepData.color,
          )}
        >
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
        <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="experience" type="experience">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {expFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "border-0 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-200",
                        snapshot.isDragging && "shadow-2xl scale-105 rotate-2",
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-grab active:cursor-grabbing transition-colors"
                            >
                              <GripVertical className="w-4 h-4 text-gray-500" />
                            </div>
                            <CardTitle className="text-lg font-semibold">
                              {watch(`experience.${index}.title`) || `Experience #${index + 1}`}
                            </CardTitle>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExp(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Job Title *</Label>
                            <Input
                              {...register(`experience.${index}.title`)}
                              placeholder="e.g., Senior Software Engineer"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Company *</Label>
                            <Input
                              {...register(`experience.${index}.company`)}
                              placeholder="e.g., Tech Solutions Inc."
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Start Date</Label>
                            <Input {...register(`experience.${index}.startDate`)} type="date" className="h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">End Date</Label>
                            <Input
                              {...register(`experience.${index}.endDate`)}
                              type="date"
                              className="h-12"
                              disabled={watch(`experience.${index}.current`)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Location</Label>
                          <Input
                            {...register(`experience.${index}.location`)}
                            placeholder="e.g., San Francisco, CA"
                            className="h-12 text-base"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm font-semibold text-gray-700">Job Description</Label>
                              <FieldTooltip content="Describe your responsibilities and achievements. Use bullet points for better readability.">
                                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                              </FieldTooltip>
                            </div>
                            <AIAssistantButton
                              onGenerate={() =>
                                generateAISuggestions(
                                  "job-description",
                                  {
                                    jobTitle: watch(`experience.${index}.title`),
                                    company: watch(`experience.${index}.company`),
                                  },
                                  "description",
                                  index,
                                )
                              }
                              size="sm"
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                              AI Enhance
                            </AIAssistantButton>
                          </div>
                          <Textarea
                            {...register(`experience.${index}.description`)}
                            placeholder="• Led a team of 5 developers to deliver projects 20% ahead of schedule&#10;• Implemented new testing procedures that reduced bugs by 30%&#10;• Collaborated with product managers to define technical requirements"
                            className="min-h-[140px] text-base leading-relaxed"
                          />
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <Switch {...register(`experience.${index}.current`)} />
                          <Label className="text-sm font-medium">I currently work here</Label>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          appendExp({
            title: "",
            company: "",
            startDate: "",
            endDate: "",
            location: "",
            description: "",
            current: false,
          })
        }
        className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Work Experience
      </Button>
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center",
            currentStepData.color,
          )}
        >
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
        <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="education" type="education">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {eduFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "border-0 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-200",
                        snapshot.isDragging && "shadow-2xl scale-105 rotate-2",
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-grab active:cursor-grabbing transition-colors"
                            >
                              <GripVertical className="w-4 h-4 text-gray-500" />
                            </div>
                            <CardTitle className="text-lg font-semibold">
                              {watch(`education.${index}.degree`) || `Education #${index + 1}`}
                            </CardTitle>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEdu(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Degree/Certification</Label>
                            <Input
                              {...register(`education.${index}.degree`)}
                              placeholder="e.g., Bachelor of Computer Science"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Institution</Label>
                            <Input
                              {...register(`education.${index}.school`)}
                              placeholder="e.g., Stanford University"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Start Date</Label>
                            <Input {...register(`education.${index}.startDate`)} type="date" className="h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">End Date</Label>
                            <Input {...register(`education.${index}.endDate`)} type="date" className="h-12" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Location</Label>
                          <Input
                            {...register(`education.${index}.location`)}
                            placeholder="e.g., Stanford, CA"
                            className="h-12 text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm font-semibold text-gray-700">Description</Label>
                            <FieldTooltip content="Include relevant coursework, achievements, honors, or activities">
                              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                            </FieldTooltip>
                          </div>
                          <Textarea
                            {...register(`education.${index}.description`)}
                            placeholder="e.g., Relevant coursework: Data Structures, Algorithms, Machine Learning&#10;• Dean's List (2019-2021)&#10;• President of Computer Science Club"
                            className="min-h-[120px] text-base leading-relaxed"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        type="button"
        variant="outline"
        onClick={() => appendEdu({ degree: "", school: "", startDate: "", endDate: "", location: "", description: "" })}
        className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Education
      </Button>
    </div>
  )

  const renderSkills = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center",
            currentStepData.color,
          )}
        >
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
        <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="skills" className="text-sm font-semibold text-gray-700">
                  Skills
                </Label>
                <FieldTooltip content="Add both technical and soft skills relevant to your field. Separate with commas.">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </FieldTooltip>
              </div>
              <AIAssistantButton
                onGenerate={() =>
                  generateAISuggestions("skills", {
                    jobTitle: watch("personalInfo.title"),
                    industry: "Technology",
                  })
                }
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                Suggest Skills
              </AIAssistantButton>
            </div>
            <Textarea
              id="skills"
              {...register("skills", {
                setValueAs: (v: string | string[]) => {
                  if (Array.isArray(v)) return v
                  return v
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                },
              })}
              placeholder="e.g., JavaScript, React, Node.js, Project Management, Team Leadership, Problem Solving"
              className="min-h-[120px] text-base leading-relaxed"
            />
            <div className="text-sm text-gray-500">
              💡 Tip: Include both technical skills (programming languages, tools) and soft skills (leadership,
              communication)
            </div>
          </div>

          {/* Skills with drag-and-drop reordering */}
          {skillsOrder.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700">Skill Proficiency & Order</Label>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="skills" type="skills">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {skillsOrder.map((skill, index) => (
                        <Draggable key={skill} draggableId={skill} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center space-x-4 p-4 bg-gray-50 rounded-lg transition-all duration-200",
                                snapshot.isDragging && "shadow-lg scale-105 bg-white",
                              )}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="p-1 rounded cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <div className="w-1/3">
                                <Badge variant="secondary" className="text-sm font-medium">
                                  {skill.trim()}
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <Controller
                                  name={`skillLevels.${skill.trim()}`}
                                  control={control}
                                  defaultValue={70}
                                  render={({ field }) => (
                                    <div className="space-y-2">
                                      <Slider
                                        min={0}
                                        max={100}
                                        step={10}
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        className="w-full"
                                      />
                                      <div className="text-sm text-gray-600 text-center">
                                        {field.value}% proficiency
                                      </div>
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderCertifications = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center",
            currentStepData.color,
          )}
        >
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
        <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="certifications" type="certifications">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {certFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "border-0 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-200",
                        snapshot.isDragging && "shadow-2xl scale-105 rotate-2",
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-grab active:cursor-grabbing transition-colors"
                            >
                              <GripVertical className="w-4 h-4 text-gray-500" />
                            </div>
                            <CardTitle className="text-lg font-semibold">
                              {watch(`certifications.${index}.name`) || `Certification #${index + 1}`}
                            </CardTitle>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCert(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Certification Name</Label>
                            <Input
                              {...register(`certifications.${index}.name`)}
                              placeholder="e.g., AWS Certified Solutions Architect"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Issuing Organization</Label>
                            <Input
                              {...register(`certifications.${index}.issuer`)}
                              placeholder="e.g., Amazon Web Services"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Date Obtained</Label>
                            <Input {...register(`certifications.${index}.date`)} type="date" className="h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Expiry Date</Label>
                            <Input {...register(`certifications.${index}.expiry`)} type="date" className="h-12" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm font-semibold text-gray-700">Certification ID</Label>
                            <FieldTooltip content="Certificate ID, license number, or credential identifier">
                              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                            </FieldTooltip>
                          </div>
                          <Input
                            {...register(`certifications.${index}.id`)}
                            placeholder="e.g., AWS-SAA-123456789"
                            className="h-12 text-base"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        type="button"
        variant="outline"
        onClick={() => appendCert({ name: "", issuer: "", date: "", expiry: "", id: "" })}
        className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Certification
      </Button>
    </div>
  )

  const renderReferences = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center",
            currentStepData.color,
          )}
        >
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
        <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="references" type="references">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {refFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "border-0 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-200",
                        snapshot.isDragging && "shadow-2xl scale-105 rotate-2",
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-grab active:cursor-grabbing transition-colors"
                            >
                              <GripVertical className="w-4 h-4 text-gray-500" />
                            </div>
                            <CardTitle className="text-lg font-semibold">
                              {watch(`referees.${index}.name`) || `Reference #${index + 1}`}
                            </CardTitle>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRef(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Full Name</Label>
                            <Input
                              {...register(`referees.${index}.name`)}
                              placeholder="e.g., John Smith"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Position/Title</Label>
                            <Input
                              {...register(`referees.${index}.position`)}
                              placeholder="e.g., Senior Manager"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Company</Label>
                            <Input
                              {...register(`referees.${index}.company`)}
                              placeholder="e.g., Tech Solutions Inc."
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Email</Label>
                            <Input
                              {...register(`referees.${index}.email`)}
                              placeholder="e.g., john.smith@company.com"
                              type="email"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
                            <Input
                              {...register(`referees.${index}.phone`)}
                              placeholder="e.g., +1 (555) 123-4567"
                              className="h-12 text-base"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        type="button"
        variant="outline"
        onClick={() => appendRef({ name: "", position: "", company: "", email: "", phone: "" })}
        className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-teal-400 hover:bg-teal-50 transition-all duration-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Reference
      </Button>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-900 mb-2">📋 Reference Guidelines</h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Always ask permission before listing someone as a reference</li>
          <li>• Choose people who can speak to your professional abilities</li>
          <li>• Include former supervisors, colleagues, or clients when possible</li>
          <li>• Provide your references with your current resume and job details</li>
        </ul>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo()
      case 1:
        return renderSummary()
      case 2:
        return renderExperience()
      case 3:
        return renderEducation()
      case 4:
        return renderSkills()
      case 5:
        return renderCertifications()
      case 6:
        return renderReferences()
      default:
        return renderPersonalInfo()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm text-gray-600">
                    Step {currentStep + 1} of {formSteps.length}
                  </p>

                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                      <Save className="w-4 h-4 text-green-500" />
                      <span>Auto-saved</span>
                    </div>
                    <div className="w-32">
                      <Progress value={progress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={reset} variant="outline" className="float-end bg-white dark:bg-secondary/90 hover:bg-gray-100">
                  Reset Resume
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} totalSteps={formSteps.length} />

        <form onSubmit={handleSubmit(onUpdate)} className="max-w-4xl mx-auto">
          {renderCurrentStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 h-12 px-6 bg-white/80 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">
                  {completedSteps.size} of {formSteps.length} sections completed
                </div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: formSteps.length }, (_, i) => (
                    <div
                      key={i}
                      className={cn("w-2 h-2 rounded-full", completedSteps.has(i) ? "bg-green-500" : "bg-gray-300")}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={nextStep}
              disabled={currentStep === formSteps.length - 1}
              className={cn(
                "flex items-center space-x-2 h-12 px-6 text-white",
                `bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-opacity`,
              )}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* AI Suggestions Panel */}
        <div className="max-w-4xl mx-auto mt-8">
          <AISuggestionsPanel
            suggestions={aiSuggestions.suggestions}
            onAccept={handleAcceptSuggestion}
            onReject={() => setAiSuggestions({ type: "", suggestions: [], visible: false })}
            title={`AI ${aiSuggestions.type.replace("-", " ")} Suggestions`}
            isVisible={aiSuggestions.visible}
          />
        </div>
      </div>
    </div>
  )
}
