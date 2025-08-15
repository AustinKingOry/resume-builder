"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface CVAnalysisResult {
    id?: string
    overall?: string
    feedback?: Array<{
      title: string
      content: string
      category: string
      severity: "low" | "medium" | "high"
      tip?: string
      kenyanContext?: string
    }>
    marketReadiness?: {
      score: number
      strengths: string[]
      priorities: string[]
    }
    kenyanJobMarketTips?: string[]
    processingTime: number
    metadata?: {
      fileName: string
      fileSize: number
      fileType: string
      pageCount?: number
      wordCount: number
    }
    isComplete?: boolean
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

export function useEdgeStreamingAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CVAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      setResult(null);
      setUploadProgress(0);

      try {
        // build form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append("roastTone", options.roastTone);
        formData.append("focusAreas", JSON.stringify(options.focusAreas));
        formData.append("showEmojis", String(options.showEmojis));
        if (options.userContext?.targetRole) formData.append("targetRole", options.userContext.targetRole);
        if (options.userContext?.experience) formData.append("experience", options.userContext.experience);
        if (options.userContext?.industry) formData.append("industry", options.userContext.industry);

        // Fake upload progress (optional)
        const progressTimer = setInterval(() => {
          setUploadProgress((p) => (p >= 90 ? 90 : p + Math.ceil(Math.random() * 10)));
        }, 200);

        // enqueue
        const r = await fetch("/api/cv-roast/enqueue", { method: "POST", body: formData });
        clearInterval(progressTimer);
        setUploadProgress(100);

        const payload = await r.json();
        if (!r.ok) throw new Error(payload.error || "Failed to enqueue");
        const { jobId, cvId, metadata } = payload;

        // poll status
        const started = performance.now();
        pollRef.current = setInterval(async () => {
          try {
            const sres = await fetch(`/api/cv-roast/status?cv_id=${cvId}`);
            const sdata = await sres.json();

            if (sdata.status === "succeeded") {
              const elapsed = Math.round(performance.now() - started);
              clearInterval(pollRef.current!);
              setResult({
                ...sdata.result,
                metadata,
                isComplete: true,
                processingTime: elapsed,
              });
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
    setUploadProgress(0);
  }, []);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  return { analyzeCV, isAnalyzing, result, error, uploadProgress, reset };
}
