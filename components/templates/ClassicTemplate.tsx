import type { ResumeData } from "../../lib/types"
import { Phone, Mail, MapPin, Globe, Linkedin, Twitter, Github } from "lucide-react";

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
// Classic professional template with top header and clean sections
export const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-body text-gray-800 p-8 add-padding">
      {/* Header */}
      <header className="mb-6 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-1">{personalInfo.name}</h1>
        <p className="text-xl text-resume-slate mb-3">{personalInfo.title}</p>
        
        {/* Contact details */}
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} /> {personalInfo.phone}
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail size={14} /> {personalInfo.email}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} /> {personalInfo.location}
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe size={14} /> {personalInfo.website}
            </div>
          )}
          {personalInfo.socialMedia.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin size={14} /> LinkedIn
            </div>
          )}
          {personalInfo.socialMedia.github && (
            <div className="flex items-center gap-1">
              <Github size={14} /> GitHub
            </div>
          )}
          {personalInfo.socialMedia.twitter && (
            <div className="flex items-center gap-1">
              <Twitter size={14} /> Twitter
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="resume-section">
          <h2 className="resume-section-title">Professional Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{exp.title}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{exp.company}</span>
                {exp.location && <span className="text-gray-600">{exp.location}</span>}
              </div>
              <div className="text-sm mt-1">{formatDescription(exp.description)}</div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="timeline-item">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{edu.degree}</h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{edu.school}</span>
                {edu.location && <span className="text-gray-600">{edu.location}</span>}
              </div>
              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill} className="mb-2 mr-4">
                <span className="font-medium">{skill}</span>
                {skillLevels[skill] && (
                  <div className="mt-1">
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((level) => (
                      <span
                        key={level}
                        className={`skill-dot ${
                          level <= skillLevels[skill] ? "skill-dot-filled" : "skill-dot-empty"
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

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="text-sm">
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer} • {cert.date}</p>
                {cert.id && <p className="text-gray-500 text-xs">ID: {cert.id}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {referees.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">References</h2>
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
  );
};

export default ClassicTemplate;
