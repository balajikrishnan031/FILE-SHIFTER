"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { FileUpload } from "@/components/FileUpload";
import { 
  Sparkles, FileClock, History, CheckCircle2, ArrowUpRight, Search, FileText, Image as ImageIcon, Music, Video, Archive, QrCode, BookOpen, X
} from "lucide-react";
import Link from "next/link";

interface ConversionRecord {
  _id: string;
  originalName: string;
  originalSize: number;
  fromFormat: string;
  toFormat: string;
  status: string;
  convertedFileUrl: string;
  createdAt: string;
}

const CATALOG_TOOLS = [
  // Documents
  { name: "PDF to DOCX", desc: "Convert PDF files to editable Word formats.", from: "pdf", to: "docx", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "DOCX to PDF", desc: "Convert Word documents to clean PDF layouts.", from: "docx", to: "pdf", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "PDF to TXT", desc: "Extract raw text content from PDF pages.", from: "pdf", to: "txt", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "TXT to PDF", desc: "Create PDF pages from plain text formats.", from: "txt", to: "pdf", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "PPT to PDF", desc: "Transcode PowerPoint slides to PDF layouts.", from: "ppt", to: "pdf", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "PDF to PPT", desc: "Export PDF documents to PowerPoint presentations.", from: "pdf", to: "ppt", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "XLSX to PDF", desc: "Convert Excel spreadsheets to PDF sheets.", from: "xlsx", to: "pdf", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "PDF to XLSX", desc: "Export PDF sheets to Excel spreadsheet tables.", from: "pdf", to: "xlsx", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "HTML to PDF", desc: "Convert HTML files to printable PDF pages.", from: "html", to: "pdf", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },
  { name: "PDF to HTML", desc: "Convert PDF documents to HTML web layouts.", from: "pdf", to: "html", category: "document", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10" },

  // Images
  { name: "JPG to PNG", desc: "Convert JPG images to lossless PNG.", from: "jpg", to: "png", category: "image", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10" },
  { name: "PNG to JPG", desc: "Convert PNG images to lightweight JPG.", from: "png", to: "jpg", category: "image", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10" },
  { name: "WEBP to JPG", desc: "Convert WEBP images to standard JPG.", from: "webp", to: "jpg", category: "image", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10" },
  { name: "WEBP to PNG", desc: "Convert WEBP images to transparent PNG.", from: "webp", to: "png", category: "image", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10" },
  { name: "SVG to PNG", desc: "Export vector SVG drawings to raster PNG.", from: "svg", to: "png", category: "image", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10" },
  { name: "SVG to JPG", desc: "Export vector SVG drawings to lightweight JPG.", from: "svg", to: "jpg", category: "image", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10" },
  { name: "GIF to PNG", desc: "Convert animated GIF frames to PNG format.", from: "gif", to: "png", category: "image", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10" },
  { name: "BMP to JPG", desc: "Convert bitmap BMP files to standard JPG.", from: "bmp", to: "jpg", category: "image", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10" },

  // Audio
  { name: "MP3 to WAV", desc: "Convert MP3 audio tracks to lossless WAV.", from: "mp3", to: "wav", category: "audio", icon: Music, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { name: "WAV to MP3", desc: "Convert lossless WAV audio tracks to compressed MP3.", from: "wav", to: "mp3", category: "audio", icon: Music, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { name: "AAC to MP3", desc: "Transcode AAC audio tracks to standard MP3.", from: "aac", to: "mp3", category: "audio", icon: Music, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { name: "OGG to MP3", desc: "Transcode OGG audio tracks to standard MP3.", from: "ogg", to: "mp3", category: "audio", icon: Music, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { name: "FLAC to MP3", desc: "Convert high fidelity FLAC audio tracks to MP3.", from: "flac", to: "mp3", category: "audio", icon: Music, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { name: "M4A to MP3", desc: "Convert M4A audio tracks to standard MP3.", from: "m4a", to: "mp3", category: "audio", icon: Music, color: "text-emerald-600", bg: "bg-emerald-500/10" },

  // Video
  { name: "MP4 to AVI", desc: "Convert MP4 video clips to AVI format.", from: "mp4", to: "avi", category: "video", icon: Video, color: "text-rose-600", bg: "bg-rose-500/10" },
  { name: "AVI to MP4", desc: "Convert AVI video clips to MP4 format.", from: "avi", to: "mp4", category: "video", icon: Video, color: "text-rose-600", bg: "bg-rose-500/10" },
  { name: "MP4 to MOV", desc: "Convert MP4 video clips to Apple MOV format.", from: "mp4", to: "mov", category: "video", icon: Video, color: "text-rose-600", bg: "bg-rose-500/10" },
  { name: "MOV to MP4", desc: "Convert Apple MOV clips to standard MP4.", from: "mov", to: "mp4", category: "video", icon: Video, color: "text-rose-600", bg: "bg-rose-500/10" },
  { name: "MKV to MP4", desc: "Convert MKV containers to standard MP4.", from: "mkv", to: "mp4", category: "video", icon: Video, color: "text-rose-600", bg: "bg-rose-500/10" },
  { name: "WEBM to MP4", desc: "Convert webm video loops to standard MP4.", from: "webm", to: "mp4", category: "video", icon: Video, color: "text-rose-600", bg: "bg-rose-500/10" },
  { name: "MP4 to GIF", desc: "Transcode MP4 video clips to animated GIF loops.", from: "mp4", to: "gif", category: "video", icon: Video, color: "text-rose-600", bg: "bg-rose-500/10" },

  // Archives
  { name: "ZIP to RAR", desc: "Re-pack ZIP compression files to RAR format.", from: "zip", to: "rar", category: "archive", icon: Archive, color: "text-amber-600", bg: "bg-amber-500/10" },
  { name: "RAR to ZIP", desc: "Convert RAR compression files to ZIP formats.", from: "rar", to: "zip", category: "archive", icon: Archive, color: "text-amber-600", bg: "bg-amber-500/10" },
  { name: "7Z to ZIP", desc: "Re-pack 7z archives to standard ZIP formats.", from: "7z", to: "zip", category: "archive", icon: Archive, color: "text-amber-600", bg: "bg-amber-500/10" },
  { name: "TAR to ZIP", desc: "Pack tape tar archives to standard ZIP files.", from: "tar", to: "zip", category: "archive", icon: Archive, color: "text-amber-600", bg: "bg-amber-500/10" },

  // E-books
  { name: "PDF to EPUB", desc: "Export PDF layouts to EPUB e-book formatting.", from: "pdf", to: "epub", category: "ebook", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  { name: "EPUB to PDF", desc: "Convert EPUB e-books to printable PDF pages.", from: "epub", to: "pdf", category: "ebook", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  { name: "MOBI to EPUB", desc: "Convert MOBI e-books to standard EPUB files.", from: "mobi", to: "epub", category: "ebook", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  { name: "EPUB to MOBI", desc: "Convert EPUB e-books to MOBI reader files.", from: "epub", to: "mobi", category: "ebook", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-500/10" },

  // Utilities
  { name: "QR Generator", desc: "Generate customizable QR codes from text strings.", tool: "qr", category: "utility", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "QR Scanner", desc: "Read QR code values from uploaded image files.", tool: "qrscan", category: "utility", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "Image Resizer", desc: "Resize image pixel width and height.", tool: "resize", category: "utility", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "Photo Size Compressor", desc: "Compress photo file sizes with custom quality parameters.", tool: "photocompress", category: "compressor", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "Video Size Compressor", desc: "Compress video file sizes with low-bitrate encoding.", tool: "videocompress", category: "compressor", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "Audio Size Compressor", desc: "Compress audio file sizes down to lower bitrates.", tool: "audiocompress", category: "compressor", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "PDF Compressor", desc: "Reduce PDF document size using metadata compression.", tool: "pdfcompress", category: "compressor", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "Background Remover", desc: "Mock background extraction returning transparent PNG.", tool: "bgremove", category: "utility", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "Watermark Adder", desc: "Add custom watermark text overlay on PDFs or images.", tool: "watermark", category: "utility", icon: QrCode, color: "text-blue-600", bg: "bg-blue-500/10" },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recentConversions, setRecentConversions] = useState<ConversionRecord[]>([]);
  


  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch(`/api/history?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setRecentConversions(data.records.slice(0, 3));
          }
        })
        .catch(console.error);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-bg text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-zinc-500">Loading Shifter Dashboard...</p>
        </div>
      </div>
    );
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleToolClick = (toolInfo: typeof CATALOG_TOOLS[0]) => {
    if (toolInfo.tool) {
      router.push(`/converter/run?tool=${toolInfo.tool}`);
    } else {
      router.push(`/converter/run?from=${toolInfo.from}&to=${toolInfo.to}`);
    }
  };



  return (
    <div className="relative min-h-screen bg-light-bg text-slate-800 flex flex-col overflow-x-hidden">
      {/* Background Animated Blobs */}
      <div className="blur-blob blob-purple" />
      <div className="blur-blob blob-cyan" />
      <div className="blur-blob blob-rose" />

      {/* Decorative Floating Colorful Particles */}
      <div className="absolute top-[20%] left-[5%] h-72 w-72 rounded-full bg-gradient-to-tr from-blue-400 to-violet-600 opacity-15 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "25s" }} />
      <div className="absolute top-[60%] right-[5%] h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 opacity-15 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "35s" }} />
      <div className="absolute bottom-[10%] left-[25%] h-80 w-80 rounded-full bg-gradient-to-tr from-pink-400 to-violet-600 opacity-10 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "30s" }} />

      <Navbar />

      <div className="flex flex-1 relative z-10">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-5xl">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                Welcome, {user.name} <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </h1>
              <p className="text-sm text-zinc-500 mt-1 font-semibold">
                Shift files instantly. Click any tool card below to convert immediately.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-4 border-zinc-200 bg-white/70 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Access Plan</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-800">Unlimited Free</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 border-zinc-200 bg-white/70 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Shifts Completed</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-800">{user.dailyConversionsCount}</span>
                <span className="text-zinc-400 text-xs font-semibold">files converted</span>
              </div>
            </div>
          </div>

          {/* Big Beautiful CTA Banner */}
          <div className="rainbow-border-card rounded-3xl p-8 md:p-10 border border-zinc-200/50 bg-gradient-to-r from-indigo-50/50 via-white to-sky-50/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="flex flex-col gap-2 max-w-xl">
              <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                Converters Directory <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
              </h3>
              <p className="text-sm text-zinc-500 font-semibold leading-relaxed">
                Browse our complete catalog of 40+ high-fidelity shifting tools. Select docx, pdf, mp4, mp3, zip, archives or custom resizer engines to execute conversions instantly.
              </p>
            </div>
            <Link
              href="/converters"
              className="shrink-0 rounded-2xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-primary/20 hover:scale-[1.02] hover:shadow-primary/45 transition-all duration-300 btn-pulse-glow"
            >
              Browse All Tools
            </Link>
          </div>



          {/* Recent Conversions History */}
          {recentConversions.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-zinc-200 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileClock className="h-4 w-4 text-primary" /> Recent Shifts
                </h2>
                <Link href="/history" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                  <span>View All History</span> <History className="h-3 w-3" />
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {recentConversions.map((record) => (
                  <div
                    key={record._id}
                    className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-zinc-200 bg-white/70 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 truncate max-w-[240px] sm:max-w-md">
                          {record.originalName}
                        </h4>
                        <p className="text-[10px] text-zinc-400 font-bold mt-0.5">
                          {record.fromFormat.toUpperCase()} &rarr; {record.toFormat.toUpperCase()} &bull; {formatSize(record.originalSize)}
                        </p>
                      </div>
                    </div>

                    <a
                      href={record.convertedFileUrl}
                      download
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-transparent px-4 py-2 text-xs font-bold text-white transition-colors shadow-sm"
                    >
                      Download Output
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
