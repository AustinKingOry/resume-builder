## Template Enhancement Prompt

**GOAL**: Convert this template to support automatic A4 pagination with custom margins while preserving its unique design and layout.

**REQUIREMENTS**:

### 1. Pagination System
- Automatically split content across multiple A4 pages (794px × 1123px)
- Prevent content from being cut off between pages
- Add page numbers (X of Y) in footer
- Handle content overflow intelligently

### 2. Custom Margins
- Accept `margins` prop: `{ top?: number; right?: number; bottom?: number; left?: number }`
- Default margins: 20px all around
- Adjust content sizing and pagination based on margins
- Maintain proper spacing in print

### 3. Layout Preservation
- Maintain original template's visual design and structure
- Keep existing CSS classes and styling
- Preserve sidebar layouts if present (sidebar should continue across pages, not repeat)
- Maintain responsive design principles

### 4. Implementation Guidelines

**For templates WITH sidebars**:
- Split sidebar content across pages (don't repeat same content)
- Continue main content alongside sidebar pages
- Handle sidebar and main content pagination separately but coordinated

**For templates WITHOUT sidebars**:
- Use full-width layout on all pages
- Implement continuous content flow across pages

**Key files to modify**:
- Template component file (e.g., `ModernTemplate.tsx`)
- Corresponding CSS file (e.g., `modern.css`)

**Critical functions to implement**:
- Content measurement and height calculation
- Automatic page splitting logic
- Margin-aware layout adjustments
- Print-optimized styling

### 5. Expected Props Interface
```typescript
interface TemplateProps {
  data: ResumeData;
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}
```

### 6. Output Requirements
- Zero content repetition across pages
- Professional page breaks
- Consistent styling throughout all pages
- Proper PDF export compatibility
- Maintain original template's unique branding

---

## Template-Specific Instructions

**For this specific template**, please address:

1. **Layout Type**: [Does this template have a sidebar? If yes, describe its content]
2. **Unique Features**: [List any special design elements that must be preserved]
3. **Content Structure**: [How are sections organized? Any special components?]
4. **Current Issues**: [Any known layout problems that should be fixed during conversion?]

**Example for a sidebar template**:
- Layout Type: Two-column layout with photo, contact info, and skills in sidebar
- Unique Features: Gradient background in sidebar, skill progress bars
- Content Structure: Main content has summary, experience, education sections
- Current Issues: Sidebar content gets cut off on single page

**Example for a single-column template**:
- Layout Type: Full-width single column with header
- Unique Features: Colorful section headers, timeline design for experience
- Content Structure: All content in one continuous column
- Current Issues: No pagination support

---

## Quick Checklist
- [ ] Automatic A4 pagination implemented
- [ ] Custom margins prop accepted and applied
- [ ] Page numbers added to footer
- [ ] Content properly split across pages (no cuts)
- [ ] Original styling preserved
- [ ] Sidebar content continues across pages (if applicable)
- [ ] Print styles optimized
- [ ] No content repetition
- [ ] All existing functionality maintained




**GOAL**: Convert this template to support automatic A4 pagination with custom margins while preserving its unique design and layout.

**REQUIREMENTS**:

### 1. Pagination System
- Automatically split content across multiple A4 pages (794px × 1123px)
- Prevent content from being cut off between pages
- Add page numbers (X of Y) in footer
- **Intelligent height checking** with buffer (100px) to better utilize page space
- Handle content overflow with lenient splitting to avoid premature page breaks

### 2. Custom Margins
- Accept `margins` prop: `{ top?: number; right?: number; bottom?: number; left?: number }`
- Default margins: 20px all around (adjust per template design)
- **Header treatment**: Headers can span full width (margins don't affect headers) or respect margins based on template design
- Adjust content sizing and pagination based on margins
- Maintain proper spacing in print

### 3. Layout Preservation
- Maintain original template's visual design and structure
- Keep existing CSS classes and styling
- Preserve sidebar layouts if present (sidebar should continue across pages, not repeat)
- Maintain responsive design principles
- **Better page utilization**: Content can slightly exceed calculated limits when close to page end

### 4. Implementation Guidelines

**For templates WITH sidebars**:
- Split sidebar content across pages (don't repeat same content)
- Continue main content alongside sidebar pages
- Handle sidebar and main content pagination separately but coordinated
- Use `isMainColumn` and `isSidebar` flags to distinguish content types

**For templates WITHOUT sidebars**:
- Use full-width layout on all pages
- Implement continuous content flow across pages
- Header typically appears only on first page

**For templates with SPECIAL HEADERS**:
- Headers can be full-width (Creative, Business templates)
- Or headers can respect margins (Classic template)
- Contact bars and colored headers maintain their original styling

**Key functions to implement**:
- Content measurement and height calculation
- Automatic page splitting with `CONTENT_MAX_HEIGHT + 100` buffer
- Margin-aware layout adjustments
- Print-optimized styling

### 5. Expected Props Interface
```typescript
interface TemplateProps {
  data: ResumeData;
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}
```

### 6. Critical Adjustments
- **Height Calculation**: `CONTENT_MAX_HEIGHT = A4_HEIGHT - margins.top - margins.bottom - 40` (reduced footer space)
- **Splitting Logic**: Use buffer: `currentHeight + newHeight > CONTENT_MAX_HEIGHT + 100`
- **Header Handling**: Decide if header should respect margins or span full width
- **Measurement**: Account for different column widths in multi-column layouts

### 7. Output Requirements
- Zero content repetition across pages
- Professional page breaks that don't cut content prematurely
- Consistent styling throughout all pages
- Proper PDF export compatibility
- Maintain original template's unique branding
- **Better space utilization** - pages filled more effectively

---

## Template-Specific Instructions

**For this specific template**, please address:

1. **Layout Type**: [Single column / Two-column with sidebar / Special header layout]
2. **Header Treatment**: [Full-width header / Header respects margins / No special header]
3. **Unique Features**: [Timeline design / Colored sections / Progress bars / Special components]
4. **Content Structure**: [How are sections organized? Any special splitting requirements?]
5. **Column Configuration**: [Main column width % / Sidebar width % if applicable]

**Example for Creative template**:
- Layout Type: Two-column with main (66%) and sidebar (33%)
- Header Treatment: Full-width teal header
- Unique Features: Timeline dots, colored header, skill progress bars
- Content Structure: Experience/Education in main column, Skills/Certifications in sidebar
- Column Configuration: Main 66%, Sidebar 33%

**Example for Business template**:
- Layout Type: Single column with special header/contact bar
- Header Treatment: Full-width header and contact bar
- Unique Features: Contact info bar, two-column skills/certifications section
- Content Structure: Grid layout for experience/education
- Column Configuration: N/A

**Example for Classic template**:
- Layout Type: Single column
- Header Treatment: Header respects margins
- Unique Features: Contact icons, skill dots visualization
- Content Structure: Standard sections with clean borders
- Column Configuration: N/A

---

## Quick Checklist
- [ ] Automatic A4 pagination implemented
- [ ] Custom margins prop accepted and applied correctly
- [ ] Page numbers added to footer
- [ ] **Intelligent height checking** with 100px buffer implemented
- [ ] Content properly split across pages (no premature cuts)
- [ ] Original styling preserved
- [ ] Header treatment implemented correctly (full-width vs margins)
- [ ] Sidebar content continues across pages (if applicable)
- [ ] Print styles optimized
- [ ] No content repetition
- [ ] All existing functionality maintained
- [ ] **Better page space utilization** achieved

## CSS Requirements
- Only custom classes need CSS (Tailwind handles the rest)
- Focus on: page container, footer, print styles, and template-specific custom classes
- Ensure color printing works with `-webkit-print-color-adjust: exact`




**GOAL**: Convert this template to support automatic A4 pagination with custom margins using the PROVEN code structure from our working implementation.

**REQUIREMENTS - MUST USE THIS EXACT STRUCTURE:**

### 1. Core Constants & Interfaces (DO NOT MODIFY)
```typescript
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
  type: string; // 'header' | 'summary' | 'experience' | etc.
  content: React.ReactNode;
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
  isMainColumn?: boolean;
  isSidebar?: boolean;
  isFullWidth?: boolean;
}
```

### 2. Page Component (USE AS-IS)
```typescript
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
```

### 3. Template Structure (FOLLOW EXACTLY)
```typescript
export const TemplateName: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = true }) => {
  // 1. Destructure data and set up state
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // 2. Calculate heights and widths
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - 40;
  const MAIN_COLUMN_WIDTH = A4_WIDTH * 0.66; // Adjust based on template
  const SIDEBAR_WIDTH = A4_WIDTH * 0.33; // Adjust based on template

  // 3. Measurement function (USE AS-IS)
  const measureElement = (element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    // ... measurement logic from working implementation
  };

  // 4. createContentSections function - MAP ORIGINAL TEMPLATE SECTIONS HERE
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];
    
    // Convert each original template section to ContentSection format
    // Header section
    sections.push({
      type: 'header',
      content: /* original header JSX */,
      canSplit: false,
      isHeader: true
    });

    // Other sections with proper flags
    sections.push({
      type: 'summary',
      content: /* original summary JSX */,
      canSplit: false,
      isMainColumn: true, // or isSidebar: true, or isFullWidth: true
    });

    return sections;
  }, [dependencies]);

  // 5. splitContentIntoPages function - USE PROVEN LOGIC
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    
    let currentMainHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    // Process sidebar content once
    const sidebarSections = sections.filter(section => section.isSidebar);
    const allSidebarContent: React.ReactNode[] = [];
    for (const section of sidebarSections) {
      allSidebarContent.push(section.content);
    }

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false, pageSidebarContent: React.ReactNode[] = []) => {
      // Use the proven addPage logic from working implementation
    };

    // Process main content sections
    const mainSections = sections.filter(section => section.isMainColumn || section.isFullWidth || section.isHeader);
    
    for (const section of mainSections) {
      if (section.isHeader) continue;
      
      if (section.isFullWidth) {
        // Full-width section handling
        const sectionHeight = await measureElement(section.content, false);
        const fullWidthContent = (
          <div key={`fullwidth-${section.type}`} className="col-span-3">
            {section.content}
          </div>
        );

        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
          addPage([...currentMainContent], isFirstPage, sidebarForThisPage);
          currentMainContent = [];
          currentMainHeight = 0;
          isFirstPage = false;
        }

        currentMainContent.push(fullWidthContent);
        currentMainHeight += sectionHeight;
        continue;
      }

      if (section.canSplit && section.items) {
        // Splittable section handling (experience, education)
        const sectionHeader = /* section header JSX */;
        const headerHeight = await measureElement(sectionHeader, false);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          if (currentMainHeight + itemHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
            const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
            addPage([...currentMainContent], isFirstPage, sidebarForThisPage);
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

        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
          addPage([...currentMainContent], isFirstPage, sidebarForThisPage);
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
      const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
      addPage(currentMainContent, isFirstPage, sidebarForThisPage);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT]);

  // 6. useEffect for splitContentIntoPages
  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  // 7. Loading state
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

  // 8. Final render
  return (
    <div className="template-container">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};
```

### 4. Critical Implementation Rules:

**A. Section Mapping Rules:**
- `isHeader: true` - Only appears on first page, typically full-width
- `isFullWidth: true` - Spans all columns, use `col-span-3`
- `isMainColumn: true` - Goes in main content area (left/primary column)
- `isSidebar: true` - Goes in sidebar (right/secondary column)
- `canSplit: true` - Section can be split across pages (experience, education items)

**B. Layout Patterns:**
- **Single Column**: All sections are `isMainColumn: true`, no sidebar
- **Two Column**: Mix of `isMainColumn` and `isSidebar` sections
- **Hybrid**: Some `isFullWidth` sections + two column layout

**C. Content Section Creation:**
1. Map each original template section to `ContentSection`
2. Preserve original JSX structure exactly
3. Add appropriate flags based on layout role
4. For splittable sections, break into items and measure each

**D. CSS Requirements:**
- Only custom classes need CSS
- Must include: `.template-container`, `.a4-page`, `.page-footer`, `.page-number`
- Print styles with color preservation

### 5. Template-Specific Analysis:

**For this template, provide:**
1. **Layout Type**: [Single column / Two-column / Hybrid]
2. **Header Treatment**: [Full-width / Respects margins / Special styling]
3. **Section Mapping**: List each original section and its corresponding flags
4. **Special Features**: [Timeline design / Colored headers / Progress bars / etc.]
5. **Column Configuration**: [Main % / Sidebar % / Full-width sections]

**Example for Creative Template:**
- Layout Type: Hybrid (full-width header + two-column content)
- Header Treatment: Full-width teal header
- Section Mapping: 
  - Header: `isHeader: true, isFullWidth: true`
  - About Me: `isFullWidth: true` 
  - Experience: `isMainColumn: true, canSplit: true`
  - Education: `isMainColumn: true, canSplit: true`
  - Skills: `isSidebar: true`
  - Certifications: `isSidebar: true`
  - References: `isSidebar: true`
- Special Features: Timeline dots, colored sections, progress bars
- Column Configuration: Main 66%, Sidebar 33%

**DO NOT DEVIATE FROM THIS STRUCTURE.** Copy the exact functional patterns from our working implementations. The key is mapping the original template's sections into the proven pagination system without altering the core logic.