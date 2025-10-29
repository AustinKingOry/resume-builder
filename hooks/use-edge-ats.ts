/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatATSAnalysisResult } from "@/lib/helpers";
import { ATSAnalysisResult } from "@/lib/types";
import { useState, useCallback, useRef, useEffect } from "react";

export function useEdgeATSAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

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

            if (sdata.status === "completed") {
              clearInterval(pollRef.current!);
              const formatted = formatATSAnalysisResult(sdata.result, metadata);
              setResult(formatted);
              setIsAnalyzing(false);
              setHasAnalyzed(true);
            } else if (sdata.status === "failed" || sdata.status === "timeout") {
              clearInterval(pollRef.current!);
              setError(sdata.error || "Job failed");
              setIsAnalyzing(false);
              setHasAnalyzed(false);
            } else {
              // queued/processing → you could update a spinner message here
            }
          } catch (e: any) {
            clearInterval(pollRef.current!);
            setError(e.message || "Polling failed");
            setIsAnalyzing(false);
            setHasAnalyzed(false);
          }
        }, 1500);
      } catch (e: any) {
        setError(e.message || "Enqueue failed");
        setIsAnalyzing(false);
        setHasAnalyzed(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    setResult(null)
    setError(null);
    setIsAnalyzing(false);
    setHasAnalyzed(false);
  }, []);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  return { analyzeCV, isAnalyzing, result, error, reset, hasAnalyzed };
}