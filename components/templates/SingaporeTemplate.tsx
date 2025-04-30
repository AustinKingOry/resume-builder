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

export default function SingaporeTemplate({ data }: { data: ResumeData }) {
  const resumeData = data;
  return (
    <div className="bg-white font-sans max-w-4xl mx-auto p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-1">{resumeData.personalInfo?.name || "Your Name"}</h1>
        <p className="text-lg font-medium">{resumeData.personalInfo?.title || "Your Title"}</p>
      </header>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div>
          <p className="font-medium mb-1">Address</p>
          <p className="text-gray-700 whitespace-pre-line">{resumeData.personalInfo?.location || "Your Location"}</p>
        </div>
        <div>
          <p className="font-medium mb-1">Email</p>
          <p className="text-gray-700">{resumeData.personalInfo?.email || "your.email@example.com"}</p>
        </div>
        <div>
          <p className="font-medium mb-1">Phone</p>
          <p className="text-gray-700">{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
        </div>
      </div>

      {/* Profile section */}
      <section className="mb-12">
        <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-6">
          <span className="inline-block bg-black text-white px-2 py-1 mr-2">01</span> PROFILE
        </h2>
        <p className="text-gray-700">{resumeData.summary || "Your professional summary goes here."}</p>
      </section>

      {/* Employment History section */}
      <section className="mb-12">
        <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-6">
          <span className="inline-block bg-black text-white px-2 py-1 mr-2">02</span> EMPLOYMENT HISTORY
        </h2>
        {(resumeData.experience || []).map((exp, index) => (
          <div key={index} className="mb-8">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-500 text-sm">
                {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
              </p>
              <p className="text-gray-500 text-sm italic">{exp.location || "Location"}</p>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">
              {exp.title || "Job Title"} at {exp.company || "Company"}
            </h3>
            {formatDescription(exp.description)}
          </div>
        ))}
      </section>

      {/* Education section */}
      <section>
        <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-6">
          <span className="inline-block bg-black text-white px-2 py-1 mr-2">03</span> EDUCATION
        </h2>
        {(resumeData.education || []).map((edu, index) => (
          <div key={index} className="mb-6">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-500 text-sm">
                {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
              </p>
              <p className="text-gray-500 text-sm italic">{edu.location || "Location"}</p>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{edu.school || "School"}</h3>
            <p className="text-gray-700">{edu.degree || "Degree"}</p>
            {edu.description && (
              <ul className="list-disc ml-5 mt-2 text-gray-700">
                <li>{edu.description}</li>
              </ul>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}

