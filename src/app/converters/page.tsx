"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { 
  FileText, Image as ImageIcon, Music, Video, Archive, QrCode, BookOpen, Search, ArrowRight, Sparkles
} from "lucide-react";
import Link from "next/link";

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

export default function ConvertersCatalogPage() {
  const { user, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const handleToolClick = async (t: typeof CATALOG_TOOLS[0]) => {
    const targetUrl = t.tool
      ? `/converter/run?tool=${t.tool}`
      : `/converter/run?from=${t.from}&to=${t.to}`;

    if (user) {
      router.push(targetUrl);
    } else {
      try {
        await loginWithGoogle();
        router.push(targetUrl);
      } catch (e) {
        console.error("Login failed", e);
      }
    }
  };

  const categoriesList = [
    { id: "all", name: "All Tools" },
    { id: "document", name: "Documents" },
    { id: "image", name: "Images" },
    { id: "audio", name: "Audio" },
    { id: "video", name: "Video" },
    { id: "archive", name: "Archives" },
    { id: "ebook", name: "E-books" },
    { id: "utility", name: "Utilities" },
    { id: "compressor", name: "Compressors / Size Reducers" },
  ];

  const filteredTools = CATALOG_TOOLS.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-light-bg text-slate-800 flex flex-col overflow-x-hidden animate-3d-bg">
      {/* Background Animated Blobs */}
      <div className="blur-blob blob-purple" />
      <div className="blur-blob blob-cyan" />
      <div className="blur-blob blob-rose" />

      {/* Decorative Floating Colorful Particles */}
      <div className="absolute top-[20%] left-[5%] h-72 w-72 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 opacity-15 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "25s" }} />
      <div className="absolute top-[60%] right-[5%] h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-400 to-sky-600 opacity-15 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "35s" }} />
      <div className="absolute bottom-[10%] left-[25%] h-80 w-80 rounded-full bg-gradient-to-tr from-sky-400 to-teal-600 opacity-10 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "30s" }} />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-16 flex flex-col gap-8 w-full">
        {/* Centered Hero Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3.5 mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent animate-text-gradient bg-size-300">
            Converters Directory
          </h1>
          <p className="text-base text-zinc-500 font-semibold leading-relaxed">
            Explore our full catalog of 40+ high-fidelity shifting tools. Select docx, pdf, mp4, mp3, zip, archives or custom resizer engines to execute conversions instantly.
          </p>
        </div>

        {/* Search Box & Filters */}
        <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search tools directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-4 text-sm text-zinc-700 placeholder-zinc-400 focus:border-primary focus:outline-none shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4.5 py-2 text-xs font-bold transition-all shadow-sm ${
                  activeCategory === cat.id
                    ? "bg-primary text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid list of tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {filteredTools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <button
                key={idx}
                onClick={() => handleToolClick(t)}
                className="rainbow-border-card rounded-3xl p-6 border border-zinc-200/50 flex flex-col justify-between text-left shadow-sm gap-5 active:scale-[0.98] group cursor-pointer w-full"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className={`h-8 w-8 rounded-lg ${t.bg} flex items-center justify-center border border-white`}>
                      <Icon className={`h-4.5 w-4.5 ${t.color}`} />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider rounded-md bg-zinc-100 px-2 py-0.5 border border-zinc-200/50">
                      {t.category}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800 group-hover:text-primary transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                    {t.desc}
                  </p>
                </div>
                
                <span className="text-xs font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Converter <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
