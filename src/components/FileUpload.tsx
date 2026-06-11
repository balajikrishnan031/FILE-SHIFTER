"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, File as FileIcon, CheckCircle2, AlertTriangle, Download, ArrowRight, RefreshCw, Settings, Sparkles, Layers, FileUp, Type, X
} from "lucide-react";

// Expanded Format categories mapping matching user request
const CONVERSION_MAP: Record<string, string[]> = {
  // Documents
  pdf: ["docx", "txt", "html", "epub", "ppt", "xlsx"],
  docx: ["pdf", "txt", "html"],
  txt: ["pdf", "docx", "html"],
  html: ["pdf", "docx", "txt"],
  ppt: ["pdf"],
  xlsx: ["pdf"],
  
  // Images
  jpg: ["png", "webp", "pdf", "gif", "bmp"],
  jpeg: ["png", "webp", "pdf", "gif", "bmp"],
  png: ["jpg", "webp", "pdf", "gif", "bmp"],
  webp: ["jpg", "png", "pdf", "gif"],
  svg: ["png", "jpg", "pdf"],
  gif: ["png", "jpg", "webp"],
  bmp: ["jpg", "png", "webp"],
  
  // Audio
  mp3: ["wav", "ogg", "flac", "aac", "m4a"],
  wav: ["mp3", "ogg", "flac", "aac"],
  aac: ["mp3", "wav", "flac"],
  ogg: ["mp3", "wav", "flac"],
  flac: ["mp3", "wav", "ogg"],
  m4a: ["mp3", "wav", "flac"],
  
  // Video
  mp4: ["avi", "mov", "mkv", "webm", "gif", "mp3"],
  avi: ["mp4", "mov", "webm"],
  mov: ["mp4", "avi", "webm"],
  mkv: ["mp4", "avi", "webm"],
  webm: ["mp4", "avi", "mov"],
  
  // Archives
  zip: ["tar", "7z", "rar"],
  tar: ["zip", "7z"],
  "7z": ["zip", "tar"],
  rar: ["zip", "tar"],

  // E-books
  epub: ["pdf", "mobi"],
  mobi: ["epub"]
};

const ALL_FROM_FORMATS = Object.keys(CONVERSION_MAP).sort();

const STEP_MESSAGES = [
  "Uploading file to secure cloud cache...",
  "Analyzing file structure & properties...",
  "Transcoding format layouts...",
  "Running high-fidelity optimizations...",
  "Finalizing download pipeline..."
];

interface FileUploadProps {
  initialFrom?: string;
  initialTo?: string;
  initialTool?: string;
  onClose?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  initialFrom,
  initialTo,
  initialTool,
  onClose
}) => {
  const { user, incrementConversions } = useAuth();
  
  // Mode selection
  const [activeMode, setActiveMode] = useState<"file-first" | "format-first">("format-first");
  
  // Format-first states
  const [selectedFrom, setSelectedFrom] = useState<string>("pdf");
  const [selectedTo, setSelectedTo] = useState<string>("docx");

  // Core file state
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileExt, setFileExt] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [convertedFileName, setConvertedFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Options & Tool states
  const [tool, setTool] = useState<string>("");
  const [quality, setQuality] = useState(85);
  const [watermarkText, setWatermarkText] = useState("");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync props to state on mount and changes
  useEffect(() => {
    if (initialFrom && initialTo) {
      setActiveMode("format-first");
      setSelectedFrom(initialFrom.toLowerCase());
      setSelectedTo(initialTo.toLowerCase());
      setTargetFormat(initialTo.toLowerCase());
      setTool("");
    } else if (initialTool) {
      setActiveMode("format-first");
      setTool(initialTool);
      if (initialTool === "watermark") {
        setSelectedFrom("pdf");
        setSelectedTo("pdf");
        setTargetFormat("pdf");
      } else if (initialTool === "resize") {
        setSelectedFrom("png");
        setSelectedTo("png");
        setTargetFormat("png");
        setWidth("800");
        setHeight("600");
      } else if (initialTool === "compress") {
        setSelectedFrom("pdf");
        setSelectedTo("pdf");
        setTargetFormat("pdf");
      } else if (initialTool === "bgremove") {
        setSelectedFrom("png");
        setSelectedTo("png");
        setTargetFormat("png");
      } else if (initialTool === "photocompress") {
        setSelectedFrom("jpg");
        setSelectedTo("jpg");
        setTargetFormat("jpg");
        setQuality(60);
      } else if (initialTool === "videocompress") {
        setSelectedFrom("mp4");
        setSelectedTo("mp4");
        setTargetFormat("mp4");
        setQuality(70);
      } else if (initialTool === "audiocompress") {
        setSelectedFrom("mp3");
        setSelectedTo("mp3");
        setTargetFormat("mp3");
        setQuality(80);
      } else if (initialTool === "pdfcompress") {
        setSelectedFrom("pdf");
        setSelectedTo("pdf");
        setTargetFormat("pdf");
        setQuality(60);
      }
    }
  }, [initialFrom, initialTo, initialTool]);

  // Update target format when selection changes in format-first mode
  useEffect(() => {
    if (activeMode === "format-first" && !tool) {
      setTargetFormat(selectedTo);
      if (file && fileExt !== selectedFrom) {
        setFile(null);
        setFileExt("");
      }
    }
  }, [selectedFrom, selectedTo, activeMode, tool]);

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedFrom(val);
    const targets = CONVERSION_MAP[val] || [];
    if (targets.length > 0) {
      setSelectedTo(targets[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    
    if (!user) {
      setErrorMsg("Please login with your Google account to convert files.");
      setStatus("error");
      return;
    }

    const isImage = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"].includes(ext);
    const isAudio = ["mp3", "wav", "aac", "ogg", "flac", "m4a"].includes(ext);
    const isVideo = ["mp4", "avi", "mov", "mkv", "webm"].includes(ext);

    if (activeMode === "format-first" && !tool && ext !== selectedFrom) {
      setErrorMsg(`File extension (.${ext}) does not match your chosen converter (.${selectedFrom}).`);
      setStatus("error");
      return;
    }

    if (tool) {
      if (tool === "photocompress" && !isImage) {
        setErrorMsg("Photo Compressor only supports image files (JPG, PNG, WEBP, etc.).");
        setStatus("error");
        return;
      }
      if (tool === "videocompress" && !isVideo) {
        setErrorMsg("Video Compressor only supports video files (MP4, AVI, MOV, etc.).");
        setStatus("error");
        return;
      }
      if (tool === "audiocompress" && !isAudio) {
        setErrorMsg("Audio Compressor only supports audio files (MP3, WAV, AAC, etc.).");
        setStatus("error");
        return;
      }
      if (tool === "pdfcompress" && ext !== "pdf") {
        setErrorMsg("PDF Compressor only supports PDF files.");
        setStatus("error");
        return;
      }
    }

    setFile(selectedFile);
    setFileExt(ext);
    setStatus("idle");
    setErrorMsg("");

    if (tool) {
      // Sync tool format settings to matching file extension
      setSelectedFrom(ext);
      setSelectedTo(ext);
      setTargetFormat(ext);
    }
    
    if (activeMode === "file-first" && !tool) {
      const targets = CONVERSION_MAP[ext] || [];
      if (targets.length > 0) {
        setTargetFormat(targets[0]);
      } else {
        setTargetFormat("");
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const startConversion = async () => {
    if (!file || !targetFormat || !user) return;

    setStatus("processing");
    setProgress(0);
    setErrorMsg("");

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 9 + 3;
      if (currentProgress >= 95) {
        currentProgress = 95;
      }
      setProgress(Math.round(currentProgress));
      
      const msgIndex = Math.floor((currentProgress / 100) * STEP_MESSAGES.length);
      setStepMessage(STEP_MESSAGES[msgIndex] || STEP_MESSAGES[STEP_MESSAGES.length - 1]);
    }, 120);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("toFormat", targetFormat);
      formData.append("userId", user.id);
      formData.append("quality", quality.toString());
      if (tool) formData.append("tool", tool);
      if (watermarkText) formData.append("watermarkText", watermarkText);
      if (width) formData.append("width", width);
      if (height) formData.append("height", height);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      clearInterval(interval);

      if (data.success) {
        setProgress(100);
        setStatus("success");
        setDownloadUrl(data.downloadUrl);
        setConvertedFileName(data.fileName);
        
        incrementConversions(file.size);
      } else {
        setErrorMsg(data.error || "File conversion failed.");
        setStatus("error");
      }
    } catch (err) {
      clearInterval(interval);
      setErrorMsg("An unexpected server error occurred during conversion.");
      setStatus("error");
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileExt("");
    if (activeMode === "file-first") {
      setTargetFormat("");
    }
    setStatus("idle");
    setProgress(0);
    setDownloadUrl("");
    setConvertedFileName("");
    setErrorMsg("");
  };

  const availableTargets = CONVERSION_MAP[fileExt] || [];
  const formatFirstTargets = CONVERSION_MAP[selectedFrom] || [];

  return (
    <div id="upload-zone" className="w-full max-w-2xl mx-auto flex flex-col gap-5 scroll-mt-24">
      {/* Mode Toggle Tabs */}
      {status === "idle" && !file && !tool && (
        <div className="flex justify-center">
          <div className="flex rounded-full border border-zinc-200 bg-white/70 p-1 shadow-sm">
            <button
              onClick={() => { setActiveMode("format-first"); resetForm(); }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeMode === "format-first" ? "bg-primary text-white shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Choose Method First
            </button>
            <button
              onClick={() => { setActiveMode("file-first"); resetForm(); }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeMode === "file-first" ? "bg-primary text-white shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <FileUp className="h-3.5 w-3.5" /> Upload File First
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Dropzone Selection */}
        {status === "idle" && !file && (
          <motion.div
            key="selection-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-5"
          >
            {/* Format Dropdowns (Format First Mode & No special tool loaded) */}
            {activeMode === "format-first" && !tool && (
              <div className="glass-panel rounded-3xl p-5 border-zinc-200/80 flex flex-col sm:flex-row items-center gap-4 shadow-sm bg-white/80">
                <div className="flex-1 w-full flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Convert From</span>
                  <select
                    value={selectedFrom}
                    onChange={handleFromChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {ALL_FROM_FORMATS.map((format) => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="shrink-0 text-zinc-400 font-bold text-sm hidden sm:block pt-4">&rarr;</div>

                <div className="flex-1 w-full flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Convert To</span>
                  <select
                    value={selectedTo}
                    onChange={(e) => setSelectedTo(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {formatFirstTargets.map((format) => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Special tool label header (If tool parameter loaded) */}
            {tool && (
              <div className="glass-panel rounded-3xl p-4 border-zinc-200 bg-gradient-to-r from-primary/10 to-secondary/5 flex items-center justify-between shadow-sm">
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Selected Tool: {tool.toUpperCase()} UTILITY
                </span>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="h-6 w-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors shadow-sm"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Drop Zone Box */}
            <div
              className={`relative rounded-3xl border-2 border-dashed p-10 text-center transition-all glass-panel glass-shine ${
                dragActive 
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                  : "border-zinc-200 bg-white/70 hover:border-primary/30 hover:bg-white"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
              />
              
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/15 to-secondary/10 p-1 border border-zinc-200 shadow-sm">
                  <Upload className="h-7 w-7 text-primary animate-bounce" />
                </div>
                
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-800">
                    {tool 
                      ? `Upload file for ${tool.toUpperCase()} processing`
                      : activeMode === "format-first" 
                      ? `Upload .${selectedFrom.toUpperCase()} file to convert`
                      : "Drag & Drop file to shift"}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 font-semibold">
                    or click to browse from device (100% Free & Unlimited)
                  </p>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-transparent px-5 py-2.5 text-sm font-bold text-white transition-all shadow-md active:scale-95"
                >
                  Browse Files
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Selected File Config Panel */}
        {status === "idle" && file && (
          <motion.div
            key="config"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel glass-shine rounded-3xl border-zinc-200/80 bg-white/80 p-6 md:p-8 flex flex-col gap-6 shadow-xl"
          >
            {/* File Info */}
            <div className="flex items-center justify-between rounded-2xl bg-zinc-50 border border-zinc-200/50 p-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <FileIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="max-w-[280px] md:max-w-md truncate">
                  <p className="text-sm font-bold text-zinc-800 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">{formatSize(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={resetForm}
                className="text-xs text-zinc-400 hover:text-rose-500 font-bold transition-colors"
              >
                Change File
              </button>
            </div>

            {/* Target Select Option (Only shown in File-First Mode & No special tool loaded) */}
            {activeMode === "file-first" && !tool && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> Shift Output Target
                </span>
                
                {availableTargets.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {availableTargets.map((format) => (
                      <button
                        key={format}
                        onClick={() => setTargetFormat(format)}
                        className={`rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                          targetFormat === format
                            ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-lg shadow-primary/20 scale-[1.02]"
                            : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800"
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/5 p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-800">Unsupported file format</h4>
                      <p className="text-xs text-rose-500/80 mt-1">
                        We currently do not support conversions for <strong>.{fileExt}</strong> files.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Utility Forms */}
            
            {/* 1. Watermarker Settings */}
            {tool === "watermark" && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-3 shadow-inner">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1"><Type className="h-3.5 w-3.5" /> Watermark Overlay Config</span>
                <input
                  type="text"
                  placeholder="Enter watermark text (e.g. CONFIDENTIAL)..."
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none"
                />
              </div>
            )}

            {/* 2. Image Resizer Settings */}
            {tool === "resize" && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-4 shadow-inner">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Image Dimensions (Pixels)</span>
                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-400 font-bold">Width</span>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="Width (px)"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-400 font-bold">Height</span>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Height (px)"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Image Compression Quality slider */}
            {((["jpg", "jpeg", "png", "webp"].includes(targetFormat) && !tool) || 
              ["compress", "photocompress", "videocompress", "audiocompress", "pdfcompress"].includes(tool)) && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-2 shadow-inner">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Settings className="h-3.5 w-3.5" /> 
                    {tool === "videocompress" || tool === "audiocompress" || tool === "pdfcompress"
                      ? "Target Compression Strength"
                      : "Quality Compression Parameters"}
                  </span>
                  <span className="font-mono text-zinc-800">
                    {tool === "videocompress" || tool === "audiocompress" || tool === "pdfcompress"
                      ? `${120 - quality}% Strength`
                      : `${quality}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full accent-primary bg-zinc-200 h-1 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Action convert button */}
            <button
              onClick={startConversion}
              disabled={(!targetFormat && !tool) || !user}
              className="w-full rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-secondary py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/20 hover:scale-[1.01] hover:shadow-primary/35 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Convert File Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* Processing State */}
        {status === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel glass-shine rounded-3xl border-zinc-200/80 bg-white/80 p-8 text-center flex flex-col items-center justify-center gap-6 shadow-xl"
          >
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-100 border-t-primary animate-spin" />
              <div className="h-10 w-10 text-primary animate-pulse flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-zinc-800">
                Shifting layouts...
              </h3>
              <p className="text-sm text-zinc-500 font-semibold">
                {stepMessage}
              </p>
            </div>

            <div className="w-full max-w-md">
              <div className="h-3 w-full rounded-full bg-zinc-200/50 overflow-hidden shadow-inner liquid-progress border border-white/30">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 font-mono mt-2 block">{progress}% Complete</span>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel glass-shine rounded-3xl border-zinc-200/80 bg-white/80 p-8 text-center flex flex-col items-center justify-center gap-6 shadow-xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-emerald-600">
                Conversion Complete!
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto truncate font-medium">
                {convertedFileName}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <a
                href={downloadUrl}
                download={convertedFileName}
                className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-[1.01] transition-all"
              >
                <Download className="h-4 w-4" /> Download File
              </a>
              <button
                onClick={resetForm}
                className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-bold py-3.5 text-sm transition-all"
              >
                Shift Another
              </button>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-3xl border-rose-200 bg-rose-50/50 p-8 text-center flex flex-col items-center justify-center gap-6 shadow-xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-lg">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-rose-600">
                Conversion Failed
              </h3>
              <p className="text-sm text-rose-700/80 max-w-sm mx-auto font-medium">
                {errorMsg}
              </p>
            </div>

            <button
              onClick={resetForm}
              className="w-full max-w-md rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-transparent py-3.5 text-sm font-bold text-white transition-all active:scale-[0.99]"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
