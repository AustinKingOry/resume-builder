import Image from "next/image"
import type { ResumeData } from "../../lib/types"

// Helper component for skill progress bars
const SkillProgressBar = ({ level = 90 }: { level?: number }) => {
  return (
    <div className="w-full bg-gray-200 h-2 mt-1 mb-4 rounded-full overflow-hidden">
      <div className="bg-gray-800 h-full rounded-full" style={{ width: `${level}%` }} />
    </div>
  )
}
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

export default function OsloTemplate({ data }: { data: ResumeData }) {
  const resumeData = data;
  return (
    <div className="bg-white font-sans max-w-4xl mx-auto">
      {/* Header */}
      <header className="bg-gray-800 text-white py-8 px-6 text-center">
        {resumeData.personalInfo?.photo && (
          <div className="flex justify-center mb-4">
            <Image
              src={resumeData.personalInfo.photo || "/placeholder.svg"}
              alt={resumeData.personalInfo.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-white"
              width={96}
              height={96}
            />
          </div>
        )}
        <h1 className="text-3xl font-light">{resumeData.personalInfo?.name || "Your Name"}</h1>
        <p className="text-sm uppercase tracking-wider mt-1">{resumeData.personalInfo?.title || "Your Title"}</p>
      </header>

      {/* Contact Bar */}
      <div className="bg-gray-700 text-white py-2 px-6 flex justify-center space-x-8 text-sm">
        {resumeData.personalInfo?.email && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{resumeData.personalInfo.email}</span>
          </div>
        )}
        {resumeData.personalInfo?.location && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{resumeData.personalInfo.location}</span>
          </div>
        )}
        {resumeData.personalInfo?.phone && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{resumeData.personalInfo.phone}</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="p-8">
        {/* Profile */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <p className="text-gray-700">{resumeData.summary || "Your professional summary goes here."}</p>
        </section>

        {/* Employment History */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Employment History</h2>
          {(resumeData.experience || []).map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="mb-2">
                <h3 className="font-bold text-gray-800">
                  {exp.title || "Job Title"}, {exp.company || "Company"}, {exp.location || "Location"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </p>
              </div>
              {formatDescription(exp.description)}
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Education</h2>
          {(resumeData.education || []).map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-800">
                {edu.degree || "Degree"}, {edu.school || "School"}, {edu.location || "Location"}
              </h3>
              <p className="text-gray-600 text-sm">
                {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
              </p>
              {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {(resumeData.skills || []).map((skill, index) => (
              <div key={index}>
                <p className="text-gray-800">{skill}</p>
                <SkillProgressBar
                  level={resumeData.skillLevels?.[skill]  || 70}
                />
              </div>
            ))}
          </div>
        </section>

        {/* References */}
        {resumeData.referees && resumeData.referees.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">References</h2>
            <p className="text-gray-700">Available upon request</p>
          </section>
        )}
      </div>
    </div>
  )
}

