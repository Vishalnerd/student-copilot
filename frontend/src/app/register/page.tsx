"use client";

import { useState, useEffect } from "react";
import { registerUser } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🛡️ SECURITY GUARD: If the user is already authenticated, redirect them automatically away from auth pages
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      // 🚀 Clean API submission matching your Express register endpoint params
      await registerUser(fullName.trim(), email.toLowerCase().trim(), password);

      toast.success("Account created successfully! 🎉");

      // Clear navigation history stack during redirection bounds
      router.replace("/login");
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMessage || "Registration failed");
      console.error("Backend Registry Rejection Log:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Prevent form flickering while app evaluates active cookie environments on boot
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <p className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
          Verifying session status...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#faf8ff] bg-[radial-gradient(at_0%_0%,_hsla(217,100%,95%,1)_0,_transparent_50%),_radial-gradient(at_100%_0%,_hsla(245,100%,96%,1)_0,_transparent_50%),_radial-gradient(at_50%_100%,_hsla(217,100%,98%,1)_0,_transparent_50%)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glowing Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 flex flex-col justify-center">
        {/* Logo Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-600/20">
            <Sparkles className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Student Copilot
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Your journey to academic excellence begins here.
          </p>
        </div>

        {/* Card Form container */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-8 shadow-xs hover:shadow-md transition-shadow duration-300">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label
                className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500"
                htmlFor="full_name"
              >
                Full Name
              </label>
              <div className="relative group transition-all rounded-lg focus-within:scale-[1.01]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="full_name"
                  type="text"
                  placeholder="Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-black w-full bg-slate-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Email Address Field */}
            <div className="space-y-2">
              <label
                className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group transition-all rounded-lg focus-within:scale-[1.01]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black w-full bg-slate-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group transition-all rounded-lg focus-within:scale-[1.01]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-black w-full bg-slate-50 border border-gray-200 rounded-lg py-3 pl-11 pr-11 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 font-medium px-1">
                Must be at least 8 characters long.
              </p>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm py-3 px-4 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-blue-600/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Workspace...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Section Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/60"></div>
              </div>
              <span className="relative bg-white px-4 text-[10px] font-mono font-bold tracking-wider uppercase text-gray-400">
                Or sign up with
              </span>
            </div>

            {/* Google OAuth Button Placeholder */}
            <button
              type="button"
              className="w-full bg-white border border-gray-200 hover:bg-slate-50 text-gray-700 font-bold text-sm py-3 px-4 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Footer Navigation items */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-xs text-gray-500 font-medium">
              Already have an account?{" "}
              <Link
                className="text-blue-600 font-bold hover:underline"
                href="/login"
              >
                Login here
              </Link>
            </p>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-[320px] mx-auto">
              By creating an account, you agree to our{" "}
              <Link className="underline hover:text-gray-600" href="/terms">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link className="underline hover:text-gray-600" href="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Security / Feature Badges */}
        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-1.5 text-gray-400/80">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Secure Data
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400/80">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              AI Enhanced
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
