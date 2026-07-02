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
   * Backend is the source of truth.
   * Reads the authenticated user from the HTTP-only cookies.
   */
  const checkAuthStatus = async () => {
    try {
      setLoading(true);

      const response = await api.get("/auth/profile");

      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Manual hydration helper.
   * Mainly useful after profile updates.
   */
  const login = (userData: UserProfile) => {
    setUser(userData);
  };

  /**
   * Email / Password Login
   */
  const loginWithPassword = async (email: string, password: string) => {
    await loginUser(email.toLowerCase().trim(), password);

    // Small delay gives mobile browsers time
    // to persist secure cookies.
    await new Promise((resolve) => setTimeout(resolve, 200));

    await checkAuthStatus();
  };

  /**
   * Register
   */
  const registerWithPassword = async (
    name: string,
    email: string,
    password: string,
  ) => {
    await registerUser(name.trim(), email.toLowerCase().trim(), password);

    await new Promise((resolve) => setTimeout(resolve, 200));

    await checkAuthStatus();
  };

  /**
   * Google Login
   */
  const loginWithGoogle = async (credential: string) => {
    await googleLogin(credential);

    await new Promise((resolve) => setTimeout(resolve, 200));

    await checkAuthStatus();
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      setLoading(true);

      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
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

        loginWithPassword,
        registerWithPassword,
        loginWithGoogle,

        logout,

        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
