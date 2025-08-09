import mammoth from "mammoth"
import pdf from 'pdf-parse';
import JSZip from "jszip";

export interface ParsedCV {
  text: string
  metadata: {
    fileName: string
    fileSize: number
    fileType: string
    pageCount?: number
    wordCount: number
  }
}

export async function parseCV(file: File): Promise<ParsedCV> {
  const fileType = file.type
  let text = ""
  let pageCount: number | undefined

  try {
    if (fileType === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      // const result = await parsePDF(file)
      const result = await pdf(buffer);
      text = result.text
      pageCount = result.numpages
    } else if (
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = (await extractDocxFromFile(file)).text;
    } else {
      throw new Error("Unsupported file type")
    }

    // Clean up the text
    text = cleanText(text)

    // Validate that we extracted meaningful content
    if (text.length < 50) {
      throw new Error("Could not extract enough text from the document. Please ensure your CV contains readable text.")
    }

    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length

    return {
      text,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType,
        pageCount,
        wordCount,
      },
    }
  } catch (error) {
    console.error("Error parsing CV:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to parse your CV. Please make sure it's a valid PDF or Word document with readable text.",
    )
  }
}

// async function parsePDF(file: File): Promise<{ text: string; pageCount: number }> {
//   const arrayBuffer = await file.arrayBuffer()
//   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
//   const pageCount = pdf.numPages

//   let fullText = ""

//   for (let i = 1; i <= pageCount; i++) {
//     const page = await pdf.getPage(i)
//     const textContent = await page.getTextContent()
//     const pageText = textContent.items
//       .map((item: any) => item.str)
//       .join(" ")
//       .trim()
//     fullText += pageText + "\n"
//   }

//   return { text: fullText, pageCount }
// }

async function parseWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

function cleanText(text: string): string {
  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove special characters that might interfere with analysis
      .replace(/[^\w\s\-@.,()]/g, " ")
      // Trim and normalize
      .trim()
  )
}

export function validateCVContent(text: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = []
  const lowercaseText = text.toLowerCase()

  // Check for basic CV sections
  const hasSummary = /summary|profile|about|objective/i.test(text)
  const hasExperience = /experience|work|employment|job/i.test(text)
  const hasEducation = /education|school|university|degree|diploma/i.test(text)
  const hasContact = /@|phone|email|contact/i.test(text)

  if (!hasSummary) {
    issues.push("Missing professional summary or objective section")
  }
  if (!hasExperience) {
    issues.push("Missing work experience section")
  }
  if (!hasEducation) {
    issues.push("Missing education section")
  }
  if (!hasContact) {
    issues.push("Missing contact information")
  }

  // Check for common issues
  if (text.length < 200) {
    issues.push("CV content seems too short")
  }
  if (text.length > 5000) {
    issues.push("CV content might be too long")
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}

/**
 * Output shape required by the user.
 */
export type DocxExtractionResult = {
  text: string;
  metadata: {
    fileName: string | null;
    fileSize: number | null;
    fileType: string | null;
    pageCount: number | null;
    wordCount: number;
  };
};

/** Options */
export type ExtractOptions = {
  /** words per page used to estimate page count when docProps doesn't contain exact pages */
  wordsPerPage?: number;
  /** timeout for mammoth conversion (ms) */
  timeoutMs?: number;
};

/** Default option values */
const DEFAULT_WORDS_PER_PAGE = 300;
const DEFAULT_TIMEOUT_MS = 20_000;

/** Small timeout wrapper for promises */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

/** Lightweight HTML -> plain text conversion */
function htmlToPlainText(html: string): string {
  // Remove tags and collapse whitespace
  return html.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Try to read <Pages> from docProps/app.xml inside the .docx zip.
 * Returns number or null if not present or unreadable.
 */
async function readPageCountFromDocProps(buffer: Buffer): Promise<number | null> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const app = zip.file("docProps/app.xml");
    if (!app) return null;
    const xml = await app.async("text");
    const m = xml.match(/<Pages>(\d+)<\/Pages>/i);
    if (!m) return null;
    const pages = Number.parseInt(m[1], 10);
    return Number.isFinite(pages) ? pages : null;
  } catch {
    // On any error while reading zip, return null (fallback to estimate)
    return null;
  }
}

/**
 * Main function: accepts a File (web File), extracts text and metadata.
 *
 * - Works on server (Next.js route handlers) where `File` is available from formData,
 *   and also works in browser contexts where you pass a File from an <input>.
 * - Uses mammoth to produce HTML -> converts to plain text and counts words.
 * - Attempts to read exact page count from docProps/app.xml; falls back to an estimate.
 *
 * Throws a descriptive Error on failure.
 */
export async function extractDocxFromFile(
  file: File,
  options: ExtractOptions = {}
): Promise<DocxExtractionResult> {
  const wordsPerPage = options.wordsPerPage ?? DEFAULT_WORDS_PER_PAGE;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  if (!file) {
    throw new Error("No file provided to extractDocxFromFile()");
  }

  const fileName = file.name ?? null;
  const fileType = file.type ?? null;
  const fileSize = typeof (file as any).size === "number" ? (file as any).size : null;

  // Quick validation for .docx by extension (MIME might be empty in some envs)
  if (fileName && !fileName.toLowerCase().endsWith(".docx")) {
    throw new Error("File does not have a .docx extension");
  }

  // Read ArrayBuffer from File
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err: any) {
    throw new Error(`Failed to read file data: ${err?.message ?? String(err)}`);
  }

  const buffer = Buffer.from(arrayBuffer); // Node Buffer for mammoth & jszip

  if (buffer.length === 0) {
    throw new Error("Uploaded file is empty");
  }

  try {
    // Convert DOCX -> HTML using mammoth with timeout protection
    const convertPromise = mammoth.convertToHtml({ buffer });
    const conversion = await withTimeout(convertPromise, timeoutMs);
    const html = conversion?.value ?? "";

    // Convert HTML to plain text and compute word count
    const text = htmlToPlainText(html);
    const wordCount = text.length === 0 ? 0 : text.split(/\s+/).filter(Boolean).length;

    // Try to read exact page count from docProps; fallback to estimate
    let pageCount: number | null = await readPageCountFromDocProps(buffer);
    if (pageCount === null && wordsPerPage > 0) {
      pageCount = Math.max(1, Math.ceil(wordCount / wordsPerPage));
    }

    return {
      text,
      metadata: {
        fileName,
        fileSize,
        fileType,
        pageCount,
        wordCount,
      },
    };
  } catch (err: any) {
    const message =
      err && err.message
        ? `Failed to extract .docx: ${err.message}`
        : "Failed to extract .docx: unknown error";
    // Keep stack out of thrown error message to avoid leaking internals; log if needed on server.
    throw new Error(message);
  }
}
