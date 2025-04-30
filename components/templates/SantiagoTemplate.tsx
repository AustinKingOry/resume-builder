import type { ResumeData } from "../../lib/types"

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

export default function SantiagoTemplate({ data }: { data: ResumeData }) {
  const resumeData = data;
  // Helper function to get skill level text
  const getSkillLevelText = (skill: string) => {
    if (!resumeData.skillLevels || !resumeData.skillLevels[skill]) return "Expert"
    return resumeData.skillLevels[skill]
  }
  return (
    <div className="bg-white font-serif max-w-4xl mx-auto p-8">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">
          {resumeData.personalInfo?.name || "Your Name"}
        </h1>
        <p className="text-gray-700 mb-2">{resumeData.personalInfo?.title || "Your Title"}</p>
        <p className="text-gray-700 text-sm mb-4">{resumeData.personalInfo?.location || "Your Location"}</p>

        <div className="flex justify-between items-center border-t border-b border-gray-300 py-2">
          <p className="text-gray-700">{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
          <p className="text-gray-700">{resumeData.personalInfo?.email || "your.email@example.com"}</p>
        </div>
      </header>

      {/* Profile section */}
      <section className="mb-6 bg-gray-100 p-6">
        <h2 className="text-center font-bold uppercase mb-4 border-b border-gray-300 pb-2">Profile</h2>
        <p className="text-gray-700 text-center">{resumeData.summary || "Your professional summary goes here."}</p>
      </section>

      {/* Employment History section */}
      <section className="mb-6 bg-gray-100 p-6">
        <h2 className="text-center font-bold uppercase mb-4 border-b border-gray-300 pb-2">Employment History</h2>
        {(resumeData.experience || []).map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-gray-700 mr-2">◆</span>
              <h3 className="font-bold text-gray-800">
                {exp.title || "Job Title"}, {exp.company || "Company"}
              </h3>
              <div className="flex-grow border-b border-dotted border-gray-400 mx-4"></div>
              <div className="text-right">
                <p className="text-gray-700 text-sm">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </p>
                <p className="text-gray-700 text-sm">{exp.location || "Location"}</p>
              </div>
            </div>
            {formatDescription(exp.description)}
          </div>
        ))}
      </section>

      {/* Education section */}
      <section className="mb-6 bg-gray-100 p-6">
        <h2 className="text-center font-bold uppercase mb-4 border-b border-gray-300 pb-2">Education</h2>
        {(resumeData.education || []).map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-gray-700 mr-2">◆</span>
              <h3 className="font-bold text-gray-800">{edu.school || "School"}</h3>
              <div className="flex-grow border-b border-dotted border-gray-400 mx-4"></div>
              <div className="text-right">
                <p className="text-gray-700 text-sm">
                  {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
                </p>
                <p className="text-gray-700 text-sm">{edu.location || "Location"}</p>
              </div>
            </div>
            <p className="text-gray-700 italic ml-8">{edu.degree || "Degree"}</p>
            {edu.description && <p className="text-gray-700 ml-8">{edu.description}</p>}
          </div>
        ))}
      </section>

      {/* Skills section */}
      <section className="mb-6 bg-gray-100 p-6">
        <h2 className="text-center font-bold uppercase mb-4 border-b border-gray-300 pb-2">Skills</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {(resumeData.skills || []).map((skill, index) => (
            <div key={index} className="flex justify-between">
              <p className="text-gray-800">{skill}</p>
              <div className="flex-grow border-b border-dotted border-gray-400 mx-2"></div>
              <p className="text-gray-700 italic">{getSkillLevelText(skill)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications section */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-6 bg-gray-100 p-6">
          <h2 className="text-center font-bold uppercase mb-4 border-b border-gray-300 pb-2">Certifications</h2>
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-gray-700 mr-2">◆</span>
                <h3 className="font-bold text-gray-800">{cert.name}</h3>
                <div className="flex-grow border-b border-dotted border-gray-400 mx-4"></div>
                <p className="text-gray-700 text-sm">{cert.date} - {cert.expiry}</p>
              </div>
              <p className="text-gray-700 text-sm ml-8">{cert.issuer}</p>
            </div>
          ))}
        </section>
      )}

      {/* References section */}
      {resumeData.referees && resumeData.referees.length > 0 && (
        <section className="bg-gray-100 p-6">
          <h2 className="text-center font-bold uppercase mb-4 border-b border-gray-300 pb-2">References</h2>
          <ul className="ml-8">
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
  )
}

