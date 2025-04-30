import Image from "next/image"
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

export default function MadridTemplate({ data }: { data: ResumeData }) {
  const resumeData = data
  return (
    <div className="bg-white font-sans max-w-4xl mx-auto">
      {/* Header with photo and yellow section */}
      <div className="flex">
        {/* Photo section */}
        <div className="w-1/4">
          {resumeData.personalInfo?.photo ? (
            <Image
              src={resumeData.personalInfo.photo || "/placeholder.svg"}
              alt={resumeData.personalInfo.name}
              className="w-full h-[160px] object-cover"
              width={160}
              height={160}
              unoptimized
            />
          ) : (
            <div className="w-full h-[160px] bg-gray-200"></div>
          )}
        </div>

        {/* Yellow header section */}
        <div className="w-3/4 bg-yellow-300 p-8">
          <h1 className="text-4xl font-bold uppercase">{resumeData.personalInfo?.name || "Your Name"}</h1>
          <p className="mt-1">{resumeData.personalInfo?.title || "Your Title"}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="p-8">
        {/* Details section */}
        <div className="mb-8">
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Details</h2>
          </div>
          <div>
            <p>{resumeData.personalInfo?.location || "Your Address"}</p>
            <p>{resumeData.personalInfo?.email || "your.email@example.com"}</p>
            <p>{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
          </div>
        </div>

        {/* Profile section */}
        <div className="mb-8">
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Profile</h2>
          </div>
          <p className="text-gray-800">{resumeData.summary || "Your professional summary goes here."}</p>
        </div>

        {/* Education section */}
        <div className="mb-8">
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Education</h2>
          </div>
          {(resumeData.education || []).map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">
                {edu.degree || "Degree"}, {edu.school || "School"}, {edu.location || "Location"}
              </h3>
              <p className="text-gray-600 uppercase text-xs mb-2">
                {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
              </p>
              {edu.description && (
                <ul className="list-disc ml-5">
                  <li>{edu.description}</li>
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Employment History section */}
        <div className="mb-8">
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Employment History</h2>
          </div>
          {(resumeData.experience || []).map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">
                {exp.title || "Job Title"}, {exp.company || "Company"}, {exp.location || "Location"}
              </h3>
              <p className="text-gray-600 uppercase text-xs mb-2">
                {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
              </p>
              {formatDescription(exp.description)}
            </div>
          ))}
        </div>

        {/* Skills section */}
        <div className="mb-8">
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Skills</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(resumeData.skills || []).map((skill, index) => (
              <div key={index} className="mb-2">
                <p>{skill}</p>
                <div className="w-full bg-gray-200 h-2 mt-1">
                  <div
                    className="bg-black h-2"
                    style={{
                      width:
                      resumeData.skillLevels?.[skill] === 1
                      ? "20%"
                      : resumeData.skillLevels?.[skill] === 2
                        ? "40%"
                        : resumeData.skillLevels?.[skill] === 3
                          ? "60%"
                          : resumeData.skillLevels?.[skill] === 4
                            ? "80%"
                            : resumeData.skillLevels?.[skill] === 5
                              ? "100%"
                              : "80%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages section */}
        {resumeData.skills && resumeData.skills.length > 4 && (
          <div className="mb-8">
            <div className="bg-black text-white px-4 py-1 inline-block mb-4">
              <h2 className="text-sm font-bold uppercase">Languages</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(resumeData.skills || []).map((skill, index) => (
                <div key={index} className="mb-2">
                  <p>{skill}</p>
                  <div className="w-full bg-gray-200 h-2 mt-1">
                    <div
                      className="bg-black h-2"
                      style={{
                        width:
                          resumeData.skillLevels?.[skill] === 1
                            ? "20%"
                            : resumeData.skillLevels?.[skill] === 2
                              ? "40%"
                              : resumeData.skillLevels?.[skill] === 3
                                ? "60%"
                                : resumeData.skillLevels?.[skill] === 4
                                  ? "80%"
                                  : resumeData.skillLevels?.[skill] === 5
                                    ? "100%"
                                    : "80%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

