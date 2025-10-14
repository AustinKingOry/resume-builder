/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react"
import type { ResumeData } from "../../lib/types"
import { renderToString } from "react-dom/server"
import { createUniqueKey } from "@/lib/helpers"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import "./styles/simple.css"

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

export const SimpleTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };

  // Calculate available content height
  const HEADER_HEIGHT = 120; // Approximate height of header with avatar
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
      tempDiv.style.width = `${A4_WIDTH}px`;
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
  }, []);

  // createContentSections function - MAP ORIGINAL TEMPLATE SECTIONS
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;
    const sections: ContentSection[] = [];
    
    // Header section with avatar
    const headerContent = (
      <header className="mb-6 flex items-center gap-4" key={createUniqueKey()}>
        {personalInfo?.photo && (
          <Avatar className="w-20 h-20">
            <AvatarImage src={personalInfo.photo} alt={personalInfo.name} />
            <AvatarFallback>{personalInfo.name?.substring(0, 2) || "CN"}</AvatarFallback>
          </Avatar>
        )}
        
        <div>
          <h1 className="text-2xl font-bold mb-1">{personalInfo?.name || "Your Name"}</h1>
          <p className="text-lg text-gray-600 mb-2">{personalInfo?.title || "Your Title"}</p>
          
          {/* Simple contact details layout */}
          <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm">
            {personalInfo?.email && <div>{personalInfo.email}</div>}
            {personalInfo?.phone && <div>{personalInfo.phone}</div>}
            {personalInfo?.location && <div>{personalInfo.location}</div>}
            {personalInfo?.website && <div>{personalInfo.website}</div>}
            {personalInfo?.socialMedia?.linkedin && <div>LinkedIn</div>}
            {personalInfo?.socialMedia?.github && <div>GitHub</div>}
            {personalInfo?.socialMedia?.twitter && <div>Twitter</div>}
          </div>
        </div>
      </header>
    );

    sections.push({
      type: 'header',
      content: headerContent,
      canSplit: false,
      isHeader: true,
      isFullWidth: true
    });

    // Summary Section
    if (summary) {
      const summaryContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-lg font-semibold mb-2 border-b border-gray-200 pb-1">Summary</h2>
          <p className="text-sm">{summary}</p>
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
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold text-base">{exp.title || "Job Title"}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate || "Start Date"} - {exp.current ? "Present" : exp.endDate || "End Date"}
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{exp.company || "Company"}{exp.location && `, ${exp.location}`}</p>
              <div className="text-sm">{formatDescription(exp.description)}</div>
            </div>
          );
          
          const height = await measureElement(expContent, false);
          return { element: expContent, height };
        })
      );

      const experienceHeader = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">Experience</h2>
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
    if (education && education.length > 0) {
      const educationItems = await Promise.all(
        education.map(async (edu, index) => {
          const eduContent = (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold text-base">{edu.degree || "Degree"}</h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{edu.school || "School"}{edu.location && `, ${edu.location}`}</p>
              {edu.description && <p className="text-sm">{edu.description}</p>}
            </div>
          );
          
          const height = await measureElement(eduContent, false);
          return { element: eduContent, height };
        })
      );

      const educationHeader = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">Education</h2>
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

    // Skills Section
    if (skills && skills.length > 0) {
      const skillsContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="inline-block text-sm py-1">
                {skill}{skills.indexOf(skill) < skills.length - 1 ? "," : ""}
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

    // Certifications Section
    if (certifications && certifications.length > 0) {
      const certificationsContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-2 text-sm">
              <span className="font-medium">{cert.name || "Certification Name"}</span> • {cert.issuer || "Issuer"} • {cert.date || "Date"}
            </div>
          ))}
        </section>
      );

      sections.push({
        type: 'certifications',
        content: certificationsContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // References Section
    if (referees && referees.length > 0) {
      const referencesContent = (
        <section key={createUniqueKey()}>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">References</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {referees.map((referee, index) => (
              <div key={index} className="text-sm">
                <p className="font-semibold">{referee.name || "Name"}</p>
                <p>{referee.position || "Position"} at {referee.company || "Company"}</p>
                <p className="text-gray-600">
                  {referee.email} {referee.phone && `• ${referee.phone}`}
                </p>
              </div>
            ))}
          </div>
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
        <div className="resume-page font-sans text-gray-800 mx-auto" style={{ 
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
        // Splittable section handling (experience, education)
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
    <div className="template-container simple-template">
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

export default SimpleTemplateNew;