/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react"
import type { ResumeData } from "../../lib/types"
import { renderToString } from "react-dom/server"
import { createUniqueKey } from "@/lib/helpers"
import "./styles/functional.css"

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

export const FunctionalTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };

  // Calculate heights and widths
  const HEADER_HEIGHT = 140; // Approximate height of the two-part header
  const CONTENT_MAX_HEIGHT_MARGIN = A4_HEIGHT - HEADER_HEIGHT - (margin.top + margin.bottom) - 40; 

  // Measurement function (USE AS-IS)
  const measureElement = useCallback((element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${A4_WIDTH}px`;
      tempDiv.style.padding = `0px`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.fontFamily = 'sans-serif';
      
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

    // Group skills by level for better organization
    const groupedSkills = skills?.reduce<Record<string, string[]>>((acc, skill) => {
      const level = skillLevels?.[skill] || 3;
      const category = level >= 4 ? "Advanced" : level >= 2 ? "Intermediate" : "Beginner";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {}) || {};
    
    // Header section (full-width blue header)
    const headerContent = (
      <div key={createUniqueKey()}>
        {/* Blue Header */}
        <div className="bg-resume-blue py-6 px-8 text-white">
          <h1 className="text-3xl font-bold">{personalInfo?.name || "Your Name"}</h1>
          <p className="text-xl mt-1">{personalInfo?.title || "Your Title"}</p>
        </div>
        
        {/* Contact Bar */}
        <div className="bg-gray-100 py-2 px-8 flex flex-wrap gap-4 justify-between text-sm">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.website && <span>{personalInfo.website}</span>}
          {personalInfo?.socialMedia?.linkedin && <span>LinkedIn</span>}
          {personalInfo?.socialMedia?.github && <span>GitHub</span>}
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

    // Summary Section
    if (summary) {
      const summaryContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-xl font-bold mb-3 text-resume-blue">Professional Summary</h2>
          <p>{summary}</p>
        </section>
      );

      sections.push({
        type: 'summary',
        content: summaryContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Core Competencies Section - Emphasized in Functional Resume
    if (skills && skills.length > 0) {
      const skillsContent = (
        <section className="mb-6" key={createUniqueKey()}>
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
      );

      sections.push({
        type: 'skills',
        content: skillsContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Certifications Section - Emphasized in Functional Resume
    if (certifications && certifications.length > 0) {
      const certificationsContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-xl font-bold mb-3 text-resume-blue">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold">{cert.name || "Certification Name"}</h3>
                <p className="text-sm">{cert.issuer || "Issuer"} • {cert.date || "Date"}</p>
                {cert.id && <p className="text-xs text-gray-500">ID: {cert.id}</p>}
              </div>
            ))}
          </div>
        </section>
      );

      sections.push({
        type: 'certifications',
        content: certificationsContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Work History Section - Less detailed in functional resume (non-splittable)
    if (experience && experience.length > 0) {
      const workHistoryContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-xl font-bold mb-3 text-resume-blue">Work History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
            {experience.map((exp, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                <div>
                  <div className="font-semibold">{exp.title || "Job Title"}</div>
                  <div className="text-sm">{exp.company || "Company"}</div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>{exp.startDate || "Start Date"} – {exp.current ? "Present" : exp.endDate || "End Date"}</div>
                  {exp.location && <div>{exp.location}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      );

      sections.push({
        type: 'work-history',
        content: workHistoryContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Education Section
    if (education && education.length > 0) {
      const educationContent = (
        <section className="mb-6" key={createUniqueKey()}>
          <h2 className="text-xl font-bold mb-3 text-resume-blue">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-semibold">{edu.degree || "Degree"}</h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate || "Start Date"} – {edu.endDate || "End Date"}
                </span>
              </div>
              <p className="text-sm">{edu.school || "School"}{edu.location && `, ${edu.location}`}</p>
            </div>
          ))}
        </section>
      );

      sections.push({
        type: 'education',
        content: educationContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // References Section
    if (referees && referees.length > 0) {
      const referencesContent = (
        <section key={createUniqueKey()}>
          <h2 className="text-xl font-bold mb-3 text-resume-blue">References</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referees.map((referee, index) => (
              <div key={index} className="text-sm">
                <h3 className="font-semibold">{referee.name || "Name"}</h3>
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
  }, [data]);

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
        <div className="resume-page font-sans text-gray-800 mx-auto" style={{ width: '100%', height: '100%' }}>
          {hasHeader && sections.find(s => s.isHeader)?.content}
          <div 
            className="p-8"
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
      
      // Functional template treats all sections as non-splittable for simplicity
      // Work History is condensed in functional resumes, so no need to split individual items
      const sectionHeight = await measureElement(section.content, false);
      // Use more conservative threshold to prevent overflow
      // Reserve extra space for potential rendering differences
      const heightWithBuffer = sectionHeight * 1.05; // 5% buffer

      if (currentMainHeight + heightWithBuffer > CONTENT_MAX_HEIGHT_MARGIN && currentMainContent.length > 0) {
        addPage([...currentMainContent], isFirstPage);
        currentMainContent = [];
        currentMainHeight = 0;
        isFirstPage = false;
      }

      currentMainContent.push(section.content);
      currentMainHeight += sectionHeight;
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
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  // Final render
  return (
    <div className="template-container functional-template">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};

export default FunctionalTemplateNew;