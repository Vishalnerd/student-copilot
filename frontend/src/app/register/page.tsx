"use client";

import { useState, useEffect } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
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
  const {
    user,
    loading: authLoading,
    loginWithGoogle,
    registerWithPassword,
  } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 💡 Mobile Fail-Fast State: Bypasses script hangs if session evaluation takes too long
  const [forceShowForm, setForceShowForm] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 💡 Mobile Performance Optimization:
    // If auth state validation doesn't explicitly resolve within 400ms,
    // display the registration form inputs anyway to keep mobile UX completely fluid.
    const timer = setTimeout(() => {
      setForceShowForm(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Redirect authenticated users cleanly away from auth forms
  useEffect(() => {
    if (mounted && !authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, mounted, router]);

  const handleGoogleAuth = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Google Sign Up Failed");
        return;
      }

      setLoading(true);
      await loginWithGoogle(credentialResponse.credential);
      toast.success("Welcome!");
      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Google Sign Up Failed");
    } finally {
      setLoading(false);
    }
  };

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
      await registerWithPassword(
        fullName.trim(),
        email.toLowerCase().trim(),
        password,
      );

      toast.success("Account created successfully! 🎉");
      router.replace("/dashboard");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMessage || "Registration failed");
      console.error("Backend Registry Rejection Log:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // 💡 Optimized Mobile Check Condition Rule
  const isVerifyingSession = !mounted || (authLoading && !user && !forceShowForm);

  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center space-y-3 px-4">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <p className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
          Verifying session status...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#faf8ff] bg-[radial-gradient(at_0%_0%,_hsla(217,100%,95%,1)_0,_transparent_50%),_radial-gradient(at_100%_0%,_hsla(245,100%,96%,1)_0,_transparent_50%),_radial-gradient(at_50%_100%,_hsla(217,100%,98%,1)_0,_transparent_50%)] px-4 py-8 sm:px-6">
      <div className="absolute top-[-15%] right-[-10%] h-[260px] w-[260px] rounded-full bg-blue-600/5 blur-[100px] sm:h-[500px] sm:w-[500px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] h-[260px] w-[260px] rounded-full bg-indigo-600/5 blur-[100px] sm:h-[500px] sm:w-[500px] pointer-events-none" />

      <main className="relative z-10 flex w-full max-w-md flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20 sm:h-14 sm:w-14">
            <Sparkles className="h-6 w-6 fill-white text-white sm:h-7 sm:w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            Student Copilot
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Your journey to academic excellence begins here.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="full_name" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Full Name
              </label>
              <div className="relative rounded-lg transition-all group focus-within:scale-[1.01]">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="full_name"
                  type="text"
                  placeholder="Alex Johnson"
                  value={fullName}
                  disabled={loading}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-black placeholder-gray-400 shadow-inner transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Email Address
              </label>
              <div className="relative rounded-lg transition-all group focus-within:scale-[1.01]">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-black placeholder-gray-400 shadow-inner transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Password
              </label>
              <div className="relative rounded-lg transition-all group focus-within:scale-[1.01]">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-black placeholder-gray-400 shadow-inner transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="px-1 text-[11px] font-medium text-gray-400">
                Must be at least 8 characters long.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/10 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Workspace...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/60"></div>
              </div>
              <span className="relative bg-white px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                Or sign up with
              </span>
            </div>

            <div className="flex justify-center w-full max-w-sm mx-auto overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleAuth}
                onError={() => toast.error("Google Sign Up Failed")}
                theme="outline"
                size="large"
                text="signup_with"
                shape="pill"
                width="350"
              />
            </div>
          </form>

          <div className="mt-6 space-y-4 text-center">
            <p className="text-xs font-medium text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Login here
              </Link>
            </p>

            <p className="mx-auto max-w-xs text-[11px] leading-relaxed text-gray-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-gray-600">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Secure Data
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Zap className="h-4 w-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              AI Enhanced
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}