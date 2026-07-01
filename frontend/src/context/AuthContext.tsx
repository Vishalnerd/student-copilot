"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { loginUser, googleLogin, registerUser } from "@/services/authApi";
import { api } from "@/lib/axios";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;

  login: (user: UserProfile) => void;

  loginWithPassword: (email: string, password: string) => Promise<void>;

  registerWithPassword: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;

  loginWithGoogle: (credential: string) => Promise<void>;

  logout: () => Promise<void>;

  checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🧠 Source of Truth: Core verification strategy on page mounts.
   * Leverages the existing httpOnly session cookie to hydrate client state.
   */
  const checkAuthStatus = async () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      // 💡 GUARD 2: Do not hit the profile endpoint if the user is on a public auth page
      if (path === "/login" || path === "/register" || path === "/") {
        setLoading(false);
        return;
      }
    }
    try {
      setLoading(true);
      const response = await api.get("/auth/profile");
      if (response.data) {
        login(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      // Catch silently on application boots: user is simply unauthenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * 🚀 Production Login Hydration Hook
   * Sets user profiles instantly into React state upon successful controller validation responses.
   */
  const login = (userData: UserProfile) => {
    setUser(userData);
    setLoading(false); // Safeguard: visually seals authentication checks as completed
  };

  const loginWithPassword = async (email: string, password: string) => {
    const response = await loginUser(email.toLowerCase().trim(), password);

    login(response.user);
  };

  const registerWithPassword = async (
    name: string,
    email: string,
    password: string,
  ) => {
    const response = await registerUser(
      name.trim(),
      email.toLowerCase().trim(),
      password,
    );
    login(response.user);
  };

  const loginWithGoogle = async (credential: string) => {
    const response = await googleLogin(credential);

    login(response.user);
  };

  /**
   * 🛑 Production Logout Cleanup Hook
   * Triggers the backend cookie flushing sequence and safely empties context memory spaces.
   */
  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Context tier caught log out failure exception:", error);
    } finally {
      setUser(null);
      setLoading(false);
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,

        registerWithPassword,
        loginWithPassword,
        loginWithGoogle,

        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
