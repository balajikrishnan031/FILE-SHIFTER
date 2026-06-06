"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { 
  FileText, Image, Music, Video, Archive, QrCode, History, User, ShieldAlert,
  LayoutDashboard, Database, ChevronRight
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Converters Directory", path: "/converters", icon: Database, category: "Converters" },
    { name: "Documents", path: "/converter/document", icon: FileText, category: "Converters" },
    { name: "Images", path: "/converter/image", icon: Image, category: "Converters" },
    { name: "Audio", path: "/converter/audio", icon: Music, category: "Converters" },
    { name: "Video", path: "/converter/video", icon: Video, category: "Converters" },
    { name: "Archives", path: "/converter/archive", icon: Archive, category: "Converters" },
    { name: "QR & Utilities", path: "/converter/utility", icon: QrCode, category: "Converters" },
    { name: "History", path: "/history", icon: History, category: "Management" },
    { name: "Profile & Plan", path: "/profile", icon: User, category: "Management" },
  ];

  // Group items by category
  const categories = menuItems.reduce((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  // Arbitrary baseline just for visualization (since unlimited)
  const maxVisualStorage = 100 * 1024 * 1024; // 100MB
  const percentStorage = Math.min(
    (user.storageUsedBytes / maxVisualStorage) * 100,
    100
  );

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white/60 backdrop-blur-xl p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] shadow-sm">
      <div className="flex flex-col gap-6">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 mb-1">
              {category}
            </span>
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-primary/10 to-secondary/5 text-primary border-l-2 border-primary"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 transition-colors ${active ? "text-primary" : "text-zinc-400 group-hover:text-zinc-700"}`} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className={`h-3 w-3 opacity-0 transition-all ${active ? "opacity-100 text-primary" : "group-hover:opacity-50 group-hover:translate-x-0.5"}`} />
                </Link>
              );
            })}
          </div>
        ))}

        {user.role === "admin" && (
          <div className="flex flex-col gap-1 border-t border-zinc-200 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 px-3 mb-1">
              Administration
            </span>
            <Link
              href="/admin"
              className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive("/admin")
                  ? "bg-cyan-50 text-cyan-700 border-l-2 border-cyan-500"
                  : "text-zinc-600 hover:bg-cyan-50 hover:text-cyan-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 text-cyan-600" />
                <span>Admin Analytics</span>
              </div>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Link>
          </div>
        )}
      </div>

      {/* Storage progress indicator */}
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 flex flex-col gap-3 shadow-inner">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
            <Database className="h-3.5 w-3.5" />
            <span>Temp Storage Used</span>
          </div>
          <span className="font-bold text-zinc-700">
            {formatSize(user.storageUsedBytes)}
          </span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${Math.max(percentStorage, 2)}%` }}
          />
        </div>

        <p className="text-[10px] text-zinc-400 leading-normal">
          Conversions are 100% Free and Unlimited. Files are automatically auto-deleted after 24h.
        </p>
      </div>
    </aside>
  );
};
