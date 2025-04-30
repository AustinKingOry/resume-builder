import type { ResumeData } from "../../lib/types"

const formatDescription = (description: string | undefined) => {
  if (!description) return null
  const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
  if (listItems.length > 0) {
    return (
      <ul className="list-disc ml-5">
        {listItems.map((item, index) => (
          <li key={index} className="text-gray-800 mb-1">
            {item.replace(/^[-*]\s*/, "")}
          </li>
        ))}
      </ul>
    )
  }
  return <p>{description}</p>
}

export default function AthensTemplate({ data }: { data: ResumeData }) {
  // Use provided data or fall back to default data
  const resumeData = data

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-normal text-blue-600">{resumeData.personalInfo?.name || "Your Name"}</h1>
            <p className="text-lg text-gray-700 mt-1">{resumeData.personalInfo?.title || "Your Title"}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-600">
              {resumeData.personalInfo?.email || "email@example.com"} •{" "}
              {resumeData.personalInfo?.phone || "(555) 123-4567"}
            </p>
            <p className="text-gray-700">{resumeData.personalInfo?.location || "City, State, Country"}</p>
          </div>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <p className="text-gray-800">{resumeData.summary || "Professional summary goes here."}</p>
      </section>

      {/* Professional Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-normal text-blue-600 mb-4">Professional Experience</h2>
        {(resumeData.experience || []).map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-blue-600 font-normal">
                {exp.company || "Company Name"}, {exp.location || "Location"}
              </h3>
              <span className="text-gray-700">
                {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
              </span>
            </div>
            <p className="text-gray-800 mb-2">{exp.title || "Job Title"}</p>
            {formatDescription(exp.description)}
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-2xl font-normal text-blue-600 mb-4">Education</h2>
        {(resumeData.education || []).map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className="text-blue-600 font-normal">{edu.degree || "Degree"}</h3>
            <p className="text-gray-800">
              {edu.school || "School"}, {edu.location || "Location"}
            </p>
          </div>
        ))}
      </section>

      {/* Areas of Expertise */}
      <section className="mb-8">
        <h2 className="text-2xl font-normal text-blue-600 mb-4">Areas of Expertise</h2>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {(resumeData.skills || []).map((skill, index) => (
            <div key={index} className="flex items-baseline">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-gray-800">{skill}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

