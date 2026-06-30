"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // 💡 Pull context handles from your cookie-driven AuthContext
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();

  // 🛡️ SECURITY GUARD: If the user is already authenticated, redirect them automatically
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  // 🚀 CORE HANDLER: Fully productionized login execution loop
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error("Please fill in all required fields");
        return;
      }

      setLoading(true);

      // 1. Hit the Express backend API. Cookies (accessToken/refreshToken) are set via HTTP headers.
      const response = await loginUser(email.toLowerCase().trim(), password);

      if (!response || !response.user) {
        throw new Error("Invalid session metadata returned from auth gateway");
      }

      // 2. 💡 FIX: Sync the user profile payload directly to the React state tree context
      login(response.user);

      toast.success(`Welcome back, ${response.user.name}!`);

      // 3. Clear routing history traces by using replace instead of push
      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Login Submission Fault:", error);
      toast.error(
        error?.response?.data?.message ||
          "Invalid email credentials or password",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prevent flashing the form layout UI if the application is still resolving active cookie states
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <p className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
          Checking existing sessions...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient decorative blur nodes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-[130px] pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 flex flex-col items-center relative z-10">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/20 mb-3">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Student Copilot
        </h1>
        <p className="text-xs text-gray-400 font-medium tracking-wide mt-0.5">
          AI Study Assistant
        </p>
      </div>

      {/* Login Workspace Card */}
      <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative z-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Please enter your details to sign in.
          </p>
        </div>

        <div className="space-y-4">
          {/* Email input field */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="name@university.edu"
                className="text-black w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password input field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="text-black w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Trigger */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm py-2.5 rounded-xl transition shadow-sm mt-4 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* OAuth Mock placeholder */}
          <button
            type="button"
            className="w-full border border-gray-200 hover:bg-slate-50 font-bold text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-gray-700 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.415 1.143 15.624 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.77 0-.795-.085-1.4-.195-1.945H12.24z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs font-medium text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Footer legal links */}
      <div className="mt-8 flex items-center gap-3 text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase relative z-10">
        <Link href="/terms" className="hover:text-gray-600 transition">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="/privacy" className="hover:text-gray-600 transition">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
