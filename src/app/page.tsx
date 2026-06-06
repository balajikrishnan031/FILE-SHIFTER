"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { 
  FileText, Image as ImageIcon, Music, Video, Archive, Shield, Zap, Sparkles,
  ArrowRight, Check, Activity, Users, Flame, RefreshCw, Star, Layers
} from "lucide-react";

export default function Home() {
  const { user, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleCTA = () => {
    router.push("/converters");
  };

  const categories = [
    { name: "Documents", desc: "PDF, DOCX, TXT, HTML, PPT, XLSX", icon: FileText, color: "text-purple-600", bg: "bg-purple-500/10", border: "hover:border-purple-500/30" },
    { name: "Images", desc: "PNG, JPG, WEBP, SVG, GIF, BMP", icon: ImageIcon, color: "text-cyan-600", bg: "bg-cyan-500/10", border: "hover:border-cyan-500/30" },
    { name: "Audio", desc: "MP3, WAV, AAC, OGG, FLAC, M4A", icon: Music, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/30" },
    { name: "Video", desc: "MP4, AVI, MOV, MKV, WEBM, GIF", icon: Video, color: "text-rose-600", bg: "bg-rose-500/10", border: "hover:border-rose-500/30" },
    { name: "Archives", desc: "ZIP, TAR, 7Z, RAR, GZIP", icon: Archive, color: "text-amber-600", bg: "bg-amber-500/10", border: "hover:border-amber-500/30" },
  ];

  return (
    <div className="relative min-h-screen bg-light-bg text-slate-800 flex flex-col justify-between overflow-x-hidden">
      {/* Background Animated Blobs */}
      <div className="blur-blob blob-purple" />
      <div className="blur-blob blob-cyan" />
      <div className="blur-blob blob-rose" />

      {/* Decorative Floating Colorful Particles */}
      <div className="absolute top-[20%] left-[5%] h-72 w-72 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 opacity-20 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "25s" }} />
      <div className="absolute top-[60%] right-[5%] h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-400 to-sky-600 opacity-20 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "35s" }} />
      <div className="absolute bottom-[10%] left-[25%] h-80 w-80 rounded-full bg-gradient-to-tr from-sky-400 to-teal-600 opacity-15 blur-3xl pointer-events-none animate-float-slower" style={{ animationDuration: "30s" }} />

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8 lg:pt-32">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/80 px-4.5 py-1.5 text-xs text-zinc-600 font-bold backdrop-blur-md shadow-md animate-float">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>Shift Any File &bull; 100% Free & Unlimited</span>
            </div>
          </div>
          
          <h1 className="mx-auto max-w-4xl bg-gradient-to-r from-primary via-purple-600 via-rose-500 to-secondary bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl leading-none animate-text-gradient bg-size-300">
            Universal File Shifting Platform
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 sm:text-xl font-semibold leading-relaxed">
            Convert documents, images, audio, video, archives, and e-books instantly. Secure, lightning fast, and completely unlimited. No registration limits, no payment walls.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={handleCTA}
              disabled={loading}
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-primary/25 hover:shadow-primary/45 hover:scale-[1.03] transition-all duration-300 disabled:opacity-50 btn-pulse-glow"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Start Shifting Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              { label: "Files Converted", value: "2.4M+", icon: Activity, color: "text-purple-600", bg: "bg-purple-500/10" },
              { label: "Active Shifters", value: "140K+", icon: Users, color: "text-cyan-600", bg: "bg-cyan-500/10" },
              { label: "Vibrant Formats", value: "70+", icon: Layers, color: "text-emerald-600", bg: "bg-emerald-500/10" },
              { label: "Transcode Speed", value: "< 3s", icon: Flame, color: "text-rose-600", bg: "bg-rose-500/10" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-panel rounded-3xl p-5 text-center flex flex-col items-center gap-2 border border-white bg-white/60 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center border border-white/50`}>
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-800">{stat.value}</div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-zinc-200/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Power Packed Converters
            </h2>
            <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto font-semibold">
              Seamlessly shift any file format. Enjoy high-fidelity layouts retention with our conversion modules.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="rainbow-border-card rounded-3xl p-6 flex flex-col gap-4 border border-zinc-200/50"
                >
                  <div className={`h-11 w-11 rounded-xl ${cat.bg} flex items-center justify-center border border-white/50`}>
                    <Icon className={`h-5 w-5 ${cat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800">{cat.name}</h3>
                    <p className="mt-1.5 text-xs text-zinc-500 font-semibold leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ENGINE DETAILS SECTION */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-zinc-200/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Our Conversion Architecture
            </h2>
            <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto font-semibold">
              Shifter orchestrates professional, industry-standard conversion tools in the cloud to guarantee zero layout distortions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Sharp Image Engine",
                desc: "Powers all image transcoding, resizing, and compressions. Uses high-speed libvips binary wrappers to handle PNG, JPG, WEBP, and GIF outputs without server lags.",
                details: ["Dynamic quality sliders", "Pixel-perfect aspect ratios", "Format scaling logic"]
              },
              {
                title: "LibreOffice & Pandoc Document Engine",
                desc: "Processes office documents (Word, Excel, PowerPoint) and exports them to PDF. Ensures all fonts, margin styles, headings, tables, and spacing parameters map correctly.",
                details: ["DOCX to PDF page layouts mapping", "PPT page layout exports", "TXT/HTML to PDF encoders"]
              },
              {
                title: "FFmpeg Media Transcoder",
                desc: "Orchestrates complex video and audio stream transformations. Encodes audio codecs (WAV, MP3, AAC) and strips media streams with custom codec settings.",
                details: ["High-speed stream copy", "Audio track extraction (MP4 to MP3)", "Video to animated GIF transcoders"]
              },
              {
                title: "Utility QR & Archive Packers",
                desc: "Compresses files into ZIP/TAR formats and reads images to scan QR codes. Generates high-fidelity QR codes from plain text strings.",
                details: ["ADM-ZIP packing logs", "jsQR canvas image scanners", "Offline QR generators"]
              }
            ].map((engine, idx) => (
              <div key={idx} className="glass-panel glass-panel-hover rounded-3xl p-6 md:p-8 border border-white bg-white/70 flex flex-col justify-between gap-5 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <h3 className="text-lg font-extrabold text-slate-800">{engine.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed font-semibold">{engine.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-100">
                  {engine.details.map((detail, dIdx) => (
                    <span key={dIdx} className="rounded-xl bg-zinc-100 px-3 py-1 text-xs text-zinc-500 font-bold">
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY & FREE GUARANTEE SECTION */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-200/50">
          <div className="glass-panel rounded-3xl p-8 md:p-12 border-transparent bg-gradient-to-r from-sky-100/30 via-white/80 to-indigo-50/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="flex flex-col gap-3 max-w-xl">
              <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                100% Free & Unlimited Access <Zap className="h-5 w-5 text-amber-500 fill-current animate-bounce" />
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-semibold">
                No billing subscriptions. No daily conversion limits. Convert any file size up to 2 GB with maximum priority speed. Shifter is dedicated to offering unrestricted cloud conversion tools to students, developers, and creators.
              </p>
            </div>
            <button
              onClick={handleCTA}
              className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-primary/20 hover:scale-[1.02] hover:shadow-primary/45 transition-all duration-300 btn-pulse-glow"
            >
              Start Converting
            </button>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-200/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "Shifter replaced all my offline tools. I can convert a DOCX to PDF, compress a PNG, and scan a QR code all in one dashboard. Lightning fast!", author: "Sriram K.", role: "Web Developer", stars: 5 },
              { text: "The clean UI and the light mesh design are beautiful. Choosing the conversion method first is incredibly handy.", author: "Deepika R.", role: "UI Designer", stars: 5 },
              { text: "Batch conversions and the speed is incredible. Image resizing and format suggestions are super handy. Best of all, it's entirely free!", author: "Pranesh S.", role: "SaaS Founder", stars: 5 }
            ].map((rev, i) => (
              <div key={i} className="glass-panel rounded-3xl p-6 flex flex-col justify-between bg-white/70 border border-white shadow-sm gap-4 border-rainbow-hover">
                <p className="text-sm text-zinc-500 font-semibold italic">"{rev.text}"</p>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">{rev.author}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-bold">{rev.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: rev.stars }).map((_, j) => (
                      <Star key={j} className="h-3 w-3 text-amber-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white/70 py-8 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-400 font-bold">
            &copy; {new Date().getFullYear()} Shifter Inc. Shift Any File, Anytime, Anywhere. Built with Next.js 15.
          </p>
        </div>
      </footer>
    </div>
  );
}
