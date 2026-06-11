"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { 
  User as UserIcon, Shield, CreditCard, Sparkles, Check, Database, RefreshCcw, Activity
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading, resetUsage } = useAuth();
  const router = useRouter();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-bg text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-slate-400">Loading Shifter Profile...</p>
        </div>
      </div>
    );
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const maxVisualStorage = 100 * 1024 * 1024; // 100MB
  const percentStorage = Math.min((user.storageUsedBytes / maxVisualStorage) * 100, 100);

  return (
    <div className="min-h-screen bg-light-bg text-slate-200 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-5xl">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-2xl font-extrabold text-slate-200 flex items-center gap-2.5">
              <UserIcon className="h-6 w-6 text-primary" /> My Profile
            </h1>
            <p className="text-sm text-slate-400 mt-1 font-semibold">
              Manage your personal details, storage usage, and system statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="glass-panel rounded-3xl p-6 border-white/10 bg-slate-950/60 flex flex-col gap-5 items-center text-center">
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full bg-slate-900 border-2 border-white/10 shadow-md" />
                <span className="absolute bottom-0 right-0 flex h-6 items-center rounded-full bg-gradient-to-r from-primary to-secondary px-2.5 text-[9px] font-bold text-slate-950 shadow-md border-2 border-slate-955 uppercase tracking-wider">
                  FREE
                </span>
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-200">{user.name}</h2>
                <p className="text-xs text-slate-400 font-semibold">{user.email}</p>
                <div className="inline-flex items-center gap-1 mt-2.5 rounded-full bg-slate-900 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Role: {user.role}
                </div>
              </div>

              <div className="w-full border-t border-white/10 pt-4 flex justify-between text-xs text-slate-400 font-bold">
                <span>Account Created</span>
                <span className="text-slate-200">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Storage Usage Card */}
            <div className="glass-panel rounded-3xl p-6 border-white/10 bg-slate-950/60 flex flex-col justify-between gap-5 md:col-span-2 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-secondary" /> Temp Storage & Logs
                </h3>
                <button
                  onClick={resetUsage}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RefreshCcw className="h-3 w-3" /> Reset Usage
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Current Space Consumed</span>
                  <span className="font-bold text-slate-200">
                    {formatSize(user.storageUsedBytes)} (Temporary Cache)
                  </span>
                </div>

                <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentStorage, 2)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                  Your conversions are completely free and unlimited. Uploaded files are cleaned up from our secure sandbox cache automatically after 24 hours.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Conversions Count</span>
                  <span className="text-2xl font-extrabold text-slate-200 flex items-center gap-1.5">
                    <Activity className="h-5 w-5 text-primary" /> {user.dailyConversionsCount}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plan Tier</span>
                  <span className="text-2xl font-extrabold text-secondary flex items-center gap-1.5">
                    <CreditCard className="h-5 w-5 text-secondary" /> Unlimited Free
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Access Guarantee Card */}
          <div className="glass-panel rounded-3xl p-6 border-white/10 bg-slate-950/60 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" /> Shifter Free Guarantee
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Every conversion engine on Shifter is accessible with zero locks. Standard, priority, and batch conversion processes are all hosted on free cloud tiers. No payment credentials or credit cards are required to access any of Shifter's premium capabilities.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
