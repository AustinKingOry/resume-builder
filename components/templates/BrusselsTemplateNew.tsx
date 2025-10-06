import type { ResumeData } from "../../lib/types";
import { useRef, useEffect, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";
import "./styles/brussels.css"

const formatDescription = (description: string | undefined) => {
    if (!description) return null
    const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
    if (listItems.length > 0) {
      return (
        <ul className="list-disc list-inside space-y-2">
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

const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages, margins, showFooter=false }) => (
  <div 
    className="brussels-page a4-page" 
    style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`
    }}
  >
    {children}
    {/* Page number footer */}
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
  type: 'header' | 'profile' | 'experience' | 'education' | 'contact' | 'skills';
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isSidebar?: boolean;
}

export default function BrusselsTemplateNew({ data, margins = {}, showFooter=false }: TemplateProps) {
  const resumeData = data;
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };
  
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Calculate available heights considering margins and footer
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - margin.top - margin.bottom - 50;
  const MAIN_COLUMN_WIDTH = A4_WIDTH * 0.66 - margin.left - margin.right;
  const SIDEBAR_WIDTH = A4_WIDTH * 0.33 - margin.left - margin.right;

  // Measure element height
  const measureElement = (element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      tempDiv.style.width = isSidebar ? `${SIDEBAR_WIDTH}px` : `${MAIN_COLUMN_WIDTH}px`;
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

    // Header section (main column)
    const headerElement = (
      <header key="header" className="mb-8">
        <h1 className="text-4xl font-normal text-orange-400">{resumeData.personalInfo?.name || "Your Name"}</h1>
        <p className="text-gray-700 mt-1">{resumeData.personalInfo?.title || "Your Title"}</p>
      </header>
    );
    sections.push({
      type: 'header',
      content: headerElement,
      canSplit: false,
      isSidebar: false
    });

    // Profile section (main column)
    if (resumeData.summary) {
      const profileElement = (
        <section key="profile" className="mb-8">
          <h2 className="text-xl font-normal text-orange-400 mb-3">Profile</h2>
          <p className="text-gray-800">{resumeData.summary}</p>
        </section>
      );
      sections.push({
        type: 'profile',
        content: profileElement,
        canSplit: false,
        isSidebar: false
      });
    }

    // Experience sections (main column)
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceItems = await Promise.all(
        resumeData.experience.map(async (exp, index) => {
          const experienceElement = (
            <div key={index} className="mb-6 experience-item">
              <h3 className="font-bold text-gray-800">
                {exp.title || "Job Title"} at {exp.company || "Company"}, {exp.location || "Location"}
              </h3>
              <p className="text-gray-600 mb-2">
                {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
              </p>
              {formatDescription(exp.description)}
            </div>
          );

          return {
            element: experienceElement,
            height: await measureElement(experienceElement, false),
            data: exp
          };
        })
      );

      sections.push({
        type: 'experience',
        content: (
          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Employment History</h2>
            {experienceItems.map(item => item.element)}
          </section>
        ),
        items: experienceItems,
        canSplit: true,
        isSidebar: false
      });
    }

    // Education sections (main column)
    if (resumeData.education && resumeData.education.length > 0) {
      const educationItems = await Promise.all(
        resumeData.education.map(async (edu, index) => {
          const educationElement = (
            <div key={index} className="mb-4 education-item">
              <h3 className="font-bold text-gray-800">
                {edu.school || "School"}, {edu.location || "Location"}
              </h3>
              <p className="text-gray-800">{edu.degree || "Degree"}</p>
              <p className="text-gray-600 mb-2">
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
            height: await measureElement(educationElement, false),
            data: edu
          };
        })
      );

      sections.push({
        type: 'education',
        content: (
          <section className="mb-8">
            <h2 className="text-xl font-normal text-orange-400 mb-3">Education</h2>
            {educationItems.map(item => item.element)}
          </section>
        ),
        items: educationItems,
        canSplit: true,
        isSidebar: false
      });
    }

    // Sidebar sections
    // Address section (sidebar)
    const addressElement = (
      <section key="address" className="mb-8 mt-24">
        <h2 className="text-xl font-normal text-orange-400 mb-3">Address</h2>
        <p className="text-gray-800">{resumeData.personalInfo?.location || "Your Address"}</p>
      </section>
    );
    sections.push({
      type: 'contact',
      content: addressElement,
      canSplit: false,
      isSidebar: true
    });

    // Email section (sidebar)
    const emailElement = (
      <section key="email" className="mb-8">
        <h2 className="text-xl font-normal text-orange-400 mb-3">Email</h2>
        <p className="text-gray-800">{resumeData.personalInfo?.email || "your.email@example.com"}</p>
      </section>
    );
    sections.push({
      type: 'contact',
      content: emailElement,
      canSplit: false,
      isSidebar: true
    });

    // Phone section (sidebar)
    const phoneElement = (
      <section key="phone" className="mb-8">
        <h2 className="text-xl font-normal text-orange-400 mb-3">Phone</h2>
        <p className="text-gray-800">{resumeData.personalInfo?.phone || "Your Phone Number"}</p>
      </section>
    );
    sections.push({
      type: 'contact',
      content: phoneElement,
      canSplit: false,
      isSidebar: true
    });

    // Skills section (sidebar)
    if (resumeData.skills && resumeData.skills.length > 0) {
      const skillsElement = (
        <section key="skills" className="mb-8">
          <h2 className="text-xl font-normal text-orange-400 mb-3">Skills</h2>
          <ul className="space-y-1">
            {(resumeData.skills || []).map((skill, index) => (
              <li key={index} className="text-gray-800">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      );
      sections.push({
        type: 'skills',
        content: skillsElement,
        canSplit: false,
        isSidebar: true
      });
    }

    return sections;
  }, [resumeData]);

  // Split content into pages based on measured heights
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    
    let currentMainHeight = 0;
    let currentSidebarHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let currentSidebarContent: React.ReactNode[] = [];
    let pageNumber = 1;

    const addPage = (mainContent: React.ReactNode[], sidebarContent: React.ReactNode[]) => {
      newPages.push({
        main: (
          <div className="md:w-2/3">
            {mainContent}
          </div>
        ),
        sidebar: (
          <div className="md:w-1/3">
            {sidebarContent}
          </div>
        ),
        key: `page-${pageNumber}`
      });
      pageNumber++;
    };

    // Separate main and sidebar content
    const mainSections = sections.filter(section => !section.isSidebar);
    const sidebarSections = sections.filter(section => section.isSidebar);

    // Process main content
    for (const section of mainSections) {
      if (section.canSplit && section.items) {
        const sectionHeader = (
          <h2 key={`${section.type}-header`} className="text-xl font-normal text-orange-400 mb-3">
            {section.type === 'experience' && 'Employment History'}
            {section.type === 'education' && 'Education'}
          </h2>
        );

        const headerHeight = await measureElement(sectionHeader, false);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          // If adding this item would exceed page height, create new page
          if (currentMainHeight + itemHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
            addPage([...currentMainContent], [...currentSidebarContent]);
            currentMainContent = [];
            currentSidebarContent = [];
            currentMainHeight = 0;
            currentSidebarHeight = 0;
            
            // Add header again for new page if this is not the first item
            if (index > 0) {
              currentMainContent.push(sectionHeader);
              currentMainHeight += headerHeight;
            }
          }

          currentMainContent.push(...itemWithHeader);
          currentMainHeight += itemHeight;
        }

        // Add section spacing
        currentMainHeight += 32; // mb-8 equivalent
      } else {
        // Handle non-splittable sections
        const sectionHeight = await measureElement(section.content, false);

        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          addPage([...currentMainContent], [...currentSidebarContent]);
          currentMainContent = [];
          currentSidebarContent = [];
          currentMainHeight = 0;
          currentSidebarHeight = 0;
        }

        currentMainContent.push(section.content);
        currentMainHeight += sectionHeight;
      }
    }

    // Process sidebar content (distribute across pages)
    let sidebarPageIndex = 0;
    for (const section of sidebarSections) {
      const sectionHeight = await measureElement(section.content, true);

      // If we need to start a new page for sidebar content
      if (currentSidebarHeight + sectionHeight > CONTENT_MAX_HEIGHT) {
        sidebarPageIndex++;
        // If we have more sidebar pages than main pages, create additional pages
        while (newPages.length <= sidebarPageIndex) {
          addPage([], []);
        }
        currentSidebarHeight = 0;
      }

      // Add sidebar content to the corresponding page
      if (newPages[sidebarPageIndex]) {
        const existingSidebar = Array.isArray(newPages[sidebarPageIndex].sidebar!.props.children) 
          ? newPages[sidebarPageIndex].sidebar!.props.children 
          : [];
        newPages[sidebarPageIndex] = {
          ...newPages[sidebarPageIndex],
          sidebar: (
            <div className="md:w-1/3">
              {[...existingSidebar, section.content]}
            </div>
          )
        };
      } else {
        addPage([], [section.content]);
      }

      currentSidebarHeight += sectionHeight;
    }

    // Add the last page if it has content
    if (currentMainContent.length > 0 || currentSidebarContent.length > 0) {
      addPage(currentMainContent, currentSidebarContent);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="brussels-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        {/* Hidden measurement container */}
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="brussels-container brussels-template">
      {/* Hidden measurement container */}
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      
      {pages.map((page, index) => (
        <Page 
          key={page.key}
          pageNumber={index + 1} 
          totalPages={pages.length}
          margins={margin}
          showFooter={showFooter}
        >
          <div className="brussels-content bg-white font-sans flex flex-col md:flex-row gap-8 h-full">
            {page.main}
            {page.sidebar}
          </div>
        </Page>
      ))}
    </div>
  );
}