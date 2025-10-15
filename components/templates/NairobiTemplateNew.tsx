/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import type { ResumeData } from "../../lib/types"
import { Globe } from "lucide-react"
import { renderToString } from "react-dom/server"
import { createUniqueKey } from "@/lib/helpers"
import "./styles/nairobi.css"

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
      <ul className="list-disc list-inside">
        {listItems.map((item, index) => (
          <li key={index}>{item.replace(/^[-*]\s*/, "")}</li>
        ))}
      </ul>
    )
  }
  return <p>{description}</p>
}

export const NairobiTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };

  // Calculate available content height
  const HEADER_HEIGHT = 180; // Approximate height of teal header with photo
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - 80 - (margin.top + margin.bottom);

  // Measurement function
  const measureElement = useCallback((element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      
      // Set up measurement container with exact page constraints
      tempDiv.style.width = `${A4_WIDTH - margin.left - margin.right}px`;
      tempDiv.style.padding = `0`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.fontFamily = 'sans-serif';
      
      const measureContent = () => {
        container.appendChild(tempDiv);
        tempDiv.innerHTML = renderToString(element as React.ReactElement);
        
        // Force layout calculation
        const height = tempDiv.offsetHeight;
        container.removeChild(tempDiv);
        resolve(height);
      };

      requestAnimationFrame(measureContent);
    });
  }, [margin.left, margin.right]);

  // createContentSections function - MAP ORIGINAL TEMPLATE SECTIONS
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];
    
    // Header section with teal background and photo
    const headerContent = (
      <header className="bg-teal-600 text-white p-6 flex justify-between items-center" key={createUniqueKey()}>
        <div>
          <h1 className="text-2xl font-bold">{data.personalInfo?.name || "Your Name"}</h1>
          <p className="text-sm">{data.personalInfo?.title || "Your Title"}</p>

          <div className="mt-4 text-sm space-y-1 flex items-center flex-row gap-3">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{data.personalInfo?.email || "your.email@example.com"}</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{data.personalInfo?.phone || "Your Phone Number"}</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{data.personalInfo?.location || "Your Location"}</span>
            </div>
            {data.personalInfo?.website && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex space-x-3">
            {data.personalInfo?.socialMedia?.linkedin && (
              <a href={data.personalInfo.socialMedia.linkedin} className="text-white hover:text-teal-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            )}
            {data.personalInfo?.socialMedia?.twitter && (
              <a href={data.personalInfo.socialMedia.twitter} className="text-white hover:text-teal-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            )}
            {data.personalInfo?.socialMedia?.github && (
              <a href={data.personalInfo.socialMedia.github} className="text-white hover:text-teal-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {data.personalInfo?.photo && (
          <div className="ml-4">
            <Image
              src={data.personalInfo.photo || "/placeholder.svg"}
              alt={data.personalInfo.name}
              className="w-28 h-28 rounded-full object-cover border-2 border-white"
              width={112}
              height={112}
            />
          </div>
        )}
      </header>
    );

    sections.push({
      type: 'header',
      content: headerContent,
      canSplit: false,
      isHeader: true,
      isFullWidth: true
    });

    // Professional Summary Section
    if (data.summary) {
      const summaryContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Professional Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
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
    if (data.experience && data.experience.length > 0) {
      const experienceItems = await Promise.all(
        data.experience.map(async (exp, index) => {
          const expContent = (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{exp.title || "Job Title"}</h3>
                  <p className="text-sm text-gray-600">
                    {exp.company || "Company"} | {exp.startDate || "Start Date"} -{" "}
                    {exp.current ? "Present" : exp.endDate || "End Date"}
                  </p>
                </div>
              </div>
              {formatDescription(exp.description)}
            </div>
          );
          
          const height = await measureElement(expContent, false);
          return { element: expContent, height };
        })
      );

      const experienceHeader = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Experience</h2>
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

    // Education Section (splittable)
    if (data.education && data.education.length > 0) {
      const educationItems = await Promise.all(
        data.education.map(async (edu, index) => {
          const eduContent = (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-gray-800">{edu.degree || "Degree"}</h3>
              <p className="text-sm text-gray-600">
                {edu.school || "School"} | {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
              </p>
              {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
            </div>
          );
          
          const height = await measureElement(eduContent, false);
          return { element: eduContent, height };
        })
      );

      const educationHeader = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Education</h2>
        </section>
      );

      sections.push({
        type: 'education',
        content: educationHeader,
        items: educationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Skills Section - Non-splittable (teal tags stay together)
    if (data.skills && data.skills.length > 0) {
      const skillsContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">
                {skill}
              </span>
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

    // Certifications Section (splittable)
    if (data.certifications && data.certifications.length > 0) {
        // Group certifications to maintain proper UL structure
        const certificationGroups = [];
        for (let i = 0; i < data.certifications.length; i++) {
          certificationGroups.push([data.certifications[i]]);
        }
      
        const certificationItems = await Promise.all(
          certificationGroups.map(async (certGroup, groupIndex) => {
            const certContent = (
              <ul className="list-disc ml-5 text-sm text-gray-700" key={`${groupIndex}-${createUniqueKey()}`}>
                {certGroup.map((cert, index) => (
                  <li key={index} className="mb-2">
                    <h3 className="text-lg font-semibold">{cert.name || "Certification Name"}</h3>
                    <p className="text-gray-600">
                      {cert.issuer || "Issuer"} | {cert.date || "Date"}
                    </p>
                  </li>
                ))}
              </ul>
            );
            
            const height = await measureElement(certContent, false);
            return { element: certContent, height };
          })
        );
      
        const certificationsHeader = (
          <section className="mb-6" key={createUniqueKey()}>
            <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Certifications</h2>
          </section>
        );
      
        sections.push({
          type: 'certifications',
          content: certificationsHeader,
          items: certificationItems,
          canSplit: true,
          isMainColumn: true
        });
      }

    // References Section - Non-splittable (simple message)
    if (data.referees && data.referees.length > 0) {
      const referencesContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">References</h2>
          <p className="text-sm text-gray-700">Available upon request</p>
        </section>
      );

      sections.push({
        type: 'references',
        content: referencesContent,
        canSplit: false,
        isMainColumn: true
      });
    }

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
        <div className="bg-white font-sans mx-auto" style={{ width: '100%', height: '100%' }}>
          {hasHeader && sections.find(s => s.isHeader)?.content}
          <div 
            className="p-6"
            style={{
              padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
            }}
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
        // Splittable section handling (experience, education, certifications)
        const sectionHeader = section.content;
        const headerHeight = await measureElement(sectionHeader, false);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          // Use conservative threshold with buffer
          const heightWithBuffer = itemHeight * 1.05;

          if (currentMainHeight + heightWithBuffer > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
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
        const heightWithBuffer = sectionHeight * 1.05;

        if (currentMainHeight + heightWithBuffer > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
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
  }, [createContentSections, CONTENT_MAX_HEIGHT, measureElement, margin.top, margin.right, margin.bottom, margin.left]);

  // useEffect for splitContentIntoPages
  useEffect(() => {
    let isMounted = true;
    
    const executeSplit = async () => {
      await splitContentIntoPages();
    };

    if (isMounted) {
      executeSplit();
    }

    return () => {
      isMounted = false;
    };
  }, [splitContentIntoPages]);

  // Loading state
  if (isMeasuring || pages.length === 0) {
    return (
      <div className="template-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ 
          position: 'absolute', 
          left: -9999, 
          top: -9999,
          width: `${A4_WIDTH}px`,
          fontFamily: 'sans-serif'
        }} />
      </div>
    );
  }

  // Final render
  return (
    <div className="template-container nairobi-template">
      <div ref={measurementRef} style={{ 
        position: 'absolute', 
        left: -9999, 
        top: -9999,
        width: `${A4_WIDTH}px`,
        fontFamily: 'sans-serif'
      }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};

export default NairobiTemplateNew;