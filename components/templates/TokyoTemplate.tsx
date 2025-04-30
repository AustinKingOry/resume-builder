import Image from "next/image"
import type { ResumeData } from "../../lib/types"

// Helper component for skill bars
const SkillBar = ({ level = 90 }: { level?: number }) => {
  return (
    <div className="w-full bg-gray-200 h-2 mt-1 mb-4">
      <div className="bg-blue-500 h-full" style={{ width: `${level}%` }} />
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

export default function TokyoTemplate({ data }: { data: ResumeData }) {
  const resumeData = data;
  return (
    <div className="bg-white font-sans max-w-4xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Main content */}
        <div className="md:w-2/3">
          {/* Header with name, title and photo */}
          <header className="flex items-start mb-8">
            {resumeData.personalInfo?.photo && (
              <div className="mr-4">
                <Image
                  src={resumeData.personalInfo.photo || "/placeholder.svg"}
                  alt={resumeData.personalInfo.name}
                  className="w-16 h-16 object-cover rounded"
                  width={64}
                  height={64}
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{resumeData.personalInfo?.name || "Your Name"}</h1>
              <p className="text-gray-600">{resumeData.personalInfo?.title || "Your Title"}</p>
            </div>
          </header>

          {/* Profile section */}
          <section className="mb-8">
            <h2 className="flex items-center text-lg font-bold mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </h2>
            <p className="text-gray-700">{resumeData.summary || "Your professional summary goes here."}</p>
          </section>

          {/* Employment History section */}
          <section className="mb-8">
            <h2 className="flex items-center text-lg font-bold mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Employment History
            </h2>
            {(resumeData.experience || []).map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-gray-800">
                  {exp.title || "Job Title"} at {exp.company || "Company"}, {exp.location || "Location"}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </p>
                {formatDescription(exp.description)}
              </div>
            ))}
          </section>

          {/* Education section */}
          <section className="mb-8">
            <h2 className="flex items-center text-lg font-bold mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
              Education
            </h2>
            {(resumeData.education || []).map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-800">
                  {edu.degree || "Degree"}, {edu.school || "School"}, {edu.location || "Location"}
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
                </p>
                {edu.description && <p className="text-gray-700 italic">{edu.description}</p>}
              </div>
            ))}
          </section>

          {/* References section */}
          {resumeData.referees && resumeData.referees.length > 0 && (
            <section>
              <h2 className="flex items-center text-lg font-bold mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                References
              </h2>
              <ul className="ml-5">
                {resumeData.referees.map((referee, index) => (
                  <li key={index} className="mb-1 text-gray-700 flex items-center">
                  <span className="text-gray-700 mr-2">◆</span>
                  <h3>{referee.name} • {referee.company}</h3>
                  <p>{referee.email}</p>
                  <p>{referee.phone}</p>
                </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right column - Details and Skills */}
        <div className="md:w-1/3">
          {/* Details section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">Details</h2>
            <p className="text-gray-700 mb-2">{resumeData.personalInfo?.location || "Your Location"}</p>
            <p className="text-gray-700 mb-2">{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
            <p className="text-gray-700 mb-4">{resumeData.personalInfo?.email || "your.email@example.com"}</p>
          </section>

          {/* Skills section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">Skills</h2>
            <div className="space-y-1">
              {(resumeData.skills || []).map((skill, index) => (
                <div key={index} className="mb-2">
                  <p className="text-gray-800">{skill}</p>
                  <SkillBar
                    level={
                      resumeData.skillLevels?.[skill] === 1
                      ? 20
                      : resumeData.skillLevels?.[skill] === 2
                        ? 40
                        : resumeData.skillLevels?.[skill] === 3
                          ? 60
                          : resumeData.skillLevels?.[skill] === 4
                            ? 80
                            : resumeData.skillLevels?.[skill] === 5
                              ? 100
                              : 80
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Languages section */}
          <section>
            <h2 className="text-lg font-bold mb-4">Languages</h2>
            <div className="space-y-1">
              <p className="text-gray-800">Spanish</p>
              <SkillBar level={75} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

