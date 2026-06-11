"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { 
  Menu, X, LogIn, LogOut, User as UserIcon, ShieldAlert, History, LayoutDashboard, RefreshCw
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, loginWithGoogle, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleAdminLogin = async () => {
    try {
      await loginWithGoogle(true);
      router.push("/admin");
    } catch (error) {
      console.error("Admin Login failed", error);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-md shadow-lg shadow-black/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-white/10 transition-transform group-hover:scale-105 shadow-md shadow-primary/5">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M17 1l4 4-4 4" 
                    stroke="url(#logoGrad)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M3 9V9a4 4 0 014-4h14" 
                    stroke="url(#logoGrad)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M7 23l-4-4 4-4" 
                    stroke="url(#logoGrad)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M21 15v0a4 4 0 01-4 4H3" 
                    stroke="url(#logoGrad)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
              <span className="font-logo bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-3xl tracking-wide text-transparent group-hover:opacity-95 transition-opacity pt-1">
                Shifter
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-semibold transition-colors ${
                    isActive("/dashboard") ? "text-primary" : "text-slate-300 hover:text-primary"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/converters"
                  className={`text-sm font-semibold transition-colors ${
                    isActive("/converters") ? "text-primary" : "text-slate-300 hover:text-primary"
                  }`}
                >
                  Converters List
                </Link>
                <Link
                  href="/history"
                  className={`text-sm font-semibold transition-colors ${
                    isActive("/history") ? "text-primary" : "text-slate-300 hover:text-primary"
                  }`}
                >
                  History
                </Link>
                <Link
                  href="/profile"
                  className={`text-sm font-semibold transition-colors ${
                    isActive("/profile") ? "text-primary" : "text-slate-300 hover:text-primary"
                  }`}
                >
                  Profile & Usage
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`text-sm font-semibold transition-colors flex items-center gap-1 ${
                      isActive("/admin") ? "text-secondary" : "text-slate-300 hover:text-primary"
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/converters" className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors">
                  Converters
                </Link>
                <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors">
                  How It Works
                </a>
                <a href="#developers" className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors">
                  Developers
                </a>
              </>
            )}
          </div>

          {/* Profile/Auth Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 p-1 pr-3 hover:bg-slate-800/80 transition-colors"
                >
                  <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full bg-slate-800" />
                  <span className="text-sm font-bold text-slate-200 max-w-[120px] truncate">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/15 bg-slate-950 p-1 shadow-2xl glass-panel text-slate-200">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-200 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-all"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-all"
                    >
                      <History className="h-4 w-4" /> History
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-all"
                    >
                      <UserIcon className="h-4 w-4" /> My Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/10 hover:text-primary-hover transition-all border-t border-white/10"
                      >
                        <ShieldAlert className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border-t border-white/10 text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdminLogin}
                  className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors border border-zinc-200"
                >
                  Admin View
                </button>
                
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                >
                  <LogIn className="h-4 w-4" /> Continue with Google
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-200 bg-white px-4 py-4 md:hidden shadow-lg">
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold ${isActive("/dashboard") ? "text-primary" : "text-zinc-600"}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/converters"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold ${isActive("/converters") ? "text-primary" : "text-zinc-600"}`}
                >
                  Converters List
                </Link>
                <Link
                  href="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold ${isActive("/history") ? "text-primary" : "text-zinc-600"}`}
                >
                  History
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold ${isActive("/profile") ? "text-primary" : "text-zinc-600"}`}
                >
                  Profile & Usage
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold text-cyan-600"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="border-t border-zinc-100 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-zinc-700">{user.name}</p>
                      <p className="text-xs text-zinc-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl bg-rose-50 text-rose-600 px-4 py-2.5 text-sm font-bold hover:bg-rose-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/converters"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-zinc-600"
                >
                  Converters Directory
                </Link>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-zinc-600"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-zinc-600"
                >
                  How It Works
                </a>
                <div className="border-t border-zinc-100 pt-4 flex flex-col gap-3">
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-bold text-white shadow-md"
                  >
                    <LogIn className="h-4 w-4" /> Continue with Google
                  </button>
                  <button
                    onClick={handleAdminLogin}
                    className="text-sm font-semibold text-zinc-400 py-1 text-center"
                  >
                    Admin View
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
