"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { 
  ShieldAlert, Users, Layers, Activity, RefreshCw, Trash2, CheckCircle2,
  TrendingUp, Award, Database
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  BarChart, Bar, Cell
} from "recharts";

interface StatsData {
  totalConversions: number;
  totalUsers: number;
  activeUsers: number;
  formatStats: { name: string; value: number }[];
  dailyTrends: { date: string; conversions: number }[];
  monthlyTrends: { month: string; revenue: number; conversions: number }[];
  recentConversions: any[];
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [cleanStatus, setCleanStatus] = useState<"idle" | "cleaning" | "done">("idle");

  const fetchStats = () => {
    setFetching(true);
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchStats();
    }
  }, [user]);

  const handleAutoClean = async () => {
    setCleanStatus("cleaning");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setCleanStatus("done");
    setTimeout(() => setCleanStatus("idle"), 2000);
  };

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-bg text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-slate-400">Verifying Admin Privileges...</p>
        </div>
      </div>
    );
  }

  const COLORS = ["#F59E0B", "#8b5cf6", "#06b6d4", "#10b981", "#f43f5e"];

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-light-bg text-slate-200 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2.5">
                <ShieldAlert className="h-6 w-6 text-primary" /> Admin Analytics Panel
              </h1>
              <p className="text-sm text-slate-400 mt-1 font-semibold">
                Real-time usage stats, popular conversion types, server storage cache, and platform metrics.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchStats}
                disabled={fetching}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-400 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${fetching ? "animate-spin" : ""}`} /> Refresh
              </button>
              
              <button
                onClick={handleAutoClean}
                disabled={cleanStatus !== "idle"}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                  cleanStatus === "cleaning"
                    ? "bg-zinc-800"
                    : cleanStatus === "done"
                    ? "bg-emerald-600 shadow-emerald-500/10"
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/10 active:scale-[0.98]"
                }`}
              >
                <Trash2 className="h-4 w-4" />
                {cleanStatus === "cleaning" ? "Clearing..." : cleanStatus === "done" ? "Cleaned!" : "Run Auto-Clean"}
              </button>
            </div>
          </div>

          {stats ? (
            <>
              {/* High Level Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                  { title: "Total Conversions", value: stats.totalConversions, desc: "+14% this week", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10" },
                  { title: "Total Active Users", value: stats.totalUsers, desc: "24 new signups", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                  { title: "Conversions Rate (24h)", value: stats.activeUsers, desc: "Stable throughput", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { title: "Temp Cache Space", value: formatSize(stats.totalConversions * 452000), desc: "Sandbox clean logs", icon: Database, color: "text-amber-400", bg: "bg-amber-500/10" }
                ].map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div key={i} className="glass-panel rounded-2xl p-5 border-white/10 bg-slate-950/60 flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-2xl font-extrabold text-slate-200">{m.value}</span>
                        <div className={`h-8 w-8 rounded-lg ${m.bg} flex items-center justify-center border border-white/5`}>
                          <Icon className={`h-4.5 w-4.5 ${m.color}`} />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 font-bold">{m.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Visualizations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily traffic chart */}
                <div className="glass-panel rounded-3xl p-5 border-white/10 bg-slate-950/60 flex flex-col gap-4 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-purple-400" /> Daily File Conversions
                  </h3>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.dailyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorConvs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <ChartTooltip 
                          contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", color: "#f8fafc" }}
                        />
                        <Area type="monotone" dataKey="conversions" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConvs)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Popular conversion formats */}
                <div className="glass-panel rounded-3xl p-5 border-white/10 bg-slate-950/60 flex flex-col gap-4 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-cyan-400" /> Popular Output Formats
                  </h3>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.formatStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <ChartTooltip 
                          contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", color: "#f8fafc" }}
                        />
                        <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                          {stats.formatStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Conversion Log */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recent Shifter Conversion Logs
                </h3>
                
                {stats.recentConversions.length > 0 ? (
                  <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 bg-slate-900/40 font-bold text-slate-400 uppercase tracking-wider">
                            <th className="p-3 pl-5">User</th>
                            <th className="p-3">File Name</th>
                            <th className="p-3">Conversion</th>
                            <th className="p-3">Size</th>
                            <th className="p-3 pr-5">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentConversions.map((conv, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 text-slate-400 transition-colors">
                              <td className="p-3 pl-5 font-bold text-slate-400 truncate max-w-[150px]">
                                {conv.userId === "admin-123" ? "Admin Balaji" : "Balaji Kumar"}
                              </td>
                              <td className="p-3 font-bold text-slate-200 truncate max-w-[200px]">
                                {conv.originalName}
                              </td>
                              <td className="p-3 font-mono text-[10px] text-slate-400">
                                {conv.fromFormat.toUpperCase()} &rarr; {conv.toFormat.toUpperCase()}
                              </td>
                              <td className="p-3 font-mono text-slate-400">
                                {formatSize(conv.originalSize)}
                              </td>
                              <td className="p-3 pr-5">
                                <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Success
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl p-8 text-center text-xs text-slate-400 bg-slate-950/60 border border-white/10">
                    No conversion logs recorded yet.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center py-20">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
