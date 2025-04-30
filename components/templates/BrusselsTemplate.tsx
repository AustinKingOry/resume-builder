import type { ResumeData } from "../../lib/types";

const formatDescription = (description: string | undefined) => {
    if (!description) return null
    const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
    if (listItems.length > 0) {
      return (
        <ul className="list-disc list-inside space-y-2">
          {listItems.map((item, index) => (
            <li key={index}>{item.replace(/^[-*]\s*/, "")}</li>
          ))}
        </ul>
      )
    }
    return <p>{description}</p>
}

export default function BrusselsTemplate({ data }: { data: ResumeData }) {
  const resumeData = data
  return (
    <div className="bg-white font-sans max-w-4xl mx-auto p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-normal text-orange-400">{resumeData.personalInfo?.name || "Your Name"}</h1>
        <p className="text-gray-700 mt-1">{resumeData.personalInfo?.title || "Your Title"}</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main content - left column */}
        <div className="md:w-2/3">
          {/* Profile section */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Profile</h2>
            <p className="text-gray-800">{resumeData.summary || "Your professional summary goes here."}</p>
          </section>

          {/* Employment History section */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Employment History</h2>
            {(resumeData.experience || []).map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-gray-800">
                  {exp.title || "Job Title"} at {exp.company || "Company"}, {exp.location || "Location"}
                </h3>
                <p className="text-gray-600 mb-2">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </p>
                {formatDescription(exp.description)}
              </div>
            ))}
          </section>

          {/* Education section */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Education</h2>
            {(resumeData.education || []).map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-800">
                  {edu.school || "School"}, {edu.location || "Location"}
                </h3>
                <p className="text-gray-800">{edu.degree || "Degree"}</p>
                <p className="text-gray-600 mb-2">
                  {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
                </p>
                {edu.description && (
                  <ul className="list-disc ml-5">
                    <li>{edu.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </section>
        </div>

        {/* Sidebar - right column */}
        <div className="md:w-1/3">
          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Address</h2>
            <p className="text-gray-800">{resumeData.personalInfo?.location || "Your Address"}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Email</h2>
            <p className="text-gray-800">{resumeData.personalInfo?.email || "your.email@example.com"}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Phone</h2>
            <p className="text-gray-800">{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
          </section>

          {/* Skills section */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Skills</h2>
            <ul className="space-y-1">
              {(resumeData.skills || []).map((skill, index) => (
                <li key={index} className="text-gray-800">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

