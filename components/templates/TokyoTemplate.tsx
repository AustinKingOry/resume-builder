import Image from "next/image"
import type { ResumeData } from "../../lib/types"

// Helper component for skill progress bars
const SkillProgressBar = ({ level = 90 }: { level?: number }) => {
  return (
    <div className="w-full h-2 mt-1 mb-1">
      <div className="flex">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((_, i) => (
          <div key={i} className={`h-2 w-full mr-0.5 ${i < (level / 10) ? "bg-red-600" : "bg-gray-200"}`} />
        ))}
      </div>
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
    <div className="bg-white font-sans max-w-4xl mx-auto">
      {/* Header */}
      <header className="bg-red-600 text-white p-8">
        <div className="flex items-center">
          {resumeData.personalInfo?.photo && (
            <div className="mr-6">
              <Image
                src={resumeData.personalInfo.photo || "/placeholder.svg"}
                alt={resumeData.personalInfo.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-white"
                width={80}
                height={80}
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{resumeData.personalInfo?.name || "Your Name"}</h1>
            <p className="text-sm uppercase tracking-wider">{resumeData.personalInfo?.title || "Your Title"}</p>
          </div>
        </div>
      </header>

      {/* Contact Bar */}
      <div className="bg-white py-4 px-8 flex flex-wrap justify-between text-sm border-b">
        {resumeData.personalInfo?.email && (
          <div className="flex items-center mr-6 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-600"
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
          <div className="flex items-center mr-6 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-600"
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
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-600"
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

      <div className="flex flex-col md:flex-row">
        {/* Main content */}
        <div className="md:w-2/3 p-8">
          {/* Profile */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <p className="text-gray-700">{resumeData.summary || "Your professional summary goes here."}</p>
          </section>

          {/* Employment History */}
          <section>
            <h2 className="text-xl font-bold mb-4">Employment History</h2>
            {(resumeData.experience || []).map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-gray-800">
                  {exp.title || "Job Title"}, {exp.company || "Company"}, {exp.location || "Location"}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </p>
                {formatDescription(exp.description)}
              </div>
            ))}
          </section>
        </div>

        {/* Skills sidebar */}
        <div className="md:w-1/3 bg-gray-50 p-8">
          <section>
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <div className="space-y-4">
              {(resumeData.skills || []).map((skill, index) => (
                <div key={index} className="mb-2">
                  <p className="text-gray-800">{skill}</p>
                  <SkillProgressBar
                    level={
                      resumeData.skillLevels?.[skill] || 80
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

