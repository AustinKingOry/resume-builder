"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface AddSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSkill: (skill: any) => void
}

export function AddSkillDialog({ open, onOpenChange, onAddSkill }: AddSkillDialogProps) {
  const [skillName, setSkillName] = useState("")
  const [category, setCategory] = useState("technical")
  const [proficiency, setProficiency] = useState([50])

  const handleSubmit = () => {
    if (skillName.trim()) {
      onAddSkill({
        name: skillName,
        category,
        proficiency: proficiency[0],
      })
      setSkillName("")
      setCategory("technical")
      setProficiency([50])
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogDescription>Add a skill to track your professional growth</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Skill Name */}
          <div className="space-y-2">
            <Label htmlFor="skill-name" className="text-slate-900 dark:text-white">
              Skill Name
            </Label>
            <Input
              id="skill-name"
              placeholder="e.g., React, Project Management..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="border-slate-200 dark:border-slate-800"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-900 dark:text-white">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-slate-200 dark:border-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="soft">Soft Skills</SelectItem>
                <SelectItem value="language">Languages</SelectItem>
                <SelectItem value="tool">Tools</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Proficiency Level */}
          <div className="space-y-2">
            <Label className="text-slate-900 dark:text-white">Initial Proficiency Level</Label>
            <div className="pt-2">
              <Slider
                value={proficiency}
                onValueChange={setProficiency}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-slate-600 dark:text-slate-400">Beginner</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{proficiency[0]}%</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Expert</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!skillName.trim()}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
          >
            Add Skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
