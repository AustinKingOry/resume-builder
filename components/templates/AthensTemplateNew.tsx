import type { ResumeData } from "../../lib/types"
import "./styles/athens.css"
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

interface PageProps {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
  margins: MarginProps;
  showFooter?: boolean;
  showHeader?: boolean;
}

const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages, margins, showFooter = false }) => (
  <div 
    className="athens-page a4-page" 
    style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`
    }}
  >
    {children}
    {/* Page number footer */}
    {showFooter && (
      <div className="page-footer">
        <span className="page-number">{pageNumber} of {totalPages}</span>
      </div>
    )}
  </div>
);

interface ContentSection {
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills';
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
}

export default function AthensTemplateNew({ data, margins = {} }: TemplateProps) {
  const resumeData = data;
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };
  
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Calculate available height considering margins and footer
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - margin.top - margin.bottom - 50;

  // Measure element height
  const measureElement = (element: React.ReactElement | React.ReactNode): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${A4_WIDTH - margin.left - margin.right}px`;
      tempDiv.style.padding = '0';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.visibility = 'hidden';
      
      const measureContent = () => {
        container.appendChild(tempDiv);
        
        tempDiv.innerHTML = renderToString(element);
        
        const height = tempDiv.offsetHeight;
        container.removeChild(tempDiv);
        resolve(height);
      };

      setTimeout(measureContent, 0);
    });
  };

  // Create content sections with measurement
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];

    // Header section
    const headerElement = (
      <header key="header" className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-normal text-blue-600">{resumeData.personalInfo?.name || "Your Name"}</h1>
            <p className="text-lg text-gray-700 mt-1">{resumeData.personalInfo?.title || "Your Title"}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-600">
              {resumeData.personalInfo?.email || "email@example.com"} •{" "}
              {resumeData.personalInfo?.phone || "(555) 123-4567"}
            </p>
            <p className="text-gray-700">{resumeData.personalInfo?.location || "City, State, Country"}</p>
          </div>
        </div>
      </header>
    );
    sections.push({
      type: 'header',
      content: headerElement,
      canSplit: false
    });

    // Summary section
    if (resumeData.summary) {
      const summaryElement = (
        <section key="summary" className="mb-8">
          <p className="text-gray-800">{resumeData.summary}</p>
        </section>
      );
      sections.push({
        type: 'summary',
        content: summaryElement,
        canSplit: false
      });
    }

    // Experience sections
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceItems = await Promise.all(
        resumeData.experience.map(async (exp, index) => {
          const experienceElement = (
            <div key={index} className="mb-6 experience-item">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-blue-600 font-normal">
                  {exp.company || "Company Name"}, {exp.location || "Location"}
                </h3>
                <span className="text-gray-700">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </span>
              </div>
              <p className="text-gray-800 mb-2">{exp.title || "Job Title"}</p>
              {formatDescription(exp.description)}
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
          <section className="mb-8">
            <h2 className="text-2xl font-normal text-blue-600 mb-4">Professional Experience</h2>
            {experienceItems.map(item => item.element)}
          </section>
        ),
        items: experienceItems,
        canSplit: true
      });
    }

    // Education sections
    if (resumeData.education && resumeData.education.length > 0) {
      const educationItems = await Promise.all(
        resumeData.education.map(async (edu, index) => {
          const educationElement = (
            <div key={index} className="mb-3 education-item">
              <h3 className="text-blue-600 font-normal">{edu.degree || "Degree"}</h3>
              <p className="text-gray-800">
                {edu.school || "School"}, {edu.location || "Location"}
              </p>
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
          <section className="mb-8">
            <h2 className="text-2xl font-normal text-blue-600 mb-4">Education</h2>
            {educationItems.map(item => item.element)}
          </section>
        ),
        items: educationItems,
        canSplit: true
      });
    }

    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      const uniqueKey = new Date().getTime().toString();
      const skillsElement = (
        <section className="mb-8" key={`skill-sect-${uniqueKey}`}>
          <h2 className="text-2xl font-normal text-blue-600 mb-4">Areas of Expertise</h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {(resumeData.skills || []).map((skill, index) => (
              <div key={index} className="flex items-baseline">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      );
      sections.push({
        type: 'skills',
        content: skillsElement,
        canSplit: false
      });
    }

    return sections;
  }, [resumeData]);

  // Split content into pages based on measured heights
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: React.ReactNode[] = [];
    let currentPageHeight = 0;
    let currentPageContent: React.ReactNode[] = [];
    let pageNumber = 1;

    const addPage = (content: React.ReactNode[]) => {
      newPages.push(
        <div key={`page-${pageNumber}`} className="athens-content font-sans">
          {content}
        </div>
      );
      pageNumber++;
    };

    for (const section of sections) {
      if (section.canSplit && section.items) {
        const sectionHeader = (
          <h2 key={`${section.type}-header`} className="text-2xl font-normal text-blue-600 mb-4">
            {section.type === 'experience' && 'Professional Experience'}
            {section.type === 'education' && 'Education'}
          </h2>
        );

        const headerHeight = await measureElement(sectionHeader);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          // If adding this item would exceed page height, create new page
          if (currentPageHeight + itemHeight > CONTENT_MAX_HEIGHT && currentPageContent.length > 0) {
            addPage([...currentPageContent]);
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
        currentPageHeight += 32; // mb-8 equivalent
      } else {
        // Handle non-splittable sections
        const sectionHeight = await measureElement(section.content);

        if (currentPageHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentPageContent.length > 0) {
          addPage([...currentPageContent]);
          currentPageContent = [];
          currentPageHeight = 0;
        }

        currentPageContent.push(section.content);
        currentPageHeight += sectionHeight;
      }
    }

    // Add the last page if it has content
    if (currentPageContent.length > 0) {
      addPage(currentPageContent);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="athens-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        {/* Hidden measurement container */}
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="athens-container athens-template">
      {/* Hidden measurement container */}
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      
      {pages.map((page, index) => (
        <Page 
          key={`page-${index + 1}`}
          pageNumber={index + 1} 
          totalPages={pages.length}
          margins={margin}
        >
          {page}
        </Page>
      ))}
    </div>
  );
}