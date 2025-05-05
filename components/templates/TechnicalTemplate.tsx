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

// Technical template focused on skills and tech expertise
export const TechnicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-mono p-8 add-padding text-gray-800">
      <div className="mb-6 border-b-2 border-resume-blue pb-4">
        <h1 className="text-2xl font-bold mb-1">{personalInfo.name}</h1>
        <p className="text-lg text-resume-blue mb-2">{personalInfo.title}</p>
        
        <div className="flex flex-wrap gap-3 text-sm">
          {personalInfo.email && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">@</span> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">#</span> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">&gt;</span> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">~/</span> {personalInfo.website}
            </span>
          )}
          {personalInfo.socialMedia.github && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">git:</span> GitHub
            </span>
          )}
          {personalInfo.socialMedia.linkedin && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">in:</span> LinkedIn
            </span>
          )}
        </div>
      </div>

      {/* Technical Skills Section - Highlighted at top */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 bg-resume-blue text-white py-1 px-2">
            {"// Technical Skills"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div key={skill} className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill}</span>
                  {skillLevels[skill] && (
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className={`inline-block w-2 h-2 mx-0.5 ${
                            level <= skillLevels[skill]
                              ? "bg-resume-blue"
                              : "bg-gray-200"
                          } rounded-sm`}
                        ></span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 bg-gray-100 py-1 px-2">
            {"// Summary"}
          </h2>
          <p className="text-sm whitespace-pre-line">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 bg-gray-100 py-1 px-2">
            {"// Experience"}
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-wrap justify-between items-baseline mb-1">
                <h3 className="font-bold text-resume-blue">
                  {exp.title} @ {exp.company}
                </h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate} → {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.location && <p className="text-xs text-gray-600 mb-1">{exp.location}</p>}
              <div className="text-sm whitespace-pre-line">{formatDescription(exp.description)}</div>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          {/* Education */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 bg-gray-100 py-1 px-2">
                {"// Education"}
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                    <span className="text-xs text-gray-600">
                      {edu.startDate} → {edu.endDate}
                    </span>
                  </div>
                  <p className="text-sm">{edu.school}</p>
                  {edu.location && <p className="text-xs text-gray-600">{edu.location}</p>}
                  {edu.description && <p className="text-xs mt-1">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column */}
        <div>
          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 bg-gray-100 py-1 px-2">
                {"// Certifications"}
              </h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-2 text-sm">
                  <div className="font-semibold">{cert.name}</div>
                  <div className="text-xs">
                    <span>{cert.issuer}</span>
                    <span className="mx-1">•</span>
                    <span>{cert.date}</span>
                    {cert.id && (
                      <>
                        <span className="mx-1">•</span>
                        <span>ID: {cert.id}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* References */}
          {referees.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 bg-gray-100 py-1 px-2">
                {"// References"}
              </h2>
              {referees.map((referee, index) => (
                <div key={index} className="mb-3 text-sm">
                  <div className="font-bold">{referee.name}</div>
                  <div className="text-xs">{referee.position} @ {referee.company}</div>
                  <div className="text-xs text-gray-600">
                    {referee.email} • {referee.phone}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate;