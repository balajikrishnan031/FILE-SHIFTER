"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { FileUpload } from "@/components/FileUpload";
import { 
  FileText, Image as ImageIcon, Music, Video, Archive, QrCode, ArrowLeft, Check, Sparkles
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ type: string }>;
}

export default function ConverterTypePage({ params }: PageProps) {
  const { type } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  // QR Code generator states
  const [qrText, setQrText] = useState("");
  const [qrResult, setQrResult] = useState("");
  const [qrGenerating, setQrGenerating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-bg text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-slate-400">Loading Converter Hub...</p>
        </div>
      </div>
    );
  }

  // Details for each category
  const categories: Record<string, {
    title: string;
    desc: string;
    icon: any;
    color: string;
    bg: string;
    features: string[];
  }> = {
    document: {
      title: "Document Converter",
      desc: "Convert office papers and text formats safely. Maintain layout properties and formatting parameters.",
      icon: FileText,
      color: "text-purple-400",
      bg: "bg-purple-500/15",
      features: ["PDF to Word (DOCX)", "DOCX to PDF", "TXT to PDF", "PDF to TXT", "HTML to PDF conversion", "PPT & XLSX conversions support"]
    },
    image: {
      title: "Image Converter",
      desc: "Transcode images between multiple formats with compression controls, resizing options and high quality.",
      icon: ImageIcon,
      color: "text-cyan-400",
      bg: "bg-cyan-500/15",
      features: ["PNG to JPG", "JPG to PNG", "WEBP to PNG/JPG", "SVG to PNG", "GIF conversions", "Quality optimization slider"]
    },
    audio: {
      title: "Audio Converter",
      desc: "Extract and convert audio tracks with variable bitrates and codec transcode support.",
      icon: Music,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
      features: ["MP4 to MP3 extraction", "WAV to MP3 transcoding", "OGG/FLAC/AAC conversions", "Variable bitrate options"]
    },
    video: {
      title: "Video Converter",
      desc: "Convert MP4, AVI, MOV, WEBM videos in the cloud. Extract audio tracks or convert videos to animated GIFs.",
      icon: Video,
      color: "text-rose-400",
      bg: "bg-rose-500/15",
      features: ["MP4 to AVI/MOV/webm", "Video to GIF converter", "Cloud optimized encoding", "Audio track stripper"]
    },
    archive: {
      title: "Archives Converter",
      desc: "Pack or unpack zip archives. Merge multiple document directories into single compression formats.",
      icon: Archive,
      color: "text-amber-400",
      bg: "bg-amber-500/15",
      features: ["Zip creation from files", "Tar archive packing", "Zip extraction utilities", "Tar to Zip format shifting"]
    },
    utility: {
      title: "QR & Utility Tools",
      desc: "Generate QR codes from plain text links or scan images to read encoded QR metadata instantly.",
      icon: QrCode,
      color: "text-indigo-400",
      bg: "bg-indigo-500/15",
      features: ["QR Code Generator", "QR Code Image Scanner", "Metadata extraction", "Responsive utility tools"]
    }
  };

  const catDetails = categories[type] || categories.document;
  const CatIcon = catDetails.icon;

  // Handle QR Generator logic
  const handleGenerateQR = async () => {
    if (!qrText) return;
    setQrGenerating(true);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        body: (() => {
          const fd = new FormData();
          const blob = new Blob([qrText], { type: "text/plain" });
          fd.append("file", blob, "qr_input.txt");
          fd.append("toFormat", "qr");
          fd.append("userId", user.id);
          return fd;
        })(),
      });
      const data = await res.json();
      if (data.success) {
        setQrResult(data.downloadUrl);
      }
    } catch (e) {
      console.error(e);
    }
    setQrGenerating(false);
  };

  return (
    <div className="min-h-screen bg-light-bg text-slate-200 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-5xl">
          {/* Header Link */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-xl ${catDetails.bg} flex items-center justify-center border border-white/10 shadow-sm`}>
                <CatIcon className={`h-6 w-6 ${catDetails.color}`} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-200 flex items-center gap-2">
                  {catDetails.title}
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed font-semibold">
                  {catDetails.desc}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors font-bold cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Upload/Interact panel */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {type === "utility" ? (
                /* Utility Layout showing QR tools directly */
                <div className="flex flex-col gap-6">
                  {/* QR Generator Card */}
                  <div className="glass-panel rounded-3xl p-6 border-white/10 bg-slate-950/60 flex flex-col gap-4 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-indigo-400" /> QR Code Generator
                    </h3>
                    
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Enter text or URL to encode..."
                        value={qrText}
                        onChange={(e) => setQrText(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                      />
                      <button
                        onClick={handleGenerateQR}
                        disabled={!qrText || qrGenerating}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 text-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                      >
                        {qrGenerating ? "Generating..." : "Generate QR Code"}
                      </button>
                    </div>

                    {qrResult && (
                      <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-4">
                        <img src={qrResult} alt="Generated QR" className="h-40 w-40 rounded-xl bg-white p-2 border border-white/10 shadow-md" />
                        <a
                          href={qrResult}
                          download="qr_code.png"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-slate-950 font-bold px-4 py-2 text-xs transition-all cursor-pointer shadow-md shadow-primary/20"
                        >
                          Download QR PNG
                        </a>
                      </div>
                    )}
                  </div>

                  {/* QR Scanner Drag Area */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      QR Image Scanner (Upload QR Code)
                    </h3>
                    <FileUpload />
                  </div>
                </div>
              ) : (
                /* Standard File Upload Area */
                <FileUpload />
              )}
            </div>

            {/* Right Guide Info panel */}
            <div className="flex flex-col gap-6">
              <div className="glass-panel rounded-3xl p-6 border-white/10 bg-slate-950/60 flex flex-col gap-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Engine Features
                </h3>
                
                <ul className="flex flex-col gap-3">
                  {catDetails.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400 font-semibold leading-normal">
                      <Check className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${catDetails.color}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel rounded-3xl p-6 border-white/10 bg-slate-950/60 shadow-sm">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Usage Instructions
                </h3>
                <ol className="list-decimal pl-4 text-xs text-slate-400 font-bold leading-relaxed flex flex-col gap-2">
                  <li>Choose the source and target formats first, or drop files directly.</li>
                  <li>Our system will automatically detect the header layout details.</li>
                  <li>Convert standard, priority and batch files with no limits.</li>
                  <li>Click <strong>Convert File Now</strong> to trigger cloud transcoding.</li>
                  <li>Once done, download your file directly. Files expire in 24 hours.</li>
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
