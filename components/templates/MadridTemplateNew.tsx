import Image from "next/image"
import type { ResumeData } from "../../lib/types"
import { useRef, useEffect, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";
import "./styles/madrid.css"

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
    className="madrid-page a4-page" 
    style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`
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
  type: 'header' | 'details' | 'profile' | 'education' | 'experience' | 'skills' | 'languages';
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
  isMainColumn?: boolean;
}

export default function MadridTemplateNew({ data, margins = {}, showFooter = true }: TemplateProps) {
  const resumeData = data;
  
  const defaultMargins = { top: 0, right: 0, bottom: 0, left: 0 };
  const margin = { ...defaultMargins, ...margins };
  
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Calculate available height considering footer
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - 40;

  // Measure element height
  const measureElement = (element: React.ReactElement | React.ReactNode): Promise<number> => {
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
  };

  // Create content sections with measurement
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];

    // Header section (photo + yellow section, only first page)
    const headerElement = (
      <div key="header" className="flex">
        {/* Photo section */}
        <div className="w-1/4">
          {resumeData.personalInfo?.photo ? (
            <Image
              src={resumeData.personalInfo.photo || "/placeholder.svg"}
              alt={resumeData.personalInfo.name}
              className="w-full h-[160px] object-cover"
              width={160}
              height={160}
              unoptimized
            />
          ) : (
            <div className="w-full h-[160px] bg-gray-200"></div>
          )}
        </div>

        {/* Yellow header section */}
        <div className="w-3/4 bg-yellow-300 p-8">
          <h1 className="text-4xl font-bold uppercase">{resumeData.personalInfo?.name || "Your Name"}</h1>
          <p className="mt-1">{resumeData.personalInfo?.title || "Your Title"}</p>
        </div>
      </div>
    );
    sections.push({
      type: 'header',
      content: headerElement,
      canSplit: false,
      isHeader: true
    });

    // Details section
    const detailsElement = (
      <div key="details" className="mb-8">
        <div className="bg-black text-white px-4 py-1 inline-block mb-4">
          <h2 className="text-sm font-bold uppercase">Details</h2>
        </div>
        <div>
          <p>{resumeData.personalInfo?.location || "Your Address"}</p>
          <p>{resumeData.personalInfo?.email || "your.email@example.com"}</p>
          <p>{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
        </div>
      </div>
    );
    sections.push({
      type: 'details',
      content: detailsElement,
      canSplit: false,
      isMainColumn: true
    });

    // Profile section
    if (resumeData.summary) {
      const profileElement = (
        <div key="profile" className="mb-8">
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Profile</h2>
          </div>
          <p className="text-gray-800">{resumeData.summary}</p>
        </div>
      );
      sections.push({
        type: 'profile',
        content: profileElement,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Education sections
    if (resumeData.education && resumeData.education.length > 0) {
      const educationItems = await Promise.all(
        resumeData.education.map(async (edu, index) => {
          const educationElement = (
            <div key={index} className="mb-4 education-item">
              <h3 className="font-bold">
                {edu.degree || "Degree"}, {edu.school || "School"}, {edu.location || "Location"}
              </h3>
              <p className="text-gray-600 uppercase text-xs mb-2">
                {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
              </p>
              {edu.description && (
                <ul className="list-disc ml-5">
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
          <div className="mb-8">
            <div className="bg-black text-white px-4 py-1 inline-block mb-4">
              <h2 className="text-sm font-bold uppercase">Education</h2>
            </div>
            {educationItems.map(item => item.element)}
          </div>
        ),
        items: educationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Experience sections
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceItems = await Promise.all(
        resumeData.experience.map(async (exp, index) => {
          const experienceElement = (
            <div key={index} className="mb-4 experience-item">
              <h3 className="font-bold">
                {exp.title || "Job Title"}, {exp.company || "Company"}, {exp.location || "Location"}
              </h3>
              <p className="text-gray-600 uppercase text-xs mb-2">
                {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
              </p>
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
          <div className="mb-8">
            <div className="bg-black text-white px-4 py-1 inline-block mb-4">
              <h2 className="text-sm font-bold uppercase">Employment History</h2>
            </div>
            {experienceItems.map(item => item.element)}
          </div>
        ),
        items: experienceItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      const skillsElement = (
        <div className="mb-8">
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Skills</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(resumeData.skills || []).map((skill, index) => (
              <div key={index} className="mb-2">
                <p>{skill}</p>
                <div className="w-full bg-gray-200 h-2 mt-1">
                  <div
                    className="bg-black h-2"
                    style={{
                      width: resumeData.skillLevels?.[skill] ? `${resumeData.skillLevels?.[skill]}%` : "70%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      sections.push({
        type: 'skills',
        content: skillsElement,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Languages section (shows if there are more than 4 skills)
    if (resumeData.skills && resumeData.skills.length > 4) {
      const languagesElement = (
        <div className="mb-8">
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Languages</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(resumeData.skills || []).map((skill, index) => (
              <div key={index} className="mb-2">
                <p>{skill}</p>
                <div className="w-full bg-gray-200 h-2 mt-1">
                  <div
                    className="bg-black h-2"
                    style={{
                      width: resumeData.skillLevels?.[skill] ? `${resumeData.skillLevels?.[skill]}%` : "70%"
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      sections.push({
        type: 'languages',
        content: languagesElement,
        canSplit: false,
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

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false) => {
      const content = (
        <div className="madrid-content bg-white font-sans mx-auto" style={{ height: '100%', overflow: 'hidden' }}>
          {hasHeader && sections.find(s => s.type === 'header')?.content}
          <div className="p-8" style={{ 
            height: hasHeader ? 'calc(100% - 160px)' : 'calc(100% - 50px)',
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

    // Process all sections except headers for main content
    const mainSections = sections.filter(section => section.isMainColumn);

    for (const section of mainSections) {
      if (section.canSplit && section.items) {
        const sectionHeader = (
          <div key={`${section.type}-header`} className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">
              {section.type === 'education' && 'Education'}
              {section.type === 'experience' && 'Employment History'}
            </h2>
          </div>
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
  }, [createContentSections, CONTENT_MAX_HEIGHT]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="madrid-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="madrid-container madrid-template">
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