/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import type { ResumeData } from "../../lib/types"
import { Phone, Mail, MapPin, Globe, Linkedin, Twitter, Github } from "lucide-react";
import "./styles/modern.css";
import { useRef, useEffect, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";

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

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794; // 210mm
const A4_HEIGHT = 1123; // 297mm

interface PageProps {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
}

interface PageContent {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  key: string;
}

interface ContentSection {
  type: 'summary' | 'experience' | 'education' | 'certifications' | 'references';
  content: React.ReactNode;
  items?: any[];
  canSplit?: boolean;
}

// Add margin interface and props
interface MarginProps {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface TemplateProps {
  data: ResumeData;
  margins?: MarginProps;
}

// Modern template with automatic pagination
export const ModernTemplate: React.FC<TemplateProps> = ({ data, margins = {} }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;
  
  // Default margins
  const defaultMargins = { top: 20, right: 20, bottom: 20, left: 20 };
  const margin = { ...defaultMargins, ...margins };
  // Calculate available heights considering margins
  const MAIN_CONTENT_MAX_HEIGHT = A4_HEIGHT - margin.top - margin.bottom - 80; // Reserve space for footer
  const SIDEBAR_MAX_HEIGHT = A4_HEIGHT - margin.top - margin.bottom - 80;
  
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages }) => (
    <div className="resume-page a4-page" style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
      boxSizing: 'border-box'
    }}>
      {children}
      {/* Page number footer */}
      {/* <div className="page-footer">
        <span className="page-number">{pageNumber} of {totalPages}</span>
      </div> */}
    </div>
  );

  // Split sidebar content into pages
  const splitSidebarIntoPages = useCallback(async () => {
    const sidebarSections: React.ReactNode[] = [];
    let currentSidebarHeight = 0;
    let currentSidebarContent: React.ReactNode[] = [];
    const sidebarPages: React.ReactNode[][] = [];

    // Photo section
    if (personalInfo.photo) {
      const photoElement = (
        <div key="photo" className="mb-6 flex justify-center">
          <Image
            src={personalInfo.photo}
            alt={personalInfo.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
            width={128}
            height={128}
          />
        </div>
      );
      sidebarSections.push(photoElement);
    }

    // Name and title
    const nameElement = (
      <div key="name" className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{personalInfo.name}</h1>
        <p className="text-lg opacity-90">{personalInfo.title}</p>
      </div>
    );
    sidebarSections.push(nameElement);

    // Contact section
    const contactElements = [];
    if (personalInfo.phone || personalInfo.email || personalInfo.location || personalInfo.website) {
      contactElements.push(
        <div key="contact" className="mb-8">
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
      );
    }
    sidebarSections.push(...contactElements);

    // Social Media section
    if (personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) {
      const socialElement = (
        <div key="social" className="mb-8">
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
      );
      sidebarSections.push(socialElement);
    }

    // Skills section - split if needed
    if (skills.length > 0) {
      // Try to fit all skills in one section first
      const allSkillsElement = (
        <div key="skills-all" className="mb-6">
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
      );

      const skillsHeight = await measureElement(allSkillsElement);
      
      if (skillsHeight > SIDEBAR_MAX_HEIGHT * 0.6) {
        // Split skills into multiple sections
        const skillsPerPage = Math.floor(skills.length / 2);
        const firstPageSkills = skills.slice(0, skillsPerPage);
        const secondPageSkills = skills.slice(skillsPerPage);

        const firstSkillsElement = (
          <div key="skills-1" className="mb-6">
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-white/20">Skills (1/2)</h2>
            <div className="space-y-3">
              {firstPageSkills.map((skill) => (
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
        );

        const secondSkillsElement = (
          <div key="skills-2" className="mb-6">
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-white/20">Skills (2/2)</h2>
            <div className="space-y-3">
              {secondPageSkills.map((skill) => (
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
        );

        sidebarSections.push(firstSkillsElement);
        // We'll handle the second skills section in the pagination logic
        sidebarSections.push(secondSkillsElement);
      } else {
        sidebarSections.push(allSkillsElement);
      }
    }

    // Distribute sidebar sections across pages
    for (const section of sidebarSections) {
      const sectionHeight = await measureElement(section as React.ReactElement);

      if (currentSidebarHeight + sectionHeight > SIDEBAR_MAX_HEIGHT && currentSidebarContent.length > 0) {
        sidebarPages.push([...currentSidebarContent]);
        currentSidebarContent = [];
        currentSidebarHeight = 0;
      }

      currentSidebarContent.push(section);
      currentSidebarHeight += sectionHeight;
    }

    // Add the last page
    if (currentSidebarContent.length > 0) {
      sidebarPages.push(currentSidebarContent);
    }

    return sidebarPages;
  }, [personalInfo, skills, skillLevels]);

  // Generate sidebar content (static across all pages)
  // const sidebarContent = useMemo(
  //   () => (
  //   <div className="w-1/3 bg-resume-navy text-white p-4 sidebar h-full">
  //     {personalInfo.photo && (
  //       <div className="mb-6 flex justify-center">
  //         <Image
  //           src={personalInfo.photo}
  //           alt={personalInfo.name}
  //           className="w-32 h-32 rounded-full object-cover border-4 border-white"
  //           width={128}
  //           height={128}
  //         />
  //       </div>
  //     )}

  //     <div className="mb-6">
  //       <h1 className="text-2xl font-bold mb-1">{personalInfo.name}</h1>
  //       <p className="text-lg opacity-90">{personalInfo.title}</p>
  //     </div>

  //     {/* Contact */}
  //     <div className="mb-8">
  //       <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-white/20">Contact</h2>
  //       <div className="space-y-2">
  //         {personalInfo.phone && (
  //           <div className="flex items-center gap-2">
  //             <Phone size={14} className="opacity-75" /> 
  //             <span className="text-sm">{personalInfo.phone}</span>
  //           </div>
  //         )}
  //         {personalInfo.email && (
  //           <div className="flex items-center gap-2">
  //             <Mail size={14} className="opacity-75" /> 
  //             <span className="text-sm">{personalInfo.email}</span>
  //           </div>
  //         )}
  //         {personalInfo.location && (
  //           <div className="flex items-center gap-2">
  //             <MapPin size={14} className="opacity-75" /> 
  //             <span className="text-sm">{personalInfo.location}</span>
  //           </div>
  //         )}
  //         {personalInfo.website && (
  //           <div className="flex items-center gap-2">
  //             <Globe size={14} className="opacity-75" /> 
  //             <span className="text-sm">{personalInfo.website}</span>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     {/* Social Media */}
  //     {(personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) && (
  //       <div className="mb-8">
  //         <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-white/20">Social</h2>
  //         <div className="space-y-2">
  //           {personalInfo.socialMedia.linkedin && (
  //             <div className="flex items-center gap-2">
  //               <Linkedin size={14} className="opacity-75" />
  //               <span className="text-sm">LinkedIn</span>
  //             </div>
  //           )}
  //           {personalInfo.socialMedia.github && (
  //             <div className="flex items-center gap-2">
  //               <Github size={14} className="opacity-75" />
  //               <span className="text-sm">GitHub</span>
  //             </div>
  //           )}
  //           {personalInfo.socialMedia.twitter && (
  //             <div className="flex items-center gap-2">
  //               <Twitter size={14} className="opacity-75" />
  //               <span className="text-sm">Twitter</span>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     )}

  //     {/* Skills */}
  //     {skills.length > 0 && (
  //       <div className="mb-6">
  //         <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-white/20">Skills</h2>
  //         <div className="space-y-3">
  //           {skills.map((skill) => (
  //             <div key={skill} className="mb-2">
  //               <div className="flex justify-between mb-1">
  //                 <span className="text-sm">{skill}</span>
  //               </div>
  //               {skillLevels[skill] && (
  //                 <div className="w-full bg-white/20 rounded-full h-1.5">
  //                   <div 
  //                     className="bg-white h-1.5 rounded-full" 
  //                     style={{ width: `${skillLevels[skill] || 70}%` }}
  //                   ></div>
  //                 </div>
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  //   ), [personalInfo, skillLevels, skills]
  // );

  // Measure element height
  const measureElement = (element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      const contentWidth = isSidebar ? A4_WIDTH * 0.33 - margin.left - margin.right : A4_WIDTH * 0.66 - margin.left - margin.right;
      tempDiv.style.width = `${contentWidth}px`; // Main content width
      tempDiv.style.padding = '16px';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.visibility = 'hidden';
      
      // Create a React element and measure it
      const measureContent = () => {
        container.appendChild(tempDiv);
        
        // Use React to render the element temporarily
        // const { renderToString } = require('react-dom/server');
        tempDiv.innerHTML = renderToString(element);
        
        // Force reflow to ensure proper height calculation
        const height = tempDiv.offsetHeight;
        
        container.removeChild(tempDiv);
        resolve(height);
      };

      // Use setTimeout to ensure DOM is ready
      setTimeout(measureContent, 0);
    });
  };

  // Create content sections with measurement
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];

    // Summary section
    if (summary) {
      const unique_key = new Date().getTime().toString()
      const summaryElement = (
        <section className="mb-6 summary-section" key={unique_key}>
          <h2 className="text-xl font-bold mb-3 text-resume-navy border-b border-resume-navy/20 pb-1">
            Profile
          </h2>
          <p>{summary}</p>
        </section>
      );
      sections.push({
        type: 'summary',
        content: summaryElement,
        canSplit: false
      });
    }

    // Experience sections - split by individual items
    if (experience.length > 0) {
      const experienceItems = await Promise.all(
        experience.map(async (exp, index) => {
          const experienceElement = (
            <div key={index} className="mb-4 experience-item">
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
          );

          return {
            element: experienceElement,
            height: await measureElement(experienceElement),
            data: exp
          };
        })
      );

      sections.push({
        type: 'experience',
        content: (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-resume-navy border-b border-resume-navy/20 pb-1">
              Work Experience
            </h2>
            {experienceItems.map(item => item.element)}
          </section>
        ),
        items: experienceItems,
        canSplit: true
      });
    }

    // Education sections
    if (education.length > 0) {
      const educationItems = await Promise.all(
        education.map(async (edu, index) => {
          const educationElement = (
            <div key={index} className="mb-4 education-item">
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
          );

          return {
            element: educationElement,
            height: await measureElement(educationElement),
            data: edu
          };
        })
      );

      sections.push({
        type: 'education',
        content: (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-resume-navy border-b border-resume-navy/20 pb-1">
              Education
            </h2>
            {educationItems.map(item => item.element)}
          </section>
        ),
        items: educationItems,
        canSplit: true
      });
    }

    // Certifications sections
    if (certifications.length > 0) {
      const certificationItems = await Promise.all(
        certifications.map(async (cert, index) => {
          const certificationElement = (
            <div key={index} className="text-sm certification-item">
              <h3 className="font-semibold">{cert.name}</h3>
              <p className="text-gray-700">
                {cert.issuer} • {cert.date}
                {cert.expiry && ` (Expires: ${cert.expiry})`}
              </p>
              {cert.id && <p className="text-gray-500 text-xs">ID: {cert.id}</p>}
            </div>
          );

          return {
            element: certificationElement,
            height: await measureElement(
              <div className="grid grid-cols-1 gap-3">
                {certificationElement}
              </div>
            ),
            data: cert
          };
        })
      );

      sections.push({
        type: 'certifications',
        content: (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-resume-navy border-b border-resume-navy/20 pb-1">
              Certifications
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {certificationItems.map(item => item.element)}
            </div>
          </section>
        ),
        items: certificationItems,
        canSplit: true
      });
    }

    // References sections
    if (referees.length > 0) {
      const referenceItems = await Promise.all(
        referees.map(async (referee, index) => {
          const referenceElement = (
            <div key={index} className="text-sm reference-item">
              <h3 className="font-semibold">{referee.name}</h3>
              <p>{referee.position} at {referee.company}</p>
              <div className="flex items-center gap-2 flex-wrap text-gray-600">
                <span>{referee.email}</span>
                <span className="text-gray-400">•</span>
                <span>{referee.phone}</span>
              </div>
            </div>
          );

          return {
            element: referenceElement,
            height: await measureElement(
              <div className="grid grid-cols-1 gap-3">
                {referenceElement}
              </div>
            ),
            data: referee
          };
        })
      );

      sections.push({
        type: 'references',
        content: (
          <section className="mb-4">
            <h2 className="text-xl font-bold mb-3 text-resume-navy border-b border-resume-navy/20 pb-1">
              References
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {referenceItems.map(item => item.element)}
            </div>
          </section>
        ),
        items: referenceItems,
        canSplit: true
      });
    }

    return sections;
  }, [summary, experience, education, certifications, referees]);

  // Split content into pages based on measured heights
  const splitContentIntoPages = useCallback(async () => {
    const sidebarPages = await splitSidebarIntoPages();
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    let currentPageHeight = 0;
    let currentPageContent: React.ReactNode[] = [];
    let pageNumber = 1;

    const addPage = (sidebarContent: React.ReactNode[], content: React.ReactNode[]) => {
      newPages.push({
        sidebar: (
          <div className="w-1/3 bg-resume-navy text-white p-4 sidebar h-full">
            {sidebarContent}
          </div>
        ),
        main: <div className="main-content-inner">{content}</div>,
        key: `page-${pageNumber}`
      });
      pageNumber++;
    };

    for (const section of sections) {
      // If section has splittable items, handle them individually
      if (section.canSplit && section.items) {
        const sectionHeader = (
          <h2 key={`${section.type}-header`} className="text-xl font-bold mb-4 text-resume-navy border-b border-resume-navy/20 pb-1">
            {section.type === 'experience' && 'Work Experience'}
            {section.type === 'education' && 'Education'}
            {section.type === 'certifications' && 'Certifications'}
            {section.type === 'references' && 'References'}
          </h2>
        );

        const headerHeight = await measureElement(sectionHeader);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          // If adding this item would exceed page height, create new page
          if (currentPageHeight + itemHeight > MAIN_CONTENT_MAX_HEIGHT && currentPageContent.length > 0) {
            const sidebarPage = sidebarPages[newPages.length] || sidebarPages[sidebarPages.length - 1] || [];
            addPage(sidebarPage, [...currentPageContent]);
            currentPageContent = [];
            currentPageHeight = 0;
            
            // Add header again for new page if this is not the first item
            if (index > 0) {
              currentPageContent.push(sectionHeader);
              currentPageHeight += headerHeight;
            }
          }

          currentPageContent.push(...itemWithHeader);
          currentPageHeight += itemHeight;
        }

        // Add section spacing
        currentPageHeight += 24; // mb-6 equivalent
      } else {
        // Handle non-splittable sections (like summary)
        const sectionHeight = await measureElement(section.content);

        if (currentPageHeight + sectionHeight > MAIN_CONTENT_MAX_HEIGHT && currentPageContent.length > 0) {
          const sidebarPage = sidebarPages[newPages.length] || sidebarPages[sidebarPages.length - 1] || [];
          addPage(sidebarPage, [...currentPageContent]);
          currentPageContent = [];
          currentPageHeight = 0;
        }

        currentPageContent.push(section.content);
        currentPageHeight += sectionHeight;
      }
    }
    // Add remaining pages
    while (newPages.length < sidebarPages.length || currentPageContent.length > 0) {
      const sidebarPage = sidebarPages[newPages.length] || sidebarPages[sidebarPages.length - 1] || [];
      addPage(sidebarPage, [...currentPageContent]);
      currentPageContent = [];
      currentPageHeight = 0;
    }

    // Add the last page if it has content
    // if (currentPageContent.length > 0) {
    //   addPage(currentPageContent);
    // }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, splitSidebarIntoPages]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="resume-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        {/* Hidden measurement container */}
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="resume-container">
      {/* Hidden measurement container */}
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      
      {pages.map((page, index) => (
        <Page key={`${page.key}-${index}`} pageNumber={index + 1} totalPages={pages.length}>
          <div className="resume-content font-sans text-gray-800 flex h-full">
            {page.sidebar}
            <div className="w-2/3 p-4 main-content overflow-hidden">
              {page.main}
            </div>
          </div>
        </Page>
      ))}
    </div>
  );
};

export default ModernTemplate;