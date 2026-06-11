"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { 
  History as HistoryIcon, Download, Trash2, Search, FileClock, 
  ArrowRight, CheckCircle2, RefreshCw
} from "lucide-react";

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

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<ConversionRecord[]>([]);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);

  const fetchHistory = () => {
    if (user) {
      setFetching(true);
      fetch(`/api/history?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setRecords(data.records);
          }
          setFetching(false);
        })
        .catch((err) => {
          console.error(err);
          setFetching(false);
        });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const clearHistory = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to clear your conversion history?")) return;

    try {
      const res = await fetch(`/api/history?userId=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setRecords([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-bg text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-slate-400">Loading Shifter History...</p>
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

  const filteredRecords = records.filter((r) =>
    r.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-light-bg text-slate-200 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-200 flex items-center gap-2.5">
                <HistoryIcon className="h-6 w-6 text-primary" /> Shift History
              </h1>
              <p className="text-sm text-slate-400 mt-1 font-semibold">
                View, search and download your completed file conversions.
              </p>
            </div>

            {records.length > 0 && (
              <button
                onClick={clearHistory}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/20 px-4 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors shadow-sm cursor-pointer"
              >
                <Trash2 className="h-4 w-4" /> Clear History
              </button>
            )}
          </div>

          {/* Filter Toolbar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search shifted files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm backdrop-blur-md"
            />
          </div>

          {/* Records Layout */}
          {fetching ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 bg-slate-950/60 backdrop-blur-md shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Original File</th>
                      <th className="p-4">Conversion</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record._id} className="border-b border-white/5 hover:bg-white/5 text-sm text-slate-400 transition-colors">
                        <td className="p-4 pl-6 font-bold text-slate-200 max-w-[200px] truncate">
                          {record.originalName}
                        </td>
                        <td className="p-4 font-mono text-xs">
                          <span className="rounded-lg bg-slate-900 border border-white/10 px-2 py-1 text-slate-400 font-semibold">{record.fromFormat.toUpperCase()}</span>
                          <ArrowRight className="inline-block h-3.5 w-3.5 mx-1 text-slate-500" />
                          <span className="rounded-lg bg-primary/20 border border-primary/30 px-2 py-1 text-primary font-bold">{record.toFormat.toUpperCase()}</span>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-400 font-bold">
                          {formatSize(record.originalSize)}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Completed
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-semibold">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <a
                            href={record.convertedFileUrl}
                            download
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover border border-transparent px-3 py-1.5 text-xs font-bold text-slate-950 transition-all shadow-md shadow-primary/20 cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-16 text-center border-white/10 bg-slate-950/60 flex flex-col items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10">
                <FileClock className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200">No conversions found</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  {search ? "No records match your search filter." : "Start shifting files to populate your conversion history!"}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
