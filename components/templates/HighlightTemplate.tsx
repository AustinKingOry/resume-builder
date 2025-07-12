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
// Template with strong headers and key info highlighted
export const HighlightTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-display text-gray-800">
      {/* Bold header with distinctive styling */}
      <header className="bg-resume-purple text-white p-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">{personalInfo.name}</h1>
          <p className="text-xl opacity-90 mb-4">{personalInfo.title}</p>
          
          {/* Contact info in columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">Email:</span>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">Phone:</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">Location:</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">Website:</span>
                <span>{personalInfo.website}</span>
              </div>
            )}
            {personalInfo.socialMedia.linkedin && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">LinkedIn:</span>
                <span>LinkedIn</span>
              </div>
            )}
            {personalInfo.socialMedia.github && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">GitHub:</span>
                <span>GitHub</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        {/* Summary */}
        {summary && (
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-resume-purple mr-2"></div>
              <h2 className="text-xl font-bold">Professional Summary</h2>
            </div>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-resume-purple mr-2"></div>
              <h2 className="text-xl font-bold">Work Experience</h2>
            </div>
            
            {experience.map((exp, index) => (
              <div key={index} className="mb-5 border-l-2 border-gray-200 pl-4 pb-2">
                <h3 className="font-bold text-lg text-resume-purple">{exp.title}</h3>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{exp.company}</span>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-sm text-gray-600 mb-2">{exp.location}</p>}
                <p className="text-sm">{formatDescription(exp.description)}</p>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-resume-purple mr-2"></div>
              <h2 className="text-xl font-bold">Education</h2>
            </div>
            
            {education.map((edu, index) => (
              <div key={index} className="mb-4 border-l-2 border-gray-200 pl-4">
                <h3 className="font-bold text-resume-purple">{edu.degree}</h3>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{edu.school}</span>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.location && <p className="text-sm text-gray-600 mb-1">{edu.location}</p>}
                {edu.description && <p className="text-sm">{edu.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Two-column layout for Skills and Certifications/References */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-resume-purple mr-2"></div>
                <h2 className="text-xl font-bold">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div key={skill} className="bg-gray-100 rounded-full px-3 py-1 text-sm mb-2">
                    <span>{skill}</span>
                    {skillLevels[skill] && (
                      <div className="mt-1 flex justify-center">
                        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((level) => (
                          <span
                            key={level}
                            className={`inline-block w-1 h-1 mx-0.5 rounded-full ${
                              level <= skillLevels[skill] ? "bg-resume-purple" : "bg-gray-300"
                            }`}
                          ></span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-8">
            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-resume-purple mr-2"></div>
                  <h2 className="text-xl font-bold">Certifications</h2>
                </div>
                {certifications.map((cert, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-semibold">{cert.name}</p>
                    <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </section>
            )}

            {/* References */}
            {referees.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-resume-purple mr-2"></div>
                  <h2 className="text-xl font-bold">References</h2>
                </div>
                {referees.map((referee, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-semibold">{referee.name}</p>
                    <p className="text-sm">{referee.position} at {referee.company}</p>
                    <p className="text-sm text-gray-600">{referee.email} • {referee.phone}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightTemplate;