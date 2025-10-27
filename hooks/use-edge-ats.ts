/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface AnalysisResult {
    id?: string;
    overallScore: number
    keywordStrength: number
    skillsMatch: number
    atsReady: number
    keywords: {
      matchedKeywords: Array<{ keyword: string; frequency: number; importance: string }>
      missingKeywords: Array<{ keyword: string; importance: string; reason: string }>
      matchPercentage: number
      analysis: string
    }
    skills: {
      matchedSkills: Array<{ skill: string; category: string; proficiency: string; importance: string }>
      missingSkills: Array<{ skill: string; category: string; priority: string; importance: string }>
      matchPercentage: number
      skillGaps: string[]
      analysis: string
    }
    atsCompatibility: {
      atsScore: number
      formatting: { score: number; issues: string[]; suggestions: string[] }
      structure: { score: number; sections: string[]; missingSections: string[] }
      readability: { score: number; issues: string[] }
      analysis: string
    }
    sectionAnalysis: {
      section: string
      strength: number
      feedback: string
    }[]
    recommendations: {
      improvements: Array<{ category: string; title: string; description: string; priority: string; action: string }>
      atsWarnings: Array<{ warning: string; severity: string; suggestion: string }>
      bestPractices: Array<{ practice: string; benefit: string; implementation: string }>
    }
    processingTime?: number
    metadata?: {
      fileName: string
      fileSize: number
      fileType: string
      pageCount?: number
      wordCount: number
    }
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
}

export interface UserContext {
  targetRole?: string;
  experience?: "entry" | "mid" | "senior";
  industry?: string;
}

/**
 * Converts raw CV analysis data from the API to the CVAnalysisResult format.
 * @param raw The original API response object
 * @param meta Optional metadata about the file (can come from your upload handling logic)
 * @returns CVAnalysisResult
 */
function formatCVAnalysisResult(
  raw: any,
  meta?: { fileName: string; fileSize: number; fileType: string; pageCount?: number; wordCount: number }
): AnalysisResult {
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
  };
}

export function useEdgeATSAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const analyzeCV = useCallback(
    async (
      file: File,
      options: {
        jobDescription: string,
      }
    ) => {
      setIsAnalyzing(true);
      setError(null);
      setResult(null);

      try {
        // build form data
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", options.jobDescription);

        // enqueue
        const r = await fetch("/api/ats/enqueue", { method: "POST", body: formData });

        const payload = await r.json();
        if (!r.ok) throw new Error(payload.error || "Failed to enqueue");
        const { jobId, metadata } = payload;

        // poll status
        pollRef.current = setInterval(async () => {
          try {
            const sres = await fetch(`/api/ats/status?atsJobId=${jobId}`);
            const sdata = await sres.json();

            if (sdata.status === "succeeded") {
              clearInterval(pollRef.current!);
              const formatted = formatCVAnalysisResult(sdata.result, metadata);
              setResult(formatted);
              setIsAnalyzing(false);
            } else if (sdata.status === "failed" || sdata.status === "timeout") {
              clearInterval(pollRef.current!);
              setError(sdata.error || "Job failed");
              setIsAnalyzing(false);
            } else {
              // queued/processing → you could update a spinner message here
            }
          } catch (e: any) {
            clearInterval(pollRef.current!);
            setError(e.message || "Polling failed");
            setIsAnalyzing(false);
          }
        }, 1500);
      } catch (e: any) {
        setError(e.message || "Enqueue failed");
        setIsAnalyzing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    setResult(null)
    setError(null);
    setIsAnalyzing(false);
  }, []);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  return { analyzeCV, isAnalyzing, result, error, reset };
}