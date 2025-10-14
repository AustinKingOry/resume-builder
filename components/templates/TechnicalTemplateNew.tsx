/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react"
import type { ResumeData } from "../../lib/types"
import { renderToString } from "react-dom/server"
import { createUniqueKey } from "@/lib/helpers"
import "./styles/technical.css"

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794; // 210mm
const A4_HEIGHT = 1123; // 297mm

interface MarginProps {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface TemplateProps {
  data: ResumeData;
  margins?: MarginProps;
  showFooter?: boolean;
}

interface PageProps {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
  margins: MarginProps;
  showFooter?: boolean;
}

interface PageContent {
  main: React.ReactNode;
  sidebar: React.ReactNode;
  key: string;
}

interface ContentSection {
  type: string;
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
  isMainColumn?: boolean;
  isSidebar?: boolean;
  isFullWidth?: boolean;
}

const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages, margins, showFooter }) => (
  <div className="template-page a4-page" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
    {children}
    {showFooter && 
      <div className="page-footer">
        <span className="page-number">{pageNumber} of {totalPages}</span>
      </div>
    }
  </div>
);

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

export const TechnicalTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };

  // Calculate heights and widths
  const CONTENT_MAX_HEIGHT_MARGIN = A4_HEIGHT - 80 - (margin.top + margin.bottom);

  // Measurement function (USE AS-IS from Madrid template)
  const measureElement = useCallback((element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${A4_WIDTH}px`;
      tempDiv.style.padding = '0';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.visibility = 'hidden';
      
      const measureContent = () => {
        container.appendChild(tempDiv);
        tempDiv.innerHTML = renderToString(element as React.ReactElement);
        const height = tempDiv.offsetHeight;
        container.removeChild(tempDiv);
        resolve(height);
      };

      setTimeout(measureContent, 0);
    });
  }, []);

  // createContentSections function - MAP ORIGINAL TEMPLATE SECTIONS
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;
    const sections: ContentSection[] = [];
    
    // Header section (full-width)
    const headerContent = (
      <div className="mb-4 border-b-2 border-resume-blue pb-4" key={createUniqueKey()}>
        <h1 className="text-2xl font-bold mb-1">{personalInfo?.name || "Your Name"}</h1>
        <p className="text-lg text-resume-blue mb-2">{personalInfo?.title || "Your Title"}</p>
        
        <div className="flex flex-wrap gap-3 text-sm">
          {personalInfo?.email && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">@</span> {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">#</span> {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">&gt;</span> {personalInfo.location}
            </span>
          )}
          {personalInfo?.website && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">~/</span> {personalInfo.website}
            </span>
          )}
          {personalInfo?.socialMedia?.github && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">git:</span> GitHub
            </span>
          )}
          {personalInfo?.socialMedia?.linkedin && (
            <span className="inline-flex items-center">
              <span className="font-bold mr-1">in:</span> LinkedIn
            </span>
          )}
        </div>
      </div>
    );

    sections.push({
      type: 'header',
      content: headerContent,
      canSplit: false,
      isHeader: true,
      isFullWidth: true
    });

    // Technical Skills Section (full-width)
    if (skills && skills.length > 0) {
      const skillsContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-lg font-bold mb-3 bg-resume-blue text-white py-1 px-2">
            {"// Technical Skills"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div key={skill} className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill}</span>
                  {skillLevels?.[skill] && (
                    <div className="flex">
                      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((level) => (
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
      );

      sections.push({
        type: 'skills',
        content: skillsContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Summary Section (full-width)
    if (summary) {
      const summaryContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-lg font-bold mb-2 bg-gray-100 py-1 px-2">
            {"// Summary"}
          </h2>
          <p className="text-sm whitespace-pre-line">{summary}</p>
        </section>
      );

      sections.push({
        type: 'summary',
        content: summaryContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Experience Section (splittable)
    if (experience && experience.length > 0) {
      const experienceItems = await Promise.all(
        experience.map(async (exp, index) => {
          const expContent = (
            <div key={index} className="mb-4">
              <div className="flex flex-wrap justify-between items-baseline mb-1">
                <h3 className="font-bold text-resume-blue">
                  {exp.title || "Job Title"} @ {exp.company || "Company"}
                </h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate || "Start Date"} → {exp.current ? "Present" : exp.endDate || "End Date"}
                </span>
              </div>
              {exp.location && <p className="text-xs text-gray-600 mb-1">{exp.location}</p>}
              <div className="text-sm whitespace-pre-line">{formatDescription(exp.description)}</div>
            </div>
          );
          
          const height = await measureElement(expContent, false);
          return { element: expContent, height };
        })
      );

      const experienceHeader = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-lg font-bold mb-3 bg-gray-100 py-1 px-2">
            {"// Experience"}
          </h2>
        </section>
      );

      sections.push({
        type: 'experience',
        content: experienceHeader,
        items: experienceItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Two-column container for Education, Certifications, and References
    const twoColumnContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={createUniqueKey()}>
        {/* Left column - Education */}
        <div>
          {education && education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 bg-gray-100 py-1 px-2">
                {"// Education"}
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="font-bold text-sm">{edu.degree || "Degree"}</h3>
                    <span className="text-xs text-gray-600">
                      {edu.startDate || "Start Date"} → {edu.endDate || "End Date"}
                    </span>
                  </div>
                  <p className="text-sm">{edu.school || "School"}</p>
                  {edu.location && <p className="text-xs text-gray-600">{edu.location}</p>}
                  {edu.description && <p className="text-xs mt-1">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column - Certifications & References */}
        <div>
          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 bg-gray-100 py-1 px-2">
                {"// Certifications"}
              </h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-2 text-sm">
                  <div className="font-semibold">{cert.name || "Certification Name"}</div>
                  <div className="text-xs">
                    <span>{cert.issuer || "Issuer"}</span>
                    <span className="mx-1">•</span>
                    <span>{cert.date || "Date"}</span>
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
          {referees && referees.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 bg-gray-100 py-1 px-2">
                {"// References"}
              </h2>
              {referees.map((referee, index) => (
                <div key={index} className="mb-3 text-sm">
                  <div className="font-bold">{referee.name || "Name"}</div>
                  <div className="text-xs">{referee.position || "Position"} @ {referee.company || "Company"}</div>
                  <div className="text-xs text-gray-600">
                    {referee.email} {referee.phone && `• ${referee.phone}`}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    );

    sections.push({
      type: 'two-column',
      content: twoColumnContent,
      canSplit: false,
      isMainColumn: true
    });

    return sections;
  }, [data, measureElement]);

  // splitContentIntoPages function - USE PROVEN LOGIC
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    
    let currentMainHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false) => {
      const pageContent = (
        <div className="resume-page font-mono text-gray-800 mx-auto" style={{ 
          width: '100%', 
          height: '100%',          
          padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` 
          }}>
          {hasHeader && sections.find(s => s.isHeader)?.content}
          <div 
            className="add-padding"
          >
            {mainContent}
          </div>
        </div>
      );

      newPages.push({
        main: pageContent,
        sidebar: null,
        key: `page-${pageNumber}`
      });
      pageNumber++;
    };

    // Process main content sections
    const mainSections = sections.filter(section => section.isMainColumn || section.isFullWidth || section.isHeader);
    
    for (const section of mainSections) {
      if (section.isHeader) continue;
      
      if (section.canSplit && section.items) {
        // Splittable section handling (experience)
        const sectionHeader = section.content;
        const headerHeight = await measureElement(sectionHeader, false);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          if (currentMainHeight + itemHeight > CONTENT_MAX_HEIGHT_MARGIN && currentMainContent.length > 0) {
            addPage([...currentMainContent], isFirstPage);
            currentMainContent = [];
            currentMainHeight = 0;
            isFirstPage = false;
            
            if (index > 0) {
              currentMainContent.push(sectionHeader);
              currentMainHeight += headerHeight;
            }
          }

          currentMainContent.push(...itemWithHeader);
          currentMainHeight += itemHeight;
        }
      } else {
        // Non-splittable section handling
        const sectionHeight = await measureElement(section.content, false);

        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT_MARGIN && currentMainContent.length > 0) {
          addPage([...currentMainContent], isFirstPage);
          currentMainContent = [];
          currentMainHeight = 0;
          isFirstPage = false;
        }

        currentMainContent.push(section.content);
        currentMainHeight += sectionHeight;
      }
    }

    // Add final page
    if (currentMainContent.length > 0) {
      addPage(currentMainContent, isFirstPage);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT_MARGIN, measureElement, margin.top, margin.right, margin.bottom, margin.left]);

  // useEffect for splitContentIntoPages
  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  // Loading state
  if (isMeasuring || pages.length === 0) {
    return (
      <div className="template-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  // Final render
  return (
    <div className="template-container technical-template">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};

export default TechnicalTemplateNew;