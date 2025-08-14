"use client";

import { useState, useCallback } from "react";
import type { CVAnalysis } from "@/lib/ai-config";

export interface StreamingCVAnalysisResult {
  id?: string;
  overall?: string;
  feedback?: Array<{
    title: string;
    content: string;
    category: string;
    severity: "low" | "medium" | "high";
    tip?: string;
    kenyanContext?: string;
  }>;
  marketReadiness?: {
    score: number;
    strengths: string[];
    priorities: string[];
  };
  kenyanJobMarketTips?: string[];
  processingTime: number;
  metadata?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    pageCount?: number;
    wordCount: number;
  };
  isComplete?: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface UserContext {
  targetRole?: string;
  experience?: "entry" | "mid" | "senior";
  industry?: string;
}

export function useStreamingCV() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<StreamingCVAnalysisResult>({
    isComplete: false,
    processingTime: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const analyzeCV = useCallback(
    async (
      file: File,
      options: {
        roastTone: "light" | "heavy";
        focusAreas: string[];
        showEmojis: boolean;
        userContext?: UserContext;
      }
    ) => {
      setIsAnalyzing(true);
      setError(null);
      setResult({ isComplete: false, processingTime: 0 });
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("roastTone", options.roastTone);
        formData.append("focusAreas", JSON.stringify(options.focusAreas));
        formData.append("showEmojis", options.showEmojis.toString());

        // Add user context if provided
        if (options.userContext?.targetRole) {
          formData.append("targetRole", options.userContext.targetRole);
        }
        if (options.userContext?.experience) {
          formData.append("experience", options.userContext.experience);
        }
        if (options.userContext?.industry) {
          formData.append("industry", options.userContext.industry);
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.floor(Math.random() * 10);
          });
        }, 200);

        const startTime = performance.now();

        const response = await fetch("/api/analyze-cv-stream", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!response.ok) {
          throw new Error("Failed to analyze CV");
        }

        // Get metadata from headers
        const metadataHeader = response.headers.get("X-CV-Metadata");
        const metadata = metadataHeader
          ? JSON.parse(metadataHeader)
          : undefined;

        // Read full streamed body into one string
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        if (!reader) {
          throw new Error("No response body");
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
        }

        // Final decode flush
        buffer += decoder.decode();

        // Parse once at the end
        const parsed: CVAnalysis = JSON.parse(buffer);

        const endTime = performance.now(); // end timing
        const totalMs = Math.round(endTime - startTime);

        setResult({
          ...parsed,
          metadata,
          processingTime: totalMs,
          isComplete: true,
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult({ isComplete: false, processingTime: 0 });
    setError(null);
    setIsAnalyzing(false);
    setUploadProgress(0);
  }, []);

  return {
    analyzeCV,
    isAnalyzing,
    result,
    error,
    uploadProgress,
    reset,
  };
}
