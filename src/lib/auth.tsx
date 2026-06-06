"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: "Free";
  dailyConversionsCount: number;
  maxDailyConversions: number; // Infinity
  storageUsedBytes: number;
  maxStorageBytes: number; // Infinity
  role: "user" | "admin";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (isAdmin?: boolean) => Promise<User>;
  logout: () => void;
  incrementConversions: (fileSize: number) => boolean;
  resetUsage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUserToServer = async (u: User) => {
    try {
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u),
      });
    } catch (err) {
      console.error("Failed to sync user to server:", err);
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("shifter_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        syncUserToServer(u);
      } catch (e) {
        localStorage.removeItem("shifter_user");
      }
    }
    setLoading(false);
  }, []);

  const saveUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("shifter_user", JSON.stringify(newUser));
      syncUserToServer(newUser);
    } else {
      localStorage.removeItem("shifter_user");
    }
  };

  // Login With Google (Simulated OAuth)
  const loginWithGoogle = async (isAdmin = false): Promise<User> => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: isAdmin ? "admin-123" : "usr-" + Math.random().toString(36).substring(2, 9),
      name: isAdmin ? "Admin Balaji" : "Balaji Kumar",
      email: isAdmin ? "admin.balaji@shifter.in" : "balajikumar@gmail.com",
      avatar: isAdmin 
        ? "https://api.dicebear.com/7.x/bottts/svg?seed=admin" 
        : "https://api.dicebear.com/7.x/avataaars/svg?seed=balaji",
      plan: "Free",
      dailyConversionsCount: 0,
      maxDailyConversions: Infinity, // Unlimited
      storageUsedBytes: 0,
      maxStorageBytes: Infinity, // Unlimited
      role: isAdmin ? "admin" : "user",
      createdAt: new Date().toISOString(),
    };

    saveUser(mockUser);
    setLoading(false);
    return mockUser;
  };

  // Logout
  const logout = () => {
    saveUser(null);
  };

  // Increment usage counters (Always succeeds now as there are no limits!)
  const incrementConversions = (fileSize: number): boolean => {
    if (!user) return false;

    const updatedUser = {
      ...user,
      dailyConversionsCount: user.dailyConversionsCount + 1,
      storageUsedBytes: user.storageUsedBytes + fileSize,
    };

    saveUser(updatedUser);
    return true;
  };

  // Reset usage
  const resetUsage = () => {
    if (!user) return;
    saveUser({
      ...user,
      dailyConversionsCount: 0,
      storageUsedBytes: 0,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
        incrementConversions,
        resetUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
