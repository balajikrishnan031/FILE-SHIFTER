"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { FileUpload } from "@/components/FileUpload";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

function ConverterRunContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fromVal, setFromVal] = useState<string | undefined>(undefined);
  const [toVal, setToVal] = useState<string | undefined>(undefined);
  const [toolVal, setToolVal] = useState<string | undefined>(undefined);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const toolParam = searchParams.get("tool");

    if (fromParam) setFromVal(fromParam.toLowerCase());
    if (toParam) setToVal(toParam.toLowerCase());
    if (toolParam) setToolVal(toolParam.toLowerCase());
    
    setInitialized(true);
  }, [searchParams]);

  if (loading || !user || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-bg text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-zinc-500">Preparing Converter Engine...</p>
        </div>
      </div>
    );
  }

  // Get dynamic titles/labels
  let displayTitle = "Universal Converter Workspace";
  let displayDesc = "Upload, configure and convert your files instantly with zero layout distortions.";

  if (toolVal) {
    if (toolVal === "photocompress") {
      displayTitle = "Photo Size Compressor";
      displayDesc = "Compress photo files with high quality compression layers.";
    } else if (toolVal === "videocompress") {
      displayTitle = "Video Size Compressor";
      displayDesc = "Shrink video file sizes to low-bitrates.";
    } else if (toolVal === "audiocompress") {
      displayTitle = "Audio Size Compressor";
      displayDesc = "Reduce audio files to lightweight bitrates.";
    } else if (toolVal === "pdfcompress") {
      displayTitle = "PDF Document Compressor";
      displayDesc = "Reduce PDF layouts to compressed file buffers.";
    } else {
      displayTitle = `${toolVal.toUpperCase()} Utility Tool`;
    }
  } else if (fromVal && toVal) {
    displayTitle = `${fromVal.toUpperCase()} to ${toVal.toUpperCase()} Converter`;
  }

  return (
    <div className="min-h-screen bg-light-bg text-slate-800 flex flex-col animate-3d-bg">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-5xl">
          {/* Header Link */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 pb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                {displayTitle} <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </h1>
              <p className="text-sm text-zinc-500 mt-1 max-w-xl leading-relaxed font-semibold">
                {displayDesc}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors font-bold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
          </div>

          <div className="max-w-2xl mx-auto w-full">
            <FileUpload
              initialFrom={fromVal}
              initialTo={toVal}
              initialTool={toolVal}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ConverterRunPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-light-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <ConverterRunContent />
    </Suspense>
  );
}
