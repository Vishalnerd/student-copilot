"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
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
  const {
    loginWithPassword,
    loginWithGoogle,
    user,
    loading: authLoading,
  } = useAuth();

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

      await loginWithPassword(email, password);

      toast.success("Welcome back!");

      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    if (!credentialResponse.credential) return;

    try {
      await loginWithGoogle(credentialResponse.credential);

      toast.success("Welcome!");

      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Google login failed");
    }
  };

  // Prevent flashing the form layout UI if the application is still resolving active cookie states
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <p className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
          Checking existing sessions...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] px-4 py-8 sm:px-6">
      {/* Ambient decorative blur nodes */}
      <div className="absolute top-[-20%] left-[-10%] w-[260px] h-[260px] sm:w-[500px] sm:h-[500px] rounded-full bg-blue-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] rounded-full bg-purple-200/30 blur-[130px] pointer-events-none" />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-md">
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
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Welcome back</h2>
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
                  className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
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
                  className="text-black w-full pl-10 pr-10 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
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

            <div className="flex justify-center w-full max-w-sm mx-auto overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
                theme="outline"
                size="large"
                text="continue_with"
                shape="pill"
                width="350"
              />
            </div>
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
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 sm:mt-8">
          <Link href="/terms" className="hover:text-gray-600 transition">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-gray-600 transition">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
