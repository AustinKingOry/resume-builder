import type { ResumeData } from "../../lib/types"
import { useRef, useEffect, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";
import "./styles/singapore.css";

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

const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages, margins, showFooter }) => (
  <div 
    className="singapore-page a4-page" 
    style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
      overflow: 'hidden'
    }}
  >
    {children}
    {showFooter && 
      <div className="page-footer">
        <span className="page-number">{pageNumber} of {totalPages}</span>
      </div>
    }
  </div>
);

interface PageContent {
  main: React.ReactNode;
  sidebar: React.ReactNode;
  key: string;
}

interface ContentSection {
  type: 'header' | 'contact' | 'profile' | 'experience' | 'education';
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
  isMainColumn?: boolean;
}

export default function SingaporeTemplateNew({ data, margins = {}, showFooter = true }: TemplateProps) {
  const resumeData = data;
  
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };
  
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Calculate available height considering margins and footer
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - margin.top - margin.bottom - 40;

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
        tempDiv.innerHTML = renderToString(element as React.ReactElement);
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
      <header key="header" className="mb-12">
        <h1 className="text-4xl font-bold mb-1">{resumeData.personalInfo?.name || "Your Name"}</h1>
        <p className="text-lg font-medium">{resumeData.personalInfo?.title || "Your Title"}</p>
      </header>
    );
    sections.push({
      type: 'header',
      content: headerElement,
      canSplit: false,
      isHeader: true
    });

    // Contact Information section
    const contactElement = (
      <div key="contact" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div>
          <p className="font-medium mb-1">Address</p>
          <p className="text-gray-700 whitespace-pre-line">{resumeData.personalInfo?.location || "Your Location"}</p>
        </div>
        <div>
          <p className="font-medium mb-1">Email</p>
          <p className="text-gray-700">{resumeData.personalInfo?.email || "your.email@example.com"}</p>
        </div>
        <div>
          <p className="font-medium mb-1">Phone</p>
          <p className="text-gray-700">{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
        </div>
      </div>
    );
    sections.push({
      type: 'contact',
      content: contactElement,
      canSplit: false,
      isMainColumn: true
    });

    // Profile section
    if (resumeData.summary) {
      const profileElement = (
        <section key="profile" className="mb-12">
          <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-6">
            <span className="inline-block bg-black text-white px-2 py-1 mr-2">01</span> PROFILE
          </h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </section>
      );
      sections.push({
        type: 'profile',
        content: profileElement,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Experience sections
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceItems = await Promise.all(
        resumeData.experience.map(async (exp, index) => {
          const experienceElement = (
            <div key={index} className="mb-8 experience-item">
              <div className="mb-2 flex justify-between">
                <p className="text-gray-500 text-sm">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </p>
                <p className="text-gray-500 text-sm italic">{exp.location || "Location"}</p>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">
                {exp.title || "Job Title"} at {exp.company || "Company"}
              </h3>
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
          <section className="mb-12">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-6">
              <span className="inline-block bg-black text-white px-2 py-1 mr-2">02</span> EMPLOYMENT HISTORY
            </h2>
            {experienceItems.map(item => item.element)}
          </section>
        ),
        items: experienceItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Education sections
    if (resumeData.education && resumeData.education.length > 0) {
      const educationItems = await Promise.all(
        resumeData.education.map(async (edu, index) => {
          const educationElement = (
            <div key={index} className="mb-6 education-item">
              <div className="mb-2 flex justify-between">
                <p className="text-gray-500 text-sm">
                  {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
                </p>
                <p className="text-gray-500 text-sm italic">{edu.location || "Location"}</p>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{edu.school || "School"}</h3>
              <p className="text-gray-700">{edu.degree || "Degree"}</p>
              {edu.description && (
                <ul className="list-disc ml-5 mt-2 text-gray-700">
                  <li>{edu.description}</li>
                </ul>
              )}
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
          <section>
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-6">
              <span className="inline-block bg-black text-white px-2 py-1 mr-2">03</span> EDUCATION
            </h2>
            {educationItems.map(item => item.element)}
          </section>
        ),
        items: educationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    return sections;
  }, [resumeData]);

  // Split content into pages based on measured heights
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    
    let currentMainHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false) => {
      const content = (
        <div className="singapore-content bg-white font-sans mx-auto" style={{ height: '100%', overflow: 'hidden' }}>
          <div style={{ 
            padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
            height: 'calc(100% - 50px)',
            overflow: 'hidden'
          }}>
            {mainContent}
          </div>
        </div>
      );

      newPages.push({
        main: content,
        sidebar: <></>,
        key: `page-${pageNumber}`
      });
      pageNumber++;
      isFirstPage = false;
    };

    // Process all sections
    for (const section of sections) {
      // Skip header sections after first page
      if (section.isHeader && !isFirstPage) {
        continue;
      }

      if (section.canSplit && section.items) {
        const sectionHeader = (
          <h2 key={`${section.type}-header`} className="text-lg font-bold border-b-2 border-black pb-1 mb-6">
            <span className="inline-block bg-black text-white px-2 py-1 mr-2">
              {section.type === 'experience' && '02'}
              {section.type === 'education' && '03'}
            </span> 
            {section.type === 'experience' && 'EMPLOYMENT HISTORY'}
            {section.type === 'education' && 'EDUCATION'}
          </h2>
        );

        const headerHeight = await measureElement(sectionHeader);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          if (currentMainHeight + itemHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
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
        const sectionHeight = await measureElement(section.content);

        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          addPage([...currentMainContent], isFirstPage);
          currentMainContent = [];
          currentMainHeight = 0;
          isFirstPage = false;
        }

        currentMainContent.push(section.content);
        currentMainHeight += sectionHeight;
      }
    }

    // Add the last page if it has content
    if (currentMainContent.length > 0) {
      addPage(currentMainContent, isFirstPage);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT, margin]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="singapore-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="singapore-container singapore-template">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      
      {pages.map((page, index) => (
        <Page 
          key={page.key}
          pageNumber={index + 1} 
          totalPages={pages.length}
          margins={margin}
          showFooter={showFooter}
        >
          {page.main}
        </Page>
      ))}
    </div>
  );
}