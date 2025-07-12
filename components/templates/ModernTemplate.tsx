import Image from "next/image";
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

// Modern template with sidebar and main content
export const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-sans text-gray-800 flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-resume-navy text-white p-6">
        {personalInfo.photo && (
          <div className="mb-6 flex justify-center">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white"
              width={128}
              height={128}
            />
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{personalInfo.name}</h1>
          <p className="text-lg opacity-90">{personalInfo.title}</p>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-white/20">Contact</h2>
          <div className="space-y-2">
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="opacity-75" /> 
                <span className="text-sm">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="opacity-75" /> 
                <span className="text-sm">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="opacity-75" /> 
                <span className="text-sm">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe size={14} className="opacity-75" /> 
                <span className="text-sm">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Media */}
        {(personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-white/20">Social</h2>
            <div className="space-y-2">
              {personalInfo.socialMedia.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin size={14} className="opacity-75" />
                  <span className="text-sm">LinkedIn</span>
                </div>
              )}
              {personalInfo.socialMedia.github && (
                <div className="flex items-center gap-2">
                  <Github size={14} className="opacity-75" />
                  <span className="text-sm">GitHub</span>
                </div>
              )}
              {personalInfo.socialMedia.twitter && (
                <div className="flex items-center gap-2">
                  <Twitter size={14} className="opacity-75" />
                  <span className="text-sm">Twitter</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-white/20">Skills</h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{skill}</span>
                  </div>
                  {skillLevels[skill] && (
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div 
                        className="bg-white h-1.5 rounded-full" 
                        style={{ width: `${skillLevels[skill] || 70}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-resume-navy border-b border-resume-navy/20 pb-1">
              Profile
            </h2>
            <p>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-resume-navy border-b border-resume-navy/20 pb-1">
              Work Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold">{exp.title}</h3>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">{exp.company}</span>
                  <span className="text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-sm text-gray-600 mb-1">{exp.location}</p>
                )}
                <div className="text-sm">{formatDescription(exp.description)}</div>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-resume-navy border-b border-resume-navy/20 pb-1">
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold">{edu.degree}</h3>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">{edu.school}</span>
                  <span className="text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.location && (
                  <p className="text-sm text-gray-600 mb-1">{edu.location}</p>
                )}
                {edu.description && <p className="text-sm">{edu.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-resume-navy border-b border-resume-navy/20 pb-1">
              Certifications
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-gray-700">
                    {cert.issuer} • {cert.date}
                    {cert.expiry && ` (Expires: ${cert.expiry})`}
                  </p>
                  {cert.id && <p className="text-gray-500 text-xs">ID: {cert.id}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {referees.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xl font-bold mb-3 text-resume-navy border-b border-resume-navy/20 pb-1">
              References
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {referees.map((referee, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-semibold">{referee.name}</h3>
                  <p>{referee.position} at {referee.company}</p>
                  <div className="flex items-center gap-2 flex-wrap text-gray-600">
                    <span>{referee.email}</span>
                    <span className="text-gray-400">•</span>
                    <span>{referee.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
