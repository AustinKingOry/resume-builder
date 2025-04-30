import Image from "next/image"
import type { ResumeData } from "../../lib/types"

// Helper component for skill rating dots
const SkillRating = ({ level = 5 }: { level?: number }) => {
  return (
    <div className="flex mt-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full mr-1 ${i < level ? "bg-gray-800" : "bg-gray-300"}`} />
      ))}
    </div>
  )
}
const formatDescription = (description: string | undefined) => {
    if (!description) return null
    const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
    if (listItems.length > 0) {
      return (
        <ul className="list-disc list-inside">
          {listItems.map((item, index) => (
            <li key={index}>{item.replace(/^[-*]\s*/, "")}</li>
          ))}
        </ul>
      )
    }
    return <p>{description}</p>
}

export default function MilanTemplate({ data }: { data: ResumeData }) {
  const resumeData = data;
  // Helper function to get skill level
  const getSkillLevel = (skill: string) => {
    if (!resumeData.skillLevels || !resumeData.skillLevels[skill]) return 5

    const level = resumeData.skillLevels[skill]
    if (level === 2) return 2
    if (level === 3) return 3
    if (level === 4) return 4
    if (level === 5) return 5
    return 5
  }
  return (
    <div className="bg-white font-sans max-w-4xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar */}
        <div className="md:w-1/3">
          {/* Photo */}
          {resumeData.personalInfo?.photo && (
            <div className="flex justify-center mb-6">
              <Image
                src={resumeData.personalInfo.photo || "/placeholder.svg"}
                alt={resumeData.personalInfo.name}
                className="w-32 h-32 rounded-full object-cover"
                width={150}
                height={150}
                unoptimized
              />
            </div>
          )}

          {/* Details section */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-amber-700 mb-4">Details</h2>

            <h3 className="font-bold text-gray-800 mb-1">Address</h3>
            <p className="text-gray-700 mb-4 whitespace-pre-line">
              {resumeData.personalInfo?.location || "Your Address"}
            </p>

            <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
            <p className="text-gray-700 mb-4">{resumeData.personalInfo?.phone || "Your Phone Number"}</p>

            <h3 className="font-bold text-gray-800 mb-1">Email</h3>
            <p className="text-gray-700 mb-4">{resumeData.personalInfo?.email || "your.email@example.com"}</p>
          </section>

          {/* Skills section */}
          <section>
            <h2 className="text-xl font-normal text-amber-700 mb-4">Skills</h2>
            <div className="space-y-3">
              {(resumeData.skills || []).slice(0, 4).map((skill, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-800">{skill}</h3>
                  <SkillRating level={getSkillLevel(skill)} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Main content */}
        <div className="md:w-2/3">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{resumeData.personalInfo?.name || "Your Name"}</h1>
            <p className="text-gray-600">{resumeData.personalInfo?.title || "Your Title"}</p>
          </header>

          {/* Profile section */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-amber-700 mb-4">Profile</h2>
            <p className="text-gray-700">{resumeData.summary || "Your professional summary goes here."}</p>
          </section>

          {/* Employment History section */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-amber-700 mb-4">Employment History</h2>
            {(resumeData.experience || []).map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-gray-800">
                  {exp.title || "Job Title"}, {exp.company || "Company"}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <span>
                    {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                  </span>
                  {exp.location && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {exp.location}
                      </span>
                    </>
                  )}
                </div>
                {formatDescription(exp.description)}
              </div>
            ))}
          </section>

          {/* Education section */}
          <section>
            <h2 className="text-xl font-normal text-amber-700 mb-4">Education</h2>
            {(resumeData.education || []).map((edu, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-gray-800">
                  {edu.school || "School"}, {edu.degree || "Degree"}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <span>
                    {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
                  </span>
                  {edu.location && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {edu.location}
                      </span>
                    </>
                  )}
                </div>
                {edu.description && (
                  <ul className="list-disc ml-5 text-gray-700">
                    <li>{edu.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}

