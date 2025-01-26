"use client"

import { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import type { ResumeData } from "./types";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      photo: "",
      socialMedia: {},
    },
    summary: "",
    experience: [],
    education: [],
    skills: [] as string[],
  })

  const handleUpdate = (data: ResumeData) => {
    setResumeData(data)
  }

  const handleAIFineTune = async () => {
    // This is where you'd implement the AI fine-tuning logic
    console.log("AI fine-tuning initiated")
    // For demonstration, let's just update the summary
    setResumeData((prev) => ({
      ...prev,
      summary: prev.summary + " [AI enhanced: This professional is highly skilled and motivated.]",
    }))
  }

  return (
    <main className="container mx-auto p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Resume Builder</h1>
      <ResizablePanelGroup direction="horizontal" className="min-h-[200px] w-full rounded-lg border md:min-w-[450px]">
            <ResizablePanel defaultSize={30}>
                <h2>Edit Resume</h2>
                <div className="h-full w-full p-6">
                    <ResumeForm onUpdate={handleUpdate} initialData={resumeData} />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
                <h2>Preview</h2>
                <div className="h-full w-full p-6">
                    <ResumePreview data={resumeData} />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
      <Button onClick={handleAIFineTune} className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
        <Wand2 className="mr-2 h-5 w-5" />
        Fine-tune with AI
      </Button>
    </main>
  )
}

