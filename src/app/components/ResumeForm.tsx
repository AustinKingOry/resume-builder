/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import type { ResumeData } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, Upload, Briefcase, GraduationCap, Award } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

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

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certifications",
  })

  const {
    fields: refFields,
    append: appendRef,
    remove: removeRef,
  } = useFieldArray({
    control,
    name: "referees",
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
    <form onSubmit={handleSubmit(onUpdate)} className="space-y-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Information</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register("personalInfo.name")}
                      placeholder="John Doe"
                      className="border-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      {...register("personalInfo.title")}
                      placeholder="Software Engineer"
                      className="border-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      {...register("personalInfo.email")}
                      placeholder="john.doe@example.com"
                      type="email"
                      className="border-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...register("personalInfo.phone")}
                      placeholder="+1 (555) 123-4567"
                      className="border-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...register("personalInfo.location")}
                      placeholder="New York, NY"
                      className="border-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      {...register("personalInfo.website")}
                      placeholder="https://johndoe.com"
                      className="border-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      onValueChange={(value) =>
                        onUpdate({ ...watch(), personalInfo: { ...watch().personalInfo, gender: value } })
                      }
                    >
                      <SelectTrigger className="border-blue-300">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Profile Photo</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="photo"
                      type="file"
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="border-blue-300"
                    />
                    {watch("personalInfo.photo") && (
                      <img
                        src={watch("personalInfo.photo") || "/placeholder.svg"}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Social Media</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      {...register("personalInfo.socialMedia.linkedin")}
                      placeholder="LinkedIn URL"
                      className="border-blue-300"
                    />
                    <Input
                      {...register("personalInfo.socialMedia.twitter")}
                      placeholder="Twitter URL"
                      className="border-blue-300"
                    />
                    <Input
                      {...register("personalInfo.socialMedia.github")}
                      placeholder="GitHub URL"
                      className="border-blue-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="summary">
          <AccordionTrigger>Professional Summary</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardContent className="pt-6">
                <Textarea
                  {...register("summary")}
                  placeholder="Write a brief summary of your professional background and key skills"
                  className="border-green-300 min-h-[150px]"
                />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Work Experience</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="space-y-4 pt-6">
                {expFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 bg-white rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        {...register(`experience.${index}.title`)}
                        placeholder="Job Title"
                        className="border-yellow-300"
                      />
                      <Input
                        {...register(`experience.${index}.company`)}
                        placeholder="Company"
                        className="border-yellow-300"
                      />
                      <Input
                        {...register(`experience.${index}.startDate`)}
                        placeholder="Start Date"
                        type="date"
                        className="border-yellow-300"
                      />
                      <Input
                        {...register(`experience.${index}.endDate`)}
                        placeholder="End Date"
                        type="date"
                        className="border-yellow-300"
                      />
                    </div>
                    <Input
                      {...register(`experience.${index}.location`)}
                      placeholder="Location"
                      className="border-yellow-300"
                    />
                    <Textarea
                      {...register(`experience.${index}.description`)}
                      placeholder="Job Description"
                      className="border-yellow-300"
                    />
                    <div className="flex items-center space-x-2">
                      <Switch {...register(`experience.${index}.current`)} />
                      <Label htmlFor={`experience.${index}.current`}>Current Job</Label>
                    </div>
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
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>Education</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="space-y-4 pt-6">
                {eduFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 bg-white rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        {...register(`education.${index}.degree`)}
                        placeholder="Degree"
                        className="border-purple-300"
                      />
                      <Input
                        {...register(`education.${index}.school`)}
                        placeholder="School"
                        className="border-purple-300"
                      />
                      <Input
                        {...register(`education.${index}.startDate`)}
                        placeholder="Start Date"
                        type="date"
                        className="border-purple-300"
                      />
                      <Input
                        {...register(`education.${index}.endDate`)}
                        placeholder="End Date"
                        type="date"
                        className="border-purple-300"
                      />
                    </div>
                    <Input
                      {...register(`education.${index}.location`)}
                      placeholder="Location"
                      className="border-purple-300"
                    />
                    <Textarea
                      {...register(`education.${index}.description`)}
                      placeholder="Description or achievements"
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
                  onClick={() =>
                    appendEdu({ degree: "", school: "", startDate: "", endDate: "", location: "", description: "" })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger>Skills</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-gradient-to-r from-red-50 to-rose-50">
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
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
                    placeholder="Enter skills separated by commas"
                    className="border-red-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Skill Proficiency</Label>
                  {(Array.isArray(watch("skills")) ? watch("skills") : [])
                    .map((skill, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="w-1/4">{skill.trim()}</span>
                        <Controller
                          name={`skillLevels.${skill.trim()}`}
                          control={control}
                          defaultValue={5}
                          render={({ field }) => (
                            <Slider
                              min={0}
                              max={100}
                              step={10}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          )}
                        />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="certifications">
          <AccordionTrigger>Certifications</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-gradient-to-r from-cyan-50 to-blue-50">
              <CardContent className="space-y-4 pt-6">
                {certFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 bg-white rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        {...register(`certifications.${index}.name`)}
                        placeholder="Certification Name"
                        className="border-cyan-300"
                      />
                      <Input
                        {...register(`certifications.${index}.issuer`)}
                        placeholder="Issuing Organization"
                        className="border-cyan-300"
                      />
                      <Input
                        {...register(`certifications.${index}.date`)}
                        placeholder="Date Obtained"
                        type="date"
                        className="border-cyan-300"
                      />
                      <Input
                        {...register(`certifications.${index}.expiry`)}
                        placeholder="Expiry Date (if applicable)"
                        type="date"
                        className="border-cyan-300"
                      />
                    </div>
                    <Input
                      {...register(`certifications.${index}.id`)}
                      placeholder="Certification ID (if applicable)"
                      className="border-cyan-300"
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeCert(index)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendCert({ name: "", issuer: "", date: "", expiry: "", id: "" })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Certification
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem><AccordionItem value="referees">
          <AccordionTrigger>Referees</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardContent className="space-y-4 pt-6">
                {refFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 bg-white rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        {...register(`referees.${index}.name`)}
                        placeholder="Referee Name"
                        className="border-teal-300"
                      />
                      <Input
                        {...register(`referees.${index}.position`)}
                        placeholder="Position"
                        className="border-teal-300"
                      />
                      <Input
                        {...register(`referees.${index}.company`)}
                        placeholder="Company"
                        className="border-teal-300"
                      />
                      <Input
                        {...register(`referees.${index}.email`)}
                        placeholder="Email"
                        type="email"
                        className="border-teal-300"
                      />
                      <Input {...register(`referees.${index}.phone`)} placeholder="Phone" className="border-teal-300" />
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeRef(index)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendRef({ name: "", position: "", company: "", email: "", phone: "" })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Referee
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
      >
        Update Resume
      </Button>
    </form>
  )
}

