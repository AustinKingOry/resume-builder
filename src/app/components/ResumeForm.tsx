"use client"

import React from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import type { ResumeData } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"

type ResumeFormProps = {
  onUpdate: (data: ResumeData) => void
  initialData: ResumeData
}

export default function ResumeForm({ onUpdate, initialData }: ResumeFormProps) {
  const { register, control, handleSubmit, watch } = useForm<ResumeData>({
    defaultValues: initialData,
  })

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  })

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  })

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        onUpdate(value as ResumeData)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, onUpdate])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdate({
          ...watch(),
          personalInfo: {
            ...watch().personalInfo,
            photo: reader.result as string,
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit(onUpdate)} className="space-y-6 max-w-7xl mx-auto">
      <Card className="bg-gradient-to-r from-blue-100 to-indigo-100">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("personalInfo.name")} placeholder="Your Name" className="border-blue-300" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("personalInfo.email")}
              placeholder="your.email@example.com"
              type="email"
              className="border-blue-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("personalInfo.phone")}
              placeholder="Your phone number"
              className="border-blue-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("personalInfo.location")}
              placeholder="City, Country"
              className="border-blue-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input id="photo" type="file" onChange={handlePhotoUpload} accept="image/*" className="border-blue-300" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              {...register("personalInfo.socialMedia.linkedin")}
              placeholder="LinkedIn URL"
              className="border-blue-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              {...register("personalInfo.socialMedia.twitter")}
              placeholder="Twitter URL"
              className="border-blue-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              {...register("personalInfo.socialMedia.github")}
              placeholder="GitHub URL"
              className="border-blue-300"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-100 to-teal-100">
        <CardHeader>
          <CardTitle className="text-2xl text-green-800">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register("summary")}
            placeholder="Write a brief summary of your professional background and key skills"
            className="border-green-300"
          />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-800">Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {expFields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 bg-white rounded-lg shadow">
              <Input {...register(`experience.${index}.title`)} placeholder="Job Title" className="border-yellow-300" />
              <Input {...register(`experience.${index}.company`)} placeholder="Company" className="border-yellow-300" />
              <Input
                {...register(`experience.${index}.date`)}
                placeholder="Employment Period"
                className="border-yellow-300"
              />
              <Textarea
                {...register(`experience.${index}.description`)}
                placeholder="Job Description"
                className="border-yellow-300"
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => removeExp(index)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendExp({ title: "", company: "", date: "", description: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-800">Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {eduFields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 bg-white rounded-lg shadow">
              <Input {...register(`education.${index}.degree`)} placeholder="Degree" className="border-purple-300" />
              <Input {...register(`education.${index}.school`)} placeholder="School" className="border-purple-300" />
              <Input
                {...register(`education.${index}.date`)}
                placeholder="Graduation Date"
                className="border-purple-300"
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => removeEdu(index)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendEdu({ degree: "", school: "", date: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-100 to-rose-100">
        <CardHeader>
          <CardTitle className="text-2xl text-red-800">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <Input {...register("skills")} placeholder="Enter skills separated by commas" className="border-red-300" />
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
      >
        Update Resume
      </Button>
    </form>
  )
}

