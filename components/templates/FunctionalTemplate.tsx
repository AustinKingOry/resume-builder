import type { ResumeData } from "../../lib/types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
// Functional template that emphasizes skills over chronological experience
export const FunctionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  // Group skills by level for better organization
  const groupedSkills = skills.reduce<Record<string, string[]>>((acc, skill) => {
    const level = skillLevels[skill] || 3;
    const category = level >= 4 ? "Advanced" : level >= 2 ? "Intermediate" : "Beginner";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="resume-page font-sans text-gray-800">
      {/* Header */}
      <div className="bg-resume-blue py-6 px-8 text-white">
        <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
        <p className="text-xl mt-1">{personalInfo.title}</p>
      </div>
      
      {/* Contact Bar */}
      <div className="bg-gray-100 py-2 px-8 flex flex-wrap gap-4 justify-between text-sm">
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && <span>{personalInfo.website}</span>}
        {personalInfo.socialMedia.linkedin && <span>LinkedIn</span>}
        {personalInfo.socialMedia.github && <span>GitHub</span>}
      </div>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-resume-blue">Professional Summary</h2>
            <p>{summary}</p>
          </section>
        )}

        {/* Skills Section - Emphasized in Functional Resume */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-resume-blue">Core Competencies</h2>
            
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="mb-4">
                <h3 className="font-semibold mb-2">{category} Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications - Also emphasized */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-resume-blue">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm">{cert.issuer} • {cert.date}</p>
                  {cert.id && <p className="text-xs text-gray-500">ID: {cert.id}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work History - Less detailed in a functional resume */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-resume-blue">Work History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {experience.map((exp, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                  <div>
                    <div className="font-semibold">{exp.title}</div>
                    <div className="text-sm">{exp.company}</div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-resume-blue">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <p className="text-sm">{edu.school}{edu.location && `, ${edu.location}`}</p>
              </div>
            ))}
          </section>
        )}

        {/* References */}
        {referees.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-resume-blue">References</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {referees.map((referee, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-semibold">{referee.name}</h3>
                  <p>{referee.position} at {referee.company}</p>
                  <p className="text-gray-600">{referee.email} • {referee.phone}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default FunctionalTemplate;
