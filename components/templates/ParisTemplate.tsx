import Image from "next/image"
import type { ResumeData } from "../../lib/types"

const formatDescription = (description: string | undefined) => {
    if (!description) return null
    const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
    if (listItems.length > 0) {
      return (
        <ul className="list-disc list-inside text-gray-700">
          {listItems.map((item, index) => (
            <li key={index}>{item.replace(/^[-*]\s*/, "")}</li>
          ))}
        </ul>
      )
    }
    return <p>{description}</p>
}

export default function ParisTemplate({ data }: { data: ResumeData }) {
  const resumeData = data;
  return (
    <div className="bg-white font-serif max-w-4xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Main content */}
        <div className="md:w-2/3">
          {/* Header with name and title */}
          <header className="flex flex-row gap-3 items-start mb-6">
            {/* Photo */}
            {resumeData.personalInfo?.photo && (
              <div>
                <Image
                  src={resumeData.personalInfo.photo || "/placeholder.svg"}
                  alt={resumeData.personalInfo.name}
                  className="w-full max-w-[100px] object-cover rounded"
                  width={100}
                  height={100}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">              
              <h1 className="text-2xl font-bold text-red-600">
                {resumeData.personalInfo?.name || "Your Name"}, {resumeData.personalInfo?.title || "Your Title"}
              </h1>
              <div className="flex flex-wrap text-sm text-gray-600 mt-1">
                <p>{resumeData.personalInfo?.location || "Your Location"}</p>
                <p className="mx-1">•</p>
                <p>{resumeData.personalInfo?.email || "your.email@example.com"}</p>
                <p className="mx-1">•</p>
                <p>{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
              </div>
            </div>
          </header>

          {/* Profile section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold uppercase mb-4">Profile</h2>
            <p className="text-gray-700">{resumeData.summary || "Your professional summary goes here."}</p>
          </section>

          {/* Employment History section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold uppercase mb-4">Employment History</h2>
            {(resumeData.experience || []).map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-gray-800">
                  {exp.title || "Job Title"}, {exp.company || "Company"}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"},{" "}
                  {exp.location || "Location"}
                </p>
                {formatDescription(exp.description)}
              </div>
            ))}
          </section>

          {/* Education section */}
          <section>
            <h2 className="text-lg font-bold uppercase mb-4">Education</h2>
            {(resumeData.education || []).map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-800">
                  {edu.school || "School"}, {edu.degree || "Degree"}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}, {edu.location || "Location"}
                </p>
                {edu.description && (
                  <ul className="list-disc ml-5 text-gray-700">
                    <li>{edu.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </section>
        </div>

        {/* Right column - Photo and Skills */}
        <div className="md:w-1/3">

          {/* Skills section */}
          <section>
            <h2 className="text-lg font-bold uppercase mb-4 text-center">Skills</h2>
            <div className="space-y-4">
              {(resumeData.skills || []).map((skill, index) => (
                <div key={index} className="mb-2">
                  <p className="text-gray-800">{skill}</p>
                  <div className="w-full h-px bg-gray-400 mt-1"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

