/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { ATSAnalysisResult } from './types';

/**
 * Upload a file to Supabase Storage and track progress
 * @param {File} file - The file to upload
 * @param {string} bucket - Supabase bucket name
 * @param {string} path - Full file path (e.g., userId/filename.jpg)
 * @param {(percent: number) => void} onProgress - Callback to track upload %
 */
export async function uploadFileWithProgress(
  file: File,
  bucket: string,
  path: string,
  onProgress: (percent: number) => void
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;

  try {
    const res = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
        Authorization: `Bearer ${supabaseKey}`,
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        onProgress(percent);
      },
    });

    return { success: true, data: res.data };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error };
  }
}

export const createUniqueKey = () => {
  return Math.random().toString(36).substring(7);
}



/**
 * Converts raw ATS analysis data from the API to the ATSAnalysisResult format.
 * @param raw The original API response object
 * @param meta Optional metadata about the file (can come from your upload handling logic)
 * @returns ATSAnalysisResult
 */
export function formatATSAnalysisResult(
  raw: any,
  meta?: { fileName: string; fileSize: number; fileType: string; pageCount?: number; wordCount: number }
): ATSAnalysisResult {
  return {
    id: raw.id,
    overallScore: raw.overall_score || 0,
    keywordStrength: raw.keyword_strength || 0,
    skillsMatch: raw.skills_match || 0,
    atsReady: raw.ats_ready || 0,
    keywords: {
        matchedKeywords: raw.keywords?.matchedKeywords || [],
        missingKeywords: raw.keywords?.missingKeywords || [],
        matchPercentage: raw.keywords?.matchPercentage || 0,
        analysis: raw.keywords?.analysis || "",
    },
    skills: {
        matchedSkills: raw.skills?.matchedSkills || [],
        missingSkills: raw.skills?.missingSkills || [],
        matchPercentage: raw.skills?.matchPercentage || 0,
        skillGaps: raw.skills?.skillGaps || [],
        analysis: raw.skills?.analysis || "",
    },
    atsCompatibility: {
        atsScore: raw.ats_compatibility?.atsScore || 0,
        formatting: {
            score: raw.ats_compatibility?.formatting?.score || 0,
            issues: raw.ats_compatibility?.formatting?.issues || [],
            suggestions: raw.ats_compatibility?.formatting?.suggestions || [],
        },
        structure: {
            score: raw.ats_compatibility?.structure?.score || 0,
            sections: raw.ats_compatibility?.structure?.sections || [],
            missingSections: raw.ats_compatibility?.structure?.missingSections || [],
        },
        readability: {
            score: raw.ats_compatibility?.readability?.score || 0,
            issues: raw.ats_compatibility?.readability?.issues || [],
        },
        analysis: raw.ats_compatibility?.analysis || "",
    },
    sectionAnalysis: raw.section_analysis || [],
    recommendations: raw.recommendations || {
        improvements: [],
        atsWarnings: [],
        bestPractices: [],
    },

    processingTime: raw.processing_time_seconds || 0,
    metadata: meta
      ? {
          fileName: meta.fileName,
          fileSize: meta.fileSize,
          fileType: meta.fileType,
          pageCount: meta.pageCount,
          wordCount: meta.wordCount,
        }
      : undefined,
    usage: raw.io_tokens
      ? {
          promptTokens: raw.io_tokens[0] || 0,
          completionTokens: raw.io_tokens[1] || 0,
          totalTokens: (raw.io_tokens[0] || 0) + (raw.io_tokens[1] || 0),
        }
      : undefined,
    summary: raw.summary,
  };
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 24) {
    if (diffInHours < 1) return "Just now"
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}