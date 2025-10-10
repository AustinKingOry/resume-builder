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